import React from 'react';
import { SERVICES_LIST } from '../data/studioData';

export const Services: React.FC = () => {
  return (
    <>
      <div className="section-divider section-dark">
        <svg className="divider-icon">
          <use href="#double-ring-svg"></use>
        </svg>
      </div>

      <section id="services" className="services-cinematic section-dark">
        <div className="radial-glow glow-cyan" style={{ top: '20%', right: '10%' }}></div>
        <h2 className="section-title fade-up">What We Offer</h2>

        <div className="stagger-grid fade-up delay-1">
          {SERVICES_LIST.map((service) => (
            <div
              key={service.id}
              className={`service-card-cinematic ${service.shiftDown ? 'shift-down' : ''}`}
            >
              <div className="card-glow"></div>
              <div className="service-image">
                <img src={service.image} alt={service.name} loading="lazy" />
                <div className="service-overlay"></div>
              </div>
              <div className="service-content">
                <svg className="service-ring-icon">
                  <use href="#double-ring-svg"></use>
                </svg>
                <h3 className="service-name">{service.name}</h3>
                <p className="service-desc">{service.description}</p>
                <div className="price-separator"></div>
                <div className="service-price">{service.price}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="services-note fade-up delay-3">
          Prices vary depending on jewelry selection. Consultation is free.
        </p>
      </section>
    </>
  );
};
