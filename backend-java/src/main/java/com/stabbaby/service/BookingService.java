package com.stabbaby.service;

import com.stabbaby.dto.BookingRequest;
import com.stabbaby.dto.BookingResponse;
import com.stabbaby.exception.BookingConflictException;
import com.stabbaby.exception.BookingNotFoundException;
import com.stabbaby.exception.BookingRuleException;
import com.stabbaby.model.Booking;
import com.stabbaby.model.BookingStatus;
import com.stabbaby.repository.BlockedDateRepository;
import com.stabbaby.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDate;

@Service
public class BookingService {

    // No 0/O or 1/I so codes are easy to read and type
    private static final String CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int CODE_LENGTH = 6;

    private final SecureRandom random = new SecureRandom();

    private final BookingRepository bookingRepository;
    private final BlockedDateRepository blockedDateRepository;

    public BookingService(BookingRepository bookingRepository,
                          BlockedDateRepository blockedDateRepository) {
        this.bookingRepository = bookingRepository;
        this.blockedDateRepository = blockedDateRepository;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        if (blockedDateRepository.findByDate(request.preferredDate().toString()).isPresent()) {
            throw new BookingRuleException("The studio is closed on that date. Please pick another day.");
        }

        boolean slotTaken = bookingRepository.existsByPreferredDateAndPreferredTimeAndStatusNot(
                request.preferredDate(), request.preferredTime(), BookingStatus.CANCELLED);
        if (slotTaken) {
            throw new BookingConflictException("That time slot is already booked. Please pick another time.");
        }

        Booking booking = new Booking();
        booking.setReferenceCode(generateReferenceCode());
        booking.setFullName(request.fullName().trim());
        booking.setContactNumber(normalizeContact(request.contactNumber()));
        booking.setPreferredDate(request.preferredDate());
        booking.setPreferredTime(request.preferredTime());
        booking.setPiercingType(request.piercingType());
        booking.setNotes(request.notes() == null ? null : request.notes().trim());
        booking.setStatus(BookingStatus.PENDING);

        return BookingResponse.from(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public BookingResponse getBooking(String referenceCode, String contactNumber) {
        return BookingResponse.from(findOwnedBooking(referenceCode, contactNumber));
    }

    @Transactional
    public BookingResponse cancelBooking(String referenceCode, String contactNumber) {
        Booking booking = findOwnedBooking(referenceCode, contactNumber);

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BookingRuleException("This booking is already cancelled.");
        }
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BookingRuleException("A completed booking cannot be cancelled.");
        }
        if (booking.getPreferredDate().isBefore(LocalDate.now())) {
            throw new BookingRuleException("Past bookings cannot be cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return BookingResponse.from(bookingRepository.save(booking));
    }

    // Reference code AND phone number must both match.
    // Same error for either mistake, so nobody can guess which one was wrong.
    private Booking findOwnedBooking(String referenceCode, String contactNumber) {
        return bookingRepository
                .findByReferenceCodeAndContactNumber(
                        referenceCode.trim().toUpperCase(),
                        normalizeContact(contactNumber))
                .orElseThrow(() -> new BookingNotFoundException(
                        "No booking found. Check your reference code and contact number."));
    }

    private String normalizeContact(String contact) {
        return contact.replaceAll("[\\s\\-]", "");
    }

    private String generateReferenceCode() {
        String code;
        do {
            StringBuilder sb = new StringBuilder("SB-");
            for (int i = 0; i < CODE_LENGTH; i++) {
                sb.append(CODE_CHARS.charAt(random.nextInt(CODE_CHARS.length())));
            }
            code = sb.toString();
        } while (bookingRepository.existsByReferenceCode(code));
        return code;
    }
}