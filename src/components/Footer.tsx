import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-cinematic section-dark">
      <div className="footer-watermark">
        <svg>
          <use href="#double-ring-svg"></use>
        </svg>
      </div>

      <div className="footer-content relative-z">
        <a href="#" className="footer-logo-massive glow-text">
          Stabbaby ✦
        </a>
        <p className="footer-tagline-small">ADORNED. ALWAYS.</p>

        <div className="footer-nav">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#gallery">Gallery</a>
          <a href="#services">Services</a>
          <a href="#location">Location</a>
          <a href="#contact">Contact</a>
          <a href="#book">Book</a>
        </div>

        <div className="footer-rule"></div>
        <div className="footer-bottom">
          &copy; {currentYear} Stabbaby Body Piercing. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
