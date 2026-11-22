package com.stabbaby.dto;

import com.stabbaby.model.Booking;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record BookingResponse(
        String referenceCode,
        String fullName,
        String contactNumber,
        LocalDate preferredDate,
        String preferredTime,
        String piercingType,
        String notes,
        String status,
        LocalDateTime createdAt
) {
    public static BookingResponse from(Booking b) {
        return new BookingResponse(
                b.getReferenceCode(),
                b.getFullName(),
                b.getContactNumber(),
                b.getPreferredDate(),
                b.getPreferredTime(),
                b.getPiercingType(),
                b.getNotes(),
                b.getStatus().name(),
                b.getCreatedAt()
        );
    }
}