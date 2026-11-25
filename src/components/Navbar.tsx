import React, { useState, useEffect } from 'react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('nav-open');
    } else {
      document.body.classList.remove('nav-open');
    }
    return () => {
      document.body.classList.remove('nav-open');
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : 'top'}`}>
      <a href="#" className="nav-logo">
        Stabbaby <span className="star">✦</span>
      </a>

      <button
        className={`nav-toggle ${isOpen ? 'active' : ''}`}
        id="nav-toggle-btn"
        aria-label={isOpen ? 'Close Navigation' : 'Open Navigation'}
        aria-expanded={isOpen}
        aria-controls="nav-links"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      <div className={`nav-links ${isOpen ? 'active' : ''}`} id="nav-links">
        <a href="#home" onClick={handleLinkClick}>Home</a>
        <a href="#about" onClick={handleLinkClick}>About</a>
        <a href="#gallery" onClick={handleLinkClick}>Gallery</a>
        <a href="#services" onClick={handleLinkClick}>Services</a>
        <a href="#location" className="nav-location" onClick={handleLinkClick}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
           Location
        </a>
        <a href="#contact" onClick={handleLinkClick}>Contact</a>
        <a href="#book" className="btn btn-primary pulse-btn" onClick={handleLinkClick}>
          Book Now
        </a>
      </div>
    </nav>
  );
};
