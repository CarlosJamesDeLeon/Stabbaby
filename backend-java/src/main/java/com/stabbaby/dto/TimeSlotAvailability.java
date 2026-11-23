package com.stabbaby.dto;

public record TimeSlotAvailability(
        String time,
        boolean available,
        boolean walkInHour
) {}
