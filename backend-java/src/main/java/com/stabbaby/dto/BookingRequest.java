package com.stabbaby.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record BookingRequest(

        @NotBlank(message = "Full name is required")
        @Size(max = 100, message = "Full name must be at most 100 characters")
        String fullName,

        @NotBlank(message = "Contact number is required")
        @Pattern(regexp = "^[0-9+\\-\\s]{7,20}$", message = "Enter a valid contact number")
        String contactNumber,

        @NotNull(message = "Preferred date is required")
        @FutureOrPresent(message = "Preferred date cannot be in the past")
        LocalDate preferredDate,

        @NotBlank(message = "Preferred time is required")
        @Pattern(regexp = "^(12|[1-8])PM$", message = "Time must be between 12PM and 8PM")
        String preferredTime,

        @NotBlank(message = "Piercing type is required")
        @Pattern(regexp = "^(ear|nose|lip|eyebrow|body|dermal|other)$",
                 message = "Invalid piercing type")
        String piercingType,

        @Size(max = 500, message = "Notes must be at most 500 characters")
        String notes
) {}