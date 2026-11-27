import React, { useState, useEffect, useRef } from 'react';
import { STUDIO_HOURS, TIME_SLOTS, PIERCING_OPTIONS } from '../data/studioData';
import { studioApi } from '../services/api';

interface BookingSectionProps {
  selectedCategory: string;
  onClearSelectedCategory?: () => void;
  onShowToast: (success: boolean, msg?: string) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function BookingSection({
  selectedCategory,
  onShowToast,
}: BookingSectionProps) {
  const [form, setForm] = useState({
    fullName: '',
    contactNumber: '',
    prefTime: '',
    piercingType: selectedCategory || '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setForm((form) => ({ ...form, piercingType: selectedCategory }));
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

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function handleSelectDay(dayNum: number) {
    const chosen = new Date(year, month, dayNum);
    chosen.setHours(0, 0, 0, 0);
    setSelectedDate(chosen);
    setCalendarOpen(false);
  }

  const formattedDateValue = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    : '';

  const displayDateText = selectedDate
    ? `${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
    : '';

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formattedDateValue) {
      onShowToast(false, 'Please pick your preferred date ✦');
      return;
    }

    setIsSubmitting(true);
    try {
      await studioApi.createBooking({
        full_name: form.fullName,
        contact_number: form.contactNumber,
        preferred_date: formattedDateValue,
        preferred_time: form.prefTime,
        piercing_type: form.piercingType,
        message: form.notes,
      });

      onShowToast(true);
      setForm({
        fullName: '',
        contactNumber: '',
        prefTime: '',
        piercingType: '',
        notes: '',
      });
      setSelectedDate(null);
    } catch {
      onShowToast(false, 'Something went wrong babe, please try again or contact us directly ✦');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="book" className="booking-cinematic section-dark">
      <div className="booking-layout">
        <div className="booking-info fade-up">
          <h2 className="section-title-split">
            Reserve Your<br />
            <span className="highlight-italic">Spot ✦</span>
          </h2>

          <div className="studio-hours">
            {STUDIO_HOURS.map((hour) => (
              <div key={hour.days} className="hour-block">
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
          <form id="bookingForm" className="booking-form-dark" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-control"
                required
                placeholder="Babe Smith"
                value={form.fullName}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                className="form-control"
                required
                placeholder="0912 345 6789"
                value={form.contactNumber}
                onChange={handleFormChange}
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
                name="prefTime"
                className="form-control"
                required
                value={form.prefTime}
                onChange={handleFormChange}
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
                name="piercingType"
                className="form-control"
                required
                ref={piercingSelectRef}
                value={form.piercingType}
                onChange={handleFormChange}
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
                name="notes"
                className="form-control"
                placeholder="Any inspiration or questions?"
                value={form.notes}
                onChange={handleFormChange}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Booking...' : 'Book Now ✦'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
