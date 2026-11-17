package com.stabbaby.controller;

import com.stabbaby.model.BlockedDate;
import com.stabbaby.service.CalendarService;
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
}
