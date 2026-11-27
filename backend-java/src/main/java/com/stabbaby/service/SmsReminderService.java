package com.stabbaby.service;

import com.stabbaby.model.Booking;
import com.stabbaby.model.BookingStatus;
import com.stabbaby.model.SmsReminder;
import com.stabbaby.model.SmsReminderStatus;
import com.stabbaby.repository.BookingRepository;
import com.stabbaby.repository.SmsReminderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;

@Service
public class SmsReminderService {
    private static final Logger log = LoggerFactory.getLogger(SmsReminderService.class);
    private static final ZoneId MANILA = ZoneId.of("Asia/Manila");
    private static final DateTimeFormatter SLOT_TIME = DateTimeFormatter.ofPattern("ha", Locale.ENGLISH);
    private static final List<BookingStatus> ELIGIBLE = List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED);

    private final BookingRepository bookings;
    private final SmsReminderRepository reminders;
    private final SmsService sms;
    private final boolean enabled;
    private final int hoursBefore;

    public SmsReminderService(BookingRepository bookings, SmsReminderRepository reminders, SmsService sms,
                              @Value("${stabbaby.sms.enabled}") boolean enabled,
                              @Value("${stabbaby.sms.hours-before}") int hoursBefore,
                              @Value("${spring.datasource.url}") String databaseUrl) {
        if (enabled && databaseUrl.startsWith("jdbc:h2:mem:")) {
            throw new IllegalArgumentException("SMS reminders require a persistent database");
        }
        if (hoursBefore < 1) {
            throw new IllegalArgumentException("SMS reminder lead time must be at least one hour");
        }
        this.bookings = bookings;
        this.reminders = reminders;
        this.sms = sms;
        this.enabled = enabled;
        this.hoursBefore = hoursBefore;
    }

    @Scheduled(fixedDelay = 60000)
    public void checkReminders() {
        if (enabled) {
            processReminders(LocalDateTime.now(MANILA));
        }
    }

    void processReminders(LocalDateTime now) {
        for (SmsReminder reminder : reminders.findByStatusAndUpdatedAtBefore(
                SmsReminderStatus.SENDING, now.minusMinutes(5))) {
            reminder.finish(SmsReminderStatus.UNKNOWN, "Send outcome could not be verified", now);
            saveStatus(reminder);
        }

        for (SmsReminder reminder : reminders.findByStatus(SmsReminderStatus.ACCEPTED)) {
            refreshDelivery(reminder, now);
        }

        for (SmsReminder reminder : reminders.findByStatusAndNextAttemptAtLessThanEqual(
                SmsReminderStatus.RETRY, now)) {
            Booking booking = reminder.getBooking();
            LocalDateTime appointment = appointmentTime(booking);
            if (!ELIGIBLE.contains(booking.getStatus()) || appointment == null || !appointment.isAfter(now)) {
                reminder.finish(SmsReminderStatus.SKIPPED, "Booking is no longer eligible", now);
                saveStatus(reminder);
            } else {
                reminder.claim(now);
                reminder = saveStatus(reminder);
                if (reminder != null) {
                    sendReminder(reminder, appointment, now);
                }
            }
        }

        LocalDateTime latest = now.plusHours(hoursBefore);
        for (Booking booking : bookings.findByStatusInAndPreferredDateBetween(
                ELIGIBLE, now.toLocalDate(), latest.toLocalDate())) {
            LocalDateTime appointment = appointmentTime(booking);
            if (appointment != null && appointment.isAfter(now) && !appointment.isAfter(latest)
                    && !reminders.existsByBookingId(booking.getId())) {
                SmsReminder reminder = new SmsReminder(booking, appointment.minusHours(hoursBefore), now);
                try {
                    reminder = reminders.saveAndFlush(reminder);
                } catch (DataIntegrityViolationException e) {
                    if (reminders.existsByBookingId(booking.getId())) {
                        continue;
                    }
                    throw e;
                }
                sendReminder(reminder, appointment, now);
            }
        }
    }

    private LocalDateTime appointmentTime(Booking booking) {
        try {
            return booking.getPreferredDate().atTime(
                    LocalTime.parse(booking.getPreferredTime().trim().toUpperCase(Locale.ENGLISH), SLOT_TIME));
        } catch (DateTimeParseException e) {
            log.warn("Could not read the appointment time for booking {}", booking.getId());
            return null;
        }
    }

    private void sendReminder(SmsReminder reminder, LocalDateTime appointment, LocalDateTime now) {
        Booking booking = bookings.findById(reminder.getBooking().getId()).orElse(null);
        if (booking == null || !ELIGIBLE.contains(booking.getStatus())
                || !appointment.equals(appointmentTime(booking))) {
            reminder.finish(SmsReminderStatus.SKIPPED, "Booking changed before sending", now);
            saveStatus(reminder);
            return;
        }

        String message = "Stabbaby reminder: your booking " + booking.getReferenceCode() + " is on "
                + booking.getPreferredDate() + " at " + booking.getPreferredTime() + " (Manila time).";
        try {
            reminder.accept(sms.sendSms(booking.getContactNumber(), message), now);
        } catch (SmsService.SmsException e) {
            if (e.getStatus() == SmsReminderStatus.RETRY && reminder.getAttemptCount() < 3
                    && now.plusMinutes(5).isBefore(appointment)) {
                reminder.retry(now, e.getMessage());
            } else {
                SmsReminderStatus status = e.getStatus() == SmsReminderStatus.RETRY
                        ? SmsReminderStatus.FAILED : e.getStatus();
                reminder.finish(status, e.getMessage(), now);
            }
        }
        saveStatus(reminder);
    }

    private void refreshDelivery(SmsReminder reminder, LocalDateTime now) {
        if (now.isAfter(reminder.getAcceptedAt().plusDays(2))) {
            reminder.finish(SmsReminderStatus.UNKNOWN, "No final delivery status within two days", now);
            saveStatus(reminder);
            return;
        }
        try {
            SmsReminderStatus status = sms.checkDelivery(reminder.getProviderMessageId());
            if (status == SmsReminderStatus.DELIVERED) {
                reminder.finish(status, null, now);
                saveStatus(reminder);
            } else if (status == SmsReminderStatus.FAILED) {
                reminder.finish(status, "PhilSMS reported delivery failure", now);
                saveStatus(reminder);
            }
        } catch (SmsService.SmsException e) {
            log.warn("Could not check delivery for booking {}: {}", reminder.getBooking().getId(), e.getMessage());
        }
    }

    private SmsReminder saveStatus(SmsReminder reminder) {
        try {
            return reminders.saveAndFlush(reminder);
        } catch (OptimisticLockingFailureException e) {
            return null;
        }
    }
}
