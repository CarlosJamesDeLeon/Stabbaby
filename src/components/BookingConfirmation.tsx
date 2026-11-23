import React, { useState } from 'react';
import { BookingResponse } from '../types/booking';
import { formatBookingDate, piercingLabel } from '../utils/bookingFormat';
import './BookingConfirmation.css';

interface BookingConfirmationProps {
  booking: BookingResponse;
  onBookAnother: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onBookAnother,
 }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(booking.referenceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be blocked; the code is still visible on screen
    }
  };

  const details = [
    { label: 'Name', value: booking.fullName },
    { label: 'Date', value: formatBookingDate(booking.preferredDate) },
    { label: 'Time', value: booking.preferredTime },
    { label: 'Piercing', value: piercingLabel(booking.piercingType) },
    { label: 'Status', value: booking.status },
  ];

  return (
    <div className="booking-confirmation" role="status">
      <h3 className="confirmation-title">You're booked ✦</h3>
      <p className="confirmation-text">
        Save your reference code. You'll need it with your contact number to
        track or cancel your booking.
      </p>

      <div className="reference-box">
        <span className="reference-code">{booking.referenceCode}</span>
        <button type="button" className="copy-btn" onClick={handleCopy}>
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>

      <ul className="confirmation-details">
        {details.map((item) => (
          <li key={item.label}>
            <span className="detail-label">{item.label}</span>
            <span className="detail-value">{item.value}</span>
          </li>
        ))}
      </ul>

      <button type="button" className="btn btn-primary" onClick={onBookAnother}>
        Book Another ✦
      </button>
    </div>
  );
};