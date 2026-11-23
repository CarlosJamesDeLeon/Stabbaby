package com.stabbaby.service;

import com.stabbaby.dto.*;
import com.stabbaby.exception.BookingConflictException;
import com.stabbaby.exception.BookingNotFoundException;
import com.stabbaby.exception.BookingRuleException;
import com.stabbaby.model.BlockedDate;
import com.stabbaby.model.Booking;
import com.stabbaby.model.BookingStatus;
import com.stabbaby.repository.BlockedDateRepository;
import com.stabbaby.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CalendarService {

    public static final List<String> ALL_TIME_SLOTS = List.of(
            "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM"
    );

    public static final Set<String> WALK_IN_HOURS = Set.of(
            "3PM", "4PM", "5PM", "6PM", "7PM"
    );

    private final BlockedDateRepository blockedDateRepository;
    private final BookingRepository bookingRepository;

    public CalendarService(BlockedDateRepository blockedDateRepository,
                           BookingRepository bookingRepository) {
        this.blockedDateRepository = blockedDateRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public List<BlockedDate> getAllBlockedDates() {
        return blockedDateRepository.findAll();
    }

    @Transactional
    public BlockedDate blockDate(BlockedDateRequest request) {
        String dateStr = request.date().trim();
        if (blockedDateRepository.existsByDate(dateStr)) {
            throw new BookingConflictException("This date is already blocked.");
        }
        BlockedDate entity = new BlockedDate(dateStr, request.reason() != null ? request.reason().trim() : null);
        return blockedDateRepository.save(entity);
    }

    @Transactional
    public void unblockDate(Long id) {
        if (!blockedDateRepository.existsById(id)) {
            throw new BookingNotFoundException("Blocked date not found with id: " + id);
        }
        blockedDateRepository.deleteById(id);
    }

    @Transactional
    public void unblockDateByDate(String date) {
        BlockedDate blocked = blockedDateRepository.findByDate(date.trim())
                .orElseThrow(() -> new BookingNotFoundException("Blocked date not found for date: " + date));
        blockedDateRepository.delete(blocked);
    }

    @Transactional(readOnly = true)
    public UnavailableDatesResponse getUnavailableDates() {
        List<BlockedDate> blockedList = blockedDateRepository.findAll();
        List<String> blockedDates = blockedList.stream()
                .map(BlockedDate::getDate)
                .sorted()
                .toList();

        LocalDate today = LocalDate.now();
        List<Booking> futureActiveBookings = bookingRepository.findByPreferredDateGreaterThanEqualAndStatusNot(
                today, BookingStatus.CANCELLED
        );

        Map<LocalDate, Set<String>> bookedSlotsByDate = new HashMap<>();
        for (Booking b : futureActiveBookings) {
            bookedSlotsByDate
                    .computeIfAbsent(b.getPreferredDate(), k -> new HashSet<>())
                    .add(b.getPreferredTime());
        }

        List<String> fullyBookedDates = new ArrayList<>();
        for (Map.Entry<LocalDate, Set<String>> entry : bookedSlotsByDate.entrySet()) {
            String dateStr = entry.getKey().toString();
            if (!blockedDates.contains(dateStr) && entry.getValue().containsAll(ALL_TIME_SLOTS)) {
                fullyBookedDates.add(dateStr);
            }
        }
        Collections.sort(fullyBookedDates);

        Set<String> allUnavailable = new TreeSet<>(blockedDates);
        allUnavailable.addAll(fullyBookedDates);

        List<UnavailableDateItem> details = new ArrayList<>();
        for (BlockedDate bd : blockedList) {
            details.add(new UnavailableDateItem(bd.getDate(), "BLOCKED", bd.getReason()));
        }
        for (String fDate : fullyBookedDates) {
            details.add(new UnavailableDateItem(fDate, "FULLY_BOOKED", "All appointment slots booked"));
        }

        return new UnavailableDatesResponse(
                new ArrayList<>(allUnavailable),
                blockedDates,
                fullyBookedDates,
                details
        );
    }

    @Transactional(readOnly = true)
    public DayAvailabilityResponse getDayAvailability(String dateStr) {
        LocalDate parsedDate;
        try {
            parsedDate = LocalDate.parse(dateStr.trim());
        } catch (DateTimeParseException e) {
            throw new BookingRuleException("Invalid date format. Expected YYYY-MM-DD.");
        }

        Optional<BlockedDate> blockedOpt = blockedDateRepository.findByDate(dateStr.trim());
        boolean isBlocked = blockedOpt.isPresent();
        String blockedReason = blockedOpt.map(BlockedDate::getReason).orElse(null);

        DayOfWeek dayOfWeek = parsedDate.getDayOfWeek();
        boolean isWalkInDay = (dayOfWeek == DayOfWeek.THURSDAY || dayOfWeek == DayOfWeek.FRIDAY);
        String walkInHours = isWalkInDay ? "3PM — 7PM (Walk-ins welcome)" : null;

        List<Booking> activeBookings = bookingRepository.findByPreferredDateAndStatusNot(
                parsedDate, BookingStatus.CANCELLED
        );
        Set<String> bookedTimes = activeBookings.stream()
                .map(Booking::getPreferredTime)
                .collect(Collectors.toSet());

        boolean fullyBooked = !isBlocked && bookedTimes.containsAll(ALL_TIME_SLOTS);

        List<TimeSlotAvailability> slots = new ArrayList<>();
        for (String slot : ALL_TIME_SLOTS) {
            boolean isTaken = bookedTimes.contains(slot);
            boolean available = !isBlocked && !isTaken;
            boolean walkInHour = isWalkInDay && WALK_IN_HOURS.contains(slot);
            slots.add(new TimeSlotAvailability(slot, available, walkInHour));
        }

        return new DayAvailabilityResponse(
                dateStr.trim(),
                isBlocked,
                blockedReason,
                isWalkInDay,
                walkInHours,
                fullyBooked,
                slots
        );
    }
}
