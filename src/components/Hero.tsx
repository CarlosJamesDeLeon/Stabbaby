import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="hero section-dark">
      <div className="radial-glow glow-pink" style={{ top: '20%', left: '-10%' }}></div>
      <div className="hero-content">
        <div className="hero-text fade-up">
          <span className="hero-eyebrow">✦ Cebu City's Premier Piercing Studio</span>
          <div className="hero-rule"></div>
          <h1 className="hero-headline">
            Adorned.<br />Always.
          </h1>
          <p className="hero-subtitle">
            Professional body piercing in Cebu City. Walk-ins welcome Thu–Fri, 3–7PM.
          </p>
          <div className="hero-badge-row">
            <span className="hero-badge">✦ Walk-ins Thu–Fri</span>
          </div>
          <div className="hero-buttons">
            <a href="#gallery" className="btn btn-primary">Explore Piercings</a>
            <a href="#book" className="btn btn-outline-white hero-btn-book">Book Appointment</a>
          </div>
        </div>

        <div className="hero-circle-wrapper fade-up delay-2">
          <div className="sparkle" style={{ top: '10%', left: '10%', animationDelay: '0s' }}>✦</div>
          <div className="sparkle" style={{ top: '15%', right: '5%', animationDelay: '0.8s' }}>✦</div>
          <div className="sparkle" style={{ bottom: '15%', left: '0%', animationDelay: '1.4s' }}>✦</div>
          <div className="sparkle" style={{ bottom: '5%', right: '15%', animationDelay: '2s' }}>✦</div>
          <div className="hero-circle slow-rotate"></div>
        </div>
      </div>
      <div className="hero-vertical-text">CEBU CITY • PARDO • 2025</div>
    </section>
  );
};
