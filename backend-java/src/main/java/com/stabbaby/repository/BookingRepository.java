package com.stabbaby.repository;

import com.stabbaby.model.Booking;
import com.stabbaby.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsByReferenceCode(String referenceCode);

    Optional<Booking> findByReferenceCodeAndContactNumber(String referenceCode, String contactNumber);

    // A slot is taken if any booking on that date/time is NOT cancelled
    boolean existsByPreferredDateAndPreferredTimeAndStatusNot(
            LocalDate preferredDate, String preferredTime, BookingStatus status);

    List<Booking> findByPreferredDateAndStatusNot(LocalDate preferredDate, BookingStatus status);

    List<Booking> findByPreferredDateGreaterThanEqualAndStatusNot(LocalDate fromDate, BookingStatus status);
}
