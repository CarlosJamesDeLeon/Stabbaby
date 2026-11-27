package com.stabbaby.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sms_reminders")
public class SmsReminder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    @OneToOne(optional = false)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @Column(nullable = false)
    private LocalDateTime scheduledAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SmsReminderStatus status;

    private int attemptCount;
    private LocalDateTime nextAttemptAt;
    private String providerMessageId;
    private String lastError;
    private LocalDateTime acceptedAt;
    private LocalDateTime deliveredAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    protected SmsReminder() {}

    public SmsReminder(Booking booking, LocalDateTime scheduledAt, LocalDateTime now) {
        this.booking = booking;
        this.scheduledAt = scheduledAt;
        this.createdAt = now;
        claim(now);
    }

    public void claim(LocalDateTime now) {
        attemptCount++;
        nextAttemptAt = null;
        finish(SmsReminderStatus.SENDING, null, now);
    }

    public void retry(LocalDateTime now, String error) {
        nextAttemptAt = now.plusMinutes(5);
        finish(SmsReminderStatus.RETRY, error, now);
    }

    public void accept(String messageId, LocalDateTime now) {
        providerMessageId = messageId;
        acceptedAt = now;
        finish(SmsReminderStatus.ACCEPTED, null, now);
    }

    public void finish(SmsReminderStatus status, String error, LocalDateTime now) {
        this.status = status;
        this.lastError = error;
        this.updatedAt = now;
        if (status == SmsReminderStatus.DELIVERED) {
            deliveredAt = now;
        }
    }

    public Booking getBooking() { return booking; }
    public SmsReminderStatus getStatus() { return status; }
    public int getAttemptCount() { return attemptCount; }
    public String getProviderMessageId() { return providerMessageId; }
    public LocalDateTime getAcceptedAt() { return acceptedAt; }
}
