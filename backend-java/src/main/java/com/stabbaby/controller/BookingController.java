package com.stabbaby.controller;

import com.stabbaby.dto.BookingRequest;
import com.stabbaby.dto.BookingResponse;
import com.stabbaby.dto.CancelRequest;
import com.stabbaby.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    
    @PostMapping
    public ResponseEntity<BookingResponse> create(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(request));
    }

 
    @GetMapping("/{referenceCode}")
    public ResponseEntity<BookingResponse> get(@PathVariable String referenceCode,
                                               @RequestParam String contactNumber) {
        return ResponseEntity.ok(bookingService.getBooking(referenceCode, contactNumber));
    }


    @PatchMapping("/{referenceCode}/cancel")
    public ResponseEntity<BookingResponse> cancel(@PathVariable String referenceCode,
                                                  @Valid @RequestBody CancelRequest request) {
        return ResponseEntity.ok(bookingService.cancelBooking(referenceCode, request.contactNumber()));
    }
}