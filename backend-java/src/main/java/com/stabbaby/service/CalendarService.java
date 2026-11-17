package com.stabbaby.service;

import com.stabbaby.model.BlockedDate;
import com.stabbaby.repository.BlockedDateRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CalendarService {

    private final BlockedDateRepository blockedDateRepository;

    public CalendarService(BlockedDateRepository blockedDateRepository) {
        this.blockedDateRepository = blockedDateRepository;
    }

    public List<BlockedDate> getAllBlockedDates() {
        return blockedDateRepository.findAll();
    }
}
