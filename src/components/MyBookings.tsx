import React, { useState } from 'react';
import { bookingApi, ApiError } from '../services/bookingApi';
import { BookingResponse } from '../types/booking';
import { BookingList } from './BookingList';
import './MyBookings.css';

interface MyBookingsProps {
  onShowToast: (success: boolean, msg?: string) => void;
}

export const MyBookings: React.FC<MyBookingsProps> = ({ onShowToast }) => {
  const [referenceCode, setReferenceCode] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cancellingCode, setCancellingCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

 
  const upsertBooking = (updated: BookingResponse) => {
    setBookings((prev) =>
      prev.some((b) => b.referenceCode === updated.referenceCode)
        ? prev.map((b) => (b.referenceCode === updated.referenceCode ? updated : b))
        : [updated, ...prev]
    );
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    try {
      const booking = await bookingApi.getBooking(referenceCode, contactNumber);
      upsertBooking(booking);
      setReferenceCode('');
      setContactNumber('');
    } catch (err) {
      setErrorMessage(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (booking: BookingResponse) => {
    setCancellingCode(booking.referenceCode);
    try {
      const updated = await bookingApi.cancelBooking(booking.referenceCode, booking.contactNumber);
      upsertBooking(updated);
      onShowToast(true, 'Your booking has been cancelled ✦');
    } catch (err) {
      onShowToast(false, err instanceof ApiError ? err.message : undefined);
    } finally {
      setCancellingCode(null);
    }
  };

  return (
    <section id="my-booking" className="my-booking section-dark">
      <div className="my-booking-inner">
        <h2 className="section-title-split">
          Track Your<br />
          <span className="highlight-italic">Booking ✦</span>
        </h2>

        <form className="my-booking-form" onSubmit={handleLookup}>
          <div className="form-group">
            <label htmlFor="lookupCode">Reference Code</label>
            <input
              type="text"
              id="lookupCode"
              className="form-control"
              required
              placeholder="SB-K7M2QX"
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value.toUpperCase())}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lookupContact">Contact Number</label>
            <input
              type="tel"
              id="lookupContact"
              className="form-control"
              required
              placeholder="0912 345 6789"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Find My Booking ✦'}
          </button>

          {errorMessage && <p className="lookup-error" role="alert">{errorMessage}</p>}
        </form>

        <BookingList
          bookings={bookings}
          cancellingCode={cancellingCode}
          onCancel={handleCancel}
        />
      </div>
    </section>
  );
};