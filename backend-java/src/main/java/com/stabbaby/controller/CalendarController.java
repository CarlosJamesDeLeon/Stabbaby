package com.stabbaby.controller;

import com.stabbaby.dto.BlockedDateRequest;
import com.stabbaby.dto.DayAvailabilityResponse;
import com.stabbaby.dto.UnavailableDatesResponse;
import com.stabbaby.model.BlockedDate;
import com.stabbaby.service.CalendarService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CalendarController {

    private final CalendarService calendarService;

    public CalendarController(CalendarService calendarService) {
        this.calendarService = calendarService;
    }

    @GetMapping("/blocked-dates")
    public ResponseEntity<List<BlockedDate>> getBlockedDates() {
        return ResponseEntity.ok(calendarService.getAllBlockedDates());
    }

    @PostMapping("/blocked-dates")
    public ResponseEntity<BlockedDate> blockDate(@Valid @RequestBody BlockedDateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(calendarService.blockDate(request));
    }

    @DeleteMapping("/blocked-dates/{id}")
    public ResponseEntity<Void> unblockDate(@PathVariable Long id) {
        calendarService.unblockDate(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/blocked-dates")
    public ResponseEntity<Void> unblockDateByDate(@RequestParam String date) {
        calendarService.unblockDateByDate(date);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/calendar/unavailable-dates")
    public ResponseEntity<UnavailableDatesResponse> getUnavailableDates() {
        return ResponseEntity.ok(calendarService.getUnavailableDates());
    }

    @GetMapping("/calendar/availability")
    public ResponseEntity<DayAvailabilityResponse> getDayAvailability(@RequestParam String date) {
        return ResponseEntity.ok(calendarService.getDayAvailability(date));
    }
}
