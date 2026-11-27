package com.stabbaby.repository;

import com.stabbaby.model.SmsReminder;
import com.stabbaby.model.SmsReminderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SmsReminderRepository extends JpaRepository<SmsReminder, Long> {
    boolean existsByBookingId(Long bookingId);
    List<SmsReminder> findByStatus(SmsReminderStatus status);
    List<SmsReminder> findByStatusAndNextAttemptAtLessThanEqual(SmsReminderStatus status, LocalDateTime time);
    List<SmsReminder> findByStatusAndUpdatedAtBefore(SmsReminderStatus status, LocalDateTime time);
}
