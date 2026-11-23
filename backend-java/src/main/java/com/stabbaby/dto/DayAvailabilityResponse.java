package com.stabbaby.dto;

import java.util.List;

public record DayAvailabilityResponse(
        String date,
        boolean blocked,
        String blockedReason,
        boolean walkInDay,
        String walkInHours,
        boolean fullyBooked,
        List<TimeSlotAvailability> slots
) {}
