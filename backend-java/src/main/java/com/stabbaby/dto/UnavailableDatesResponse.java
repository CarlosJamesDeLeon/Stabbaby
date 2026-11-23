package com.stabbaby.dto;

import java.util.List;

public record UnavailableDatesResponse(
        List<String> unavailableDates,
        List<String> blockedDates,
        List<String> fullyBookedDates,
        List<UnavailableDateItem> details
) {}
