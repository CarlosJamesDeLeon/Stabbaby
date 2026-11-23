import React, { useState, useEffect, useRef } from 'react';
import { STUDIO_HOURS, TIME_SLOTS, PIERCING_OPTIONS } from '../data/studioData';
import { studioApi } from '../services/api';
import { bookingApi, ApiError } from '../services/bookingApi';
import { BookingResponse } from '../types/booking';
import { BookingConfirmation } from './BookingConfirmation';

interface BookingSectionProps {
  selectedCategory: string;
  onClearSelectedCategory?: () => void;
  onShowToast: (success: boolean, msg?: string) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const BookingSection: React.FC<BookingSectionProps> = ({
  selectedCategory,
  onShowToast,
}) => {
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [prefTime, setPrefTime] = useState('');
  const [piercingType, setPiercingType] = useState(selectedCategory || '');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<BookingResponse | null>(null);

  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const calendarWrapperRef = useRef<HTMLDivElement>(null);
  const piercingSelectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    studioApi.fetchBlockedDates().then((dates) => {
      setBlockedDates(dates);
    });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setPiercingType(selectedCategory);
      if (piercingSelectRef.current) {
        piercingSelectRef.current.style.borderColor = 'var(--pink-main)';
        piercingSelectRef.current.style.boxShadow = '0 0 15px rgba(232, 107, 168, 0.4)';
        setTimeout(() => {
          if (piercingSelectRef.current) {
            piercingSelectRef.current.style.borderColor = '';
            piercingSelectRef.current.style.boxShadow = '';
          }
        }, 2500);
      }
    }
  }, [selectedCategory]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarWrapperRef.current && !calendarWrapperRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (dayNum: number) => {
    const chosen = new Date(year, month, dayNum);
    chosen.setHours(0, 0, 0, 0);
    setSelectedDate(chosen);
    setCalendarOpen(false);
  };

  const formattedDateValue = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    : '';

  const displayDateText = selectedDate
    ? `${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
    : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formattedDateValue) {
      onShowToast(false, 'Please pick your preferred date ✦');
      return;
    }

    setIsSubmitting(true);
      try {
      const booking = await bookingApi.createBooking({
        fullName: fullName.trim(),
        contactNumber: contactNumber.trim(),
        preferredDate: formattedDateValue,
        preferredTime: prefTime,
        piercingType,
        notes: notes.trim() || undefined,
      });

      setConfirmation(booking);
      onShowToast(true);
      setFullName('');
      setContactNumber('');
      setPrefTime('');
      setPiercingType('');
      setNotes('');
      setSelectedDate(null);
    } catch (err) {
      if (err instanceof ApiError) {
        const firstFieldError = err.fieldErrors
          ? Object.values(err.fieldErrors)[0]
          : undefined;
        onShowToast(false, firstFieldError ?? err.message);
      } else {
        onShowToast(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="book" className="booking-cinematic section-dark">
      <div className="booking-layout">
        <div className="booking-info fade-up">
          <h2 className="section-title-split">
            Reserve Your<br />
            <span className="highlight-italic">Spot ✦</span>
          </h2>

          <div className="studio-hours">
            {STUDIO_HOURS.map((hour, idx) => (
              <div key={idx} className="hour-block">
                <div className="days">{hour.days}</div>
                <div className="time">{hour.time}</div>
              </div>
            ))}
          </div>

          <div className="booking-watermark">
            <svg>
              <use href="#double-ring-svg"></use>
            </svg>
          </div>
        </div>

        <div className="booking-form-wrapper fade-up delay-1">
          <div className="glowing-border"></div>
          
           {confirmation ? (
              <BookingConfirmation
                booking={confirmation}
                onBookAnother={() => setConfirmation(null)}
              />
            ) : (
          <form id="bookingForm" className="booking-form-dark" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                className="form-control"
                required
                placeholder="Babe Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number</label>
              <input
                type="tel"
                id="contactNumber"
                className="form-control"
                required
                placeholder="0912 345 6789"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>

            <div
              className="form-group"
              style={{ position: 'relative' }}
              id="calendar-wrapper"
              ref={calendarWrapperRef}
            >
              <label htmlFor="prefDateDisplay">Preferred Date</label>
              <input
                type="text"
                id="prefDateDisplay"
                className="form-control"
                placeholder="Select a date"
                readOnly
                style={{ cursor: 'pointer' }}
                value={displayDateText}
                onClick={() => setCalendarOpen((prev) => !prev)}
              />
              <input type="hidden" id="prefDate" name="prefDate" value={formattedDateValue} />

              <div
                className={`custom-calendar ${calendarOpen ? '' : 'hidden-calendar'}`}
                id="booking-calendar"
              >
                <div className="calendar-header">
                  <button
                    type="button"
                    className="calendar-nav prev-month"
                    aria-label="Previous Month"
                    onClick={prevMonth}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <div className="calendar-title">
                    {MONTH_NAMES[month]} {year}
                  </div>
                  <button
                    type="button"
                    className="calendar-nav next-month"
                    aria-label="Next Month"
                    onClick={nextMonth}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>

                <div className="calendar-weekdays">
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                </div>

                <div className="calendar-days" id="calendar-days">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="calendar-day empty"></div>
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const cellDate = new Date(year, month, dayNum);
                    cellDate.setHours(0, 0, 0, 0);

                    const yStr = cellDate.getFullYear();
                    const mStr = String(cellDate.getMonth() + 1).padStart(2, '0');
                    const dStr = String(cellDate.getDate()).padStart(2, '0');
                    const dateStr = `${yStr}-${mStr}-${dStr}`;

                    const isPast = cellDate.getTime() < today.getTime();
                    const isBlocked = blockedDates.includes(dateStr);
                    const isDisabled = isPast || isBlocked;
                    const isToday = cellDate.getTime() === today.getTime();
                    const isSelected = selectedDate && cellDate.getTime() === selectedDate.getTime();

                    return (
                      <div
                        key={`day-${dayNum}`}
                        className={`calendar-day ${isDisabled ? 'disabled' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => !isDisabled && handleSelectDay(dayNum)}
                      >
                        {dayNum}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="prefTime">Preferred Time</label>
              <select
                id="prefTime"
                className="form-control"
                required
                value={prefTime}
                onChange={(e) => setPrefTime(e.target.value)}
              >
                <option value="" disabled>Select a time</option>
                {TIME_SLOTS.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="piercingType">Piercing Type</label>
              <select
                id="piercingType"
                className="form-control"
                required
                ref={piercingSelectRef}
                value={piercingType}
                onChange={(e) => setPiercingType(e.target.value)}
              >
                <option value="" disabled>What are we adorning?</option>
                {PIERCING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Message / Notes</label>
              <textarea
                id="notes"
                className="form-control"
                placeholder="Any inspiration or questions?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Booking...' : 'Book Now ✦'}
            </button>
          </form>
            )}
        </div>
      </div>
    </section>
  );
};
