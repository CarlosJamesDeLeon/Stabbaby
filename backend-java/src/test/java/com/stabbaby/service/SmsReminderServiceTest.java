package com.stabbaby.service;

import com.stabbaby.model.Booking;
import com.stabbaby.model.BookingStatus;
import com.stabbaby.model.SmsReminder;
import com.stabbaby.model.SmsReminderStatus;
import com.stabbaby.repository.BookingRepository;
import com.stabbaby.repository.SmsReminderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@SpringBootTest(properties = {
        "stabbaby.sms.enabled=false",
        "stabbaby.sms.hours-before=24",
        "spring.datasource.url=jdbc:h2:mem:sms_reminder_test",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class SmsReminderServiceTest {
    private static final LocalDateTime APPOINTMENT = LocalDateTime.of(2027, 1, 2, 12, 0);
    private static final LocalDateTime DUE = APPOINTMENT.minusHours(24);

    @Autowired
    private BookingRepository bookings;

    @Autowired
    private SmsReminderRepository reminders;

    @Autowired
    private SmsReminderService service;

    @MockBean
    private SmsService sms;

    @BeforeEach
    void clearBookings() {
        reminders.deleteAll();
        bookings.deleteAll();
    }

    @Test
    void sendsAtDueTimeOnlyOnceAndRecordsDelivery() throws Exception {
        saveBooking(BookingStatus.PENDING);
        when(sms.sendSms(anyString(), anyString())).thenReturn("provider-123");
        when(sms.checkDelivery("provider-123")).thenReturn(SmsReminderStatus.DELIVERED);

        service.processReminders(DUE.minusMinutes(1));
        verifyNoInteractions(sms);

        service.processReminders(DUE);
        assertEquals(SmsReminderStatus.ACCEPTED, savedReminder().getStatus());
        service.processReminders(DUE.plusMinutes(1));
        service.processReminders(DUE.plusMinutes(2));

        assertEquals(SmsReminderStatus.DELIVERED, savedReminder().getStatus());
        verify(sms).sendSms("09171234567",
                "Stabbaby reminder: your booking SB-TEST is on 2027-01-02 at 12PM (Manila time).");
    }

    @Test
    void skipsCancelledAndPastBookings() {
        Booking booking = saveBooking(BookingStatus.CANCELLED);
        service.processReminders(DUE);
        booking.setStatus(BookingStatus.CONFIRMED);
        bookings.saveAndFlush(booking);
        service.processReminders(APPOINTMENT);

        assertEquals(0, reminders.count());
        verifyNoInteractions(sms);
    }

    @Test
    void retriesClearTemporaryFailureAndStoresTheAcceptedResult() throws Exception {
        saveBooking(BookingStatus.CONFIRMED);
        when(sms.sendSms(anyString(), anyString()))
                .thenThrow(new SmsService.SmsException(SmsReminderStatus.RETRY, "Rate limited"))
                .thenReturn("provider-123");

        service.processReminders(DUE);
        assertEquals(SmsReminderStatus.RETRY, savedReminder().getStatus());
        service.processReminders(DUE.plusMinutes(4));
        verify(sms).sendSms(anyString(), anyString());
        service.processReminders(DUE.plusMinutes(5));

        assertEquals(2, savedReminder().getAttemptCount());
        assertEquals(SmsReminderStatus.ACCEPTED, savedReminder().getStatus());
    }

    @Test
    void stopsAfterThreeTemporaryFailures() throws Exception {
        saveBooking(BookingStatus.CONFIRMED);
        when(sms.sendSms(anyString(), anyString()))
                .thenThrow(new SmsService.SmsException(SmsReminderStatus.RETRY, "Rate limited"));

        service.processReminders(DUE);
        service.processReminders(DUE.plusMinutes(5));
        service.processReminders(DUE.plusMinutes(10));
        service.processReminders(DUE.plusMinutes(15));

        assertEquals(SmsReminderStatus.FAILED, savedReminder().getStatus());
        verify(sms, times(3)).sendSms(anyString(), anyString());
    }

    @Test
    void doesNotRetryAnAmbiguousSend() throws Exception {
        saveBooking(BookingStatus.PENDING);
        when(sms.sendSms(anyString(), anyString()))
                .thenThrow(new SmsService.SmsException(SmsReminderStatus.UNKNOWN, "Timed out"));

        service.processReminders(DUE);
        service.processReminders(DUE.plusMinutes(30));

        assertEquals(SmsReminderStatus.UNKNOWN, savedReminder().getStatus());
        verify(sms).sendSms(anyString(), anyString());
    }

    @Test
    void recordsProviderDeliveryFailureWithoutSendingAgain() throws Exception {
        saveBooking(BookingStatus.CONFIRMED);
        when(sms.sendSms(anyString(), anyString())).thenReturn("provider-123");
        when(sms.checkDelivery("provider-123")).thenReturn(SmsReminderStatus.FAILED);

        service.processReminders(DUE);
        service.processReminders(DUE.plusMinutes(1));
        service.processReminders(DUE.plusMinutes(2));

        assertEquals(SmsReminderStatus.FAILED, savedReminder().getStatus());
        verify(sms).sendSms(anyString(), anyString());
    }

    @Test
    void databaseRejectsTwoRemindersForOneBooking() {
        Booking booking = saveBooking(BookingStatus.PENDING);
        reminders.saveAndFlush(new SmsReminder(booking, DUE, DUE));
        assertThrows(DataIntegrityViolationException.class,
                () -> reminders.saveAndFlush(new SmsReminder(booking, DUE, DUE)));
    }

    @Test
    void recoversInterruptedSendWithoutSendingAgain() {
        Booking booking = saveBooking(BookingStatus.PENDING);
        reminders.saveAndFlush(new SmsReminder(booking, DUE, DUE));

        service.processReminders(DUE.plusMinutes(6));

        assertEquals(SmsReminderStatus.UNKNOWN, savedReminder().getStatus());
        verifyNoInteractions(sms);
    }

    private SmsReminder savedReminder() {
        return reminders.findAll().get(0);
    }

    private Booking saveBooking(BookingStatus status) {
        Booking booking = new Booking();
        booking.setReferenceCode("SB-TEST");
        booking.setFullName("Test Customer");
        booking.setContactNumber("09171234567");
        booking.setPreferredDate(APPOINTMENT.toLocalDate());
        booking.setPreferredTime("12PM");
        booking.setPiercingType("ear");
        booking.setStatus(status);
        return bookings.saveAndFlush(booking);
    }
}
