import React, { useState } from 'react';
import { BookingResponse } from '../types/booking';
import { formatBookingDate, piercingLabel } from '../utils/bookingFormat';

interface BookingCardProps {
  booking: BookingResponse;
  isCancelling: boolean;
  onCancel: (booking: BookingResponse) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, isCancelling, onCancel }) => {
  const [confirming, setConfirming] = useState(false);

  const canCancel = booking.status === 'PENDING' || booking.status === 'CONFIRMED';

  const handleConfirmCancel = () => {
    onCancel(booking);
    setConfirming(false);
  };

  return (
    <article className="booking-card">
      <header className="booking-card-header">
        <span className="booking-card-code">{booking.referenceCode}</span>
        <span className={`status-badge status-${booking.status.toLowerCase()}`}>
          {booking.status}
        </span>
      </header>

      <p className="booking-card-line">
        {formatBookingDate(booking.preferredDate)} · {booking.preferredTime}
      </p>
      <p className="booking-card-line">{piercingLabel(booking.piercingType)}</p>
      {booking.notes && <p className="booking-card-notes">"{booking.notes}"</p>}

      {canCancel && !confirming && (
        <button
          type="button"
          className="cancel-link"
          disabled={isCancelling}
          onClick={() => setConfirming(true)}
        >
          {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
        </button>
      )}

      {canCancel && confirming && (
        <div className="cancel-confirm">
          <span>Cancel this booking?</span>
          <button type="button" className="cancel-yes" onClick={handleConfirmCancel}>
            Yes, cancel
          </button>
          <button type="button" className="cancel-no" onClick={() => setConfirming(false)}>
            Keep it
          </button>
        </div>
      )}
    </article>
  );
};