import React from 'react';
import { STUDIO_HOURS } from '../data/studioData';

export const Location: React.FC = () => {
  return (
    <>
      <section id="location" className="location-cinematic section-dark">
        <div className="location-layout">
          <div className="location-info-col fade-up">
            <span className="section-eyebrow">✦ STUDIO LOCATION</span>
            <h2 className="location-heading">Find Us ✦</h2>
            <p className="location-subheading">
              Located inside <span className="highlight-text">Los Carlos Tattoo Studio</span> in Pardo, Cebu City.
            </p>

            <div className="location-details-list">
              <div className="location-detail-item">
                <span className="detail-icon">📍</span>
                <div>
                  <strong>Address</strong>
                  <p>J. Tabura Street, Pardo, Cebu City, Philippines</p>
                </div>
              </div>

              <div className="location-detail-item">
                <span className="detail-icon">🕒</span>
                <div>
                  <strong>Studio Hours</strong>
                  <div className="location-hours-group">
                    {STUDIO_HOURS.map((hour, idx) => (
                      <div key={idx} className="hour-entry">
                        <span className="hour-days">{hour.days}:</span> {hour.time}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="location-detail-item">
                <span className="detail-icon">✨</span>
                <div>
                  <strong>Studio Guidelines</strong>
                  <p>Safe, sanitized autoclave sterilization with single-use needles. Walk-ins warmly welcomed every Thursday &amp; Friday!</p>
                </div>
              </div>
            </div>

            <div className="location-actions">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Los+Carlos+Tattoo+Studio+J.+Tabura+Street+Pardo+Cebu+City"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                Get Directions ✦
              </a>
              <a
                href="#book"
                className="btn btn-outline-white"
              >
                Book Appointment
              </a>
            </div>
          </div>

          <div className="location-map-col fade-up delay-1">
            <div className="map-overlay"></div>
            <iframe
              title="Stabbaby Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.3668675884114!2d123.8877115743171!3d10.312496089809468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a999f427a339d1%3A0x1d43dab82a209f47!2sLos%20Carlos%20Tattoo%20Studio!5e0!3m2!1sen!2sph!4v1781438876520!5m2!1sen!2sph"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      <div className="marquee hover-stop">
        <div className="marquee-content">
          <span>ADORNED ALWAYS ✦ STABBABY BODY PIERCING ✦ CEBU CITY ✦ PARDO ✦ </span>
          <span>ADORNED ALWAYS ✦ STABBABY BODY PIERCING ✦ CEBU CITY ✦ PARDO ✦ </span>
          <span>ADORNED ALWAYS ✦ STABBABY BODY PIERCING ✦ CEBU CITY ✦ PARDO ✦ </span>
          <span>ADORNED ALWAYS ✦ STABBABY BODY PIERCING ✦ CEBU CITY ✦ PARDO ✦ </span>
        </div>
      </div>
    </>
  );
};
