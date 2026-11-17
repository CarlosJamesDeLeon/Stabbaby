import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Gallery } from './components/Gallery';
import { Services } from './components/Services';
import { BookingSection } from './components/BookingSection';
import { Contact } from './components/Contact';
import { Location } from './components/Location';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [selectedBookingCategory, setSelectedBookingCategory] = useState<string>('');
  const [toast, setToast] = useState<{ visible: boolean; isSuccess: boolean; message: string }>({
    visible: false,
    isSuccess: true,
    message: '',
  });

  const showToast = (isSuccess: boolean, message: string = '') => {
    setToast({
      visible: true,
      isSuccess,
      message:
        message ||
        (isSuccess
          ? "You're booked, babe! ✦ We'll reach out to confirm your appointment."
          : 'Something went wrong babe, please try again or contact us directly ✦'),
    });
  };

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.fade-up');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSelectPiercingForBooking = (category: string) => {
    setSelectedBookingCategory(category);
    const bookEl = document.getElementById('book');
    if (bookEl) {
      setTimeout(() => {
        bookEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  };

  return (
    <>
      <div className="noise-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <svg style={{ display: 'none' }}>
        <symbol id="double-ring-svg" viewBox="0 0 120 60" fill="none" stroke="currentColor" strokeWidth="4">
          <circle cx="35" cy="30" r="24" />
          <circle cx="90" cy="30" r="14" />
          <line x1="59" y1="30" x2="76" y2="30" />
        </symbol>
      </svg>

      <Navbar />
      <Hero />
      <About />
      <Gallery onSelectPiercingForBooking={handleSelectPiercingForBooking} />
      <Services />
      <BookingSection
        selectedCategory={selectedBookingCategory}
        onClearSelectedCategory={() => setSelectedBookingCategory('')}
        onShowToast={showToast}
      />
      <Location />
      <Contact onShowToast={showToast} />
      <Footer />

      <div
        id="toastMessage"
        className={`toast ${toast.visible ? 'active' : ''}`}
        role="status"
        aria-live="polite"
      >
        <span className="toast-icon">{toast.isSuccess ? '✨' : '✦'}</span>
        <span className="toast-text">{toast.message}</span>
      </div>
    </>
  );
};
