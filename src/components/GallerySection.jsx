import { useState } from 'react';
import { ArrowRight, Expand, X } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/boutiqueData.js';

const CATEGORIES = ['All', 'Blouses', 'Suits & Kurtis', 'Bridal & Party', 'Custom Design'];

export default function GallerySection({ onBookService }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);

  const visibleItems =
    activeCategory === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="section">
      <div className="container">
        <div className="section-header" data-reveal>
          <span className="eyebrow">Boutique Gallery</span>
          <h2 className="section-title">
            Signature Stitches &amp; <em>Curated Looks</em>
          </h2>
          <p className="section-subtitle">
            Explore a glimpse of our custom blouses, ethnic suits, bridal ensembles, and studio
            designs. Click any design to inspect details or request a similar look.
          </p>
        </div>

        <div className="gallery-filters" role="tablist" aria-label="Filter gallery by category">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={activeCategory === category}
              className={`filter-btn ${activeCategory === category ? 'filter-btn--active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {visibleItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className="gallery-card"
              data-reveal
              style={{ transitionDelay: `${(index % 3) * 70}ms` }}
              onClick={() => setSelectedItem(item)}
              aria-label={`View details for ${item.title}`}
            >
              <img src={item.image} alt={item.title} loading="lazy" />
              <span className="gallery-zoom-pill" aria-hidden="true">
                <Expand size={14} />
                View
              </span>
              <div className="gallery-overlay">
                <span className="gallery-cat">{item.category}</span>
                <h3 className="gallery-title">{item.title}</h3>
                <p className="gallery-caption">{item.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedItem && (
        <div
          className="lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={selectedItem.title}
          onClick={() => setSelectedItem(null)}
        >
          <div className="lightbox-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close"
              aria-label="Close preview"
              onClick={() => setSelectedItem(null)}
            >
              <X size={18} />
            </button>

            <div className="lightbox-img-wrap">
              <img src={selectedItem.image} alt={selectedItem.title} />
            </div>

            <div className="lightbox-body">
              <span className="eyebrow">{selectedItem.category}</span>
              <h3 className="section-title" style={{ fontSize: '1.9rem', marginBottom: '0.4rem' }}>
                {selectedItem.title}
              </h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{selectedItem.caption}</p>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Love this style? Book an appointment and our team will customize the fabric, fit,
                and embroidery to match your vision.
              </p>
              <div style={{ marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => {
                    const service = selectedItem.service;
                    setSelectedItem(null);
                    onBookService(service);
                  }}
                >
                  Enquire About This Design
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
