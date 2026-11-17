import React from 'react';
import { STUDIO_MEDIA } from '../data/studioData';

export const About: React.FC = () => {
  return (
    <>
      <div className="section-divider section-dark">
        <svg className="divider-icon">
          <use href="#double-ring-svg"></use>
        </svg>
      </div>

      <section id="about" className="about-cinematic section-dark">
        <div className="watermark-bg">
          <svg>
            <use href="#double-ring-svg"></use>
          </svg>
        </div>
        <div className="radial-glow glow-cyan" style={{ top: '50%', right: '-10%' }}></div>

        <div className="about-header fade-up">
          <div className="section-label">OUR STORY</div>
          <h2 className="section-title-large">Meet the Studio</h2>
        </div>

        <div className="about-photo-grid fade-up delay-1">
          <div className="about-frame tilt-left">
            <img src={STUDIO_MEDIA.studioInterior} alt="Interior atmosphere" loading="lazy" />
          </div>
          <div className="about-frame is-tall">
            <img src={STUDIO_MEDIA.earDetail} alt="Piercing artistry" loading="lazy" />
          </div>
          <div className="about-frame tilt-right">
            <img src={STUDIO_MEDIA.lipDetail} alt="Piercing detail close up" loading="lazy" />
          </div>
        </div>

        <div className="about-copy fade-up delay-2">
          <p>
            Stabbaby Body Piercing is your safe space for self-expression. Located inside Los Carlos
            Tattoo Studio in Pardo, Cebu City, we specialize in precision piercing with a gentle touch
            and a whole lot of heart.
          </p>
        </div>

        <div className="about-stats fade-up delay-3">
          <div className="stat-card">
            <svg className="stat-card-icon">
              <use href="#double-ring-svg"></use>
            </svg>
            <div className="stat-symbol">✦</div>
            <div className="stat-label">Safety First</div>
          </div>
          <div className="stat-card">
            <svg className="stat-card-icon">
              <use href="#double-ring-svg"></use>
            </svg>
            <div className="stat-symbol">📍</div>
            <div className="stat-label">Cebu-Based</div>
          </div>
          <div className="stat-card">
            <svg className="stat-card-icon">
              <use href="#double-ring-svg"></use>
            </svg>
            <div className="stat-symbol">∞</div>
            <div className="stat-label">Walk-ins Welcome</div>
          </div>
        </div>
      </section>
    </>
  );
};
