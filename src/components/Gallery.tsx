import React, { useState } from 'react';
import { LOOKBOOK_ITEMS } from '../data/studioData';
import { PiercingItem } from '../types';

interface GalleryProps {
  onSelectPiercingForBooking: (category: string) => void;
}

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'ear', label: 'Ear' },
  { key: 'nose', label: 'Nose' },
  { key: 'lip', label: 'Lip' },
  { key: 'eyebrow', label: 'Eyebrow' },
  { key: 'body', label: 'Body' },
  { key: 'dermal', label: 'Dermal' },
];

export const Gallery: React.FC<GalleryProps> = ({ onSelectPiercingForBooking }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeModalItem, setActiveModalItem] = useState<PiercingItem | null>(null);

  const filteredItems = activeFilter === 'all'
    ? LOOKBOOK_ITEMS
    : LOOKBOOK_ITEMS.filter((item) => item.category === activeFilter);

  const handleCardClick = (item: PiercingItem) => {
    setActiveModalItem(item);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModalItem(null);
    document.body.style.overflow = '';
  };

  const handleBookFromModal = () => {
    if (activeModalItem) {
      const cat = activeModalItem.category;
      closeModal();
      onSelectPiercingForBooking(cat);
    }
  };

  return (
    <>
      <section id="gallery" className="gallery-cinematic section-dark">
        <div className="radial-glow glow-pink" style={{ top: 0, left: '30%' }}></div>

        <div className="gallery-header fade-up">
          <div className="gallery-ghost-mark">”</div>
          <h2 className="section-title-massive">The Lookbook</h2>
        </div>

        <div className="gallery-filters fade-up delay-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className={`filter-btn ${activeFilter === cat.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="editorial-grid fade-up delay-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`grid-card ${item.spanClass || ''}`}
              data-category={item.category}
              onClick={() => handleCardClick(item)}
            >
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="grid-overlay">
                <span className="cat-title">{item.title}</span>
                <span className="cat-view">✦ View</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div
        id="lookbook-modal"
        className={`lookbook-modal ${activeModalItem ? '' : 'hidden'}`}
        aria-hidden={!activeModalItem}
        role="dialog"
      >
        <div className="lookbook-modal-backdrop" onClick={closeModal}></div>
        {activeModalItem && (
          <div className="lookbook-modal-container">
            <button
              type="button"
              className="lookbook-modal-close"
              aria-label="Close Preview"
              onClick={closeModal}
            >
              ✕
            </button>
            <div className="lookbook-modal-media">
              <img src={activeModalItem.image} alt={activeModalItem.title} />
            </div>
            <div className="lookbook-modal-content">
              <div className="lookbook-badge">
                {activeModalItem.category.toUpperCase()} PIERCING
              </div>
              <h3 className="lookbook-modal-title">{activeModalItem.title}</h3>
              <p className="lookbook-modal-desc">{activeModalItem.description}</p>
              <div className="lookbook-modal-price">{activeModalItem.price}</div>
              <div className="lookbook-modal-actions">
                <button
                  type="button"
                  className="btn btn-primary pulse-btn"
                  onClick={handleBookFromModal}
                >
                  Book This Style ✦
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
