import React from 'react';
import { BookingResponse } from '../types/booking';
import { BookingCard } from './BookingCard';

interface BookingListProps {
  bookings: BookingResponse[];
  cancellingCode: string | null;
  onCancel: (booking: BookingResponse) => void;
}

export const BookingList: React.FC<BookingListProps> = ({ bookings, cancellingCode, onCancel }) => {
  if (bookings.length === 0) {
    return <p className="booking-list-empty">No bookings tracked yet.</p>;
  }

  return (
    <div className="booking-list">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.referenceCode}
          booking={booking}
          isCancelling={cancellingCode === booking.referenceCode}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
};