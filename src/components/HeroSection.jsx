import { ArrowRight, Award, Sparkles } from 'lucide-react';
import { assetUrl } from '../data/boutiqueData.js';

const RIBBON_ITEMS = [
  'Bespoke Bridal Blouses',
  'Ladies Salwar & Anarkali Suits',
  'Hand Zardozi & Gotta Patti',
  'Made-to-Measure Kurtis',
  "Women's Indo-Western Gowns",
  'Ladies Saree & Dress Alterations',
];

export default function HeroSection({ onBookAppointment }) {
  return (
    <>
      <section id="home" className="hero">
        <div className="hero-bg" aria-hidden="true">
          <img
            src={assetUrl('images/hero-boutique.jpg')}
            alt="Tailored blush pink bridal blouse and silk lehenga inside SuiSaaj ladies boutique"
            fetchPriority="high"
          />
          <div className="hero-overlay" />
        </div>

        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-pill">
              <Sparkles size={14} />
              <span>Exclusively for Women &bull; Ladies Boutique &amp; Tailoring</span>
            </div>

            <h1 className="hero-title">
              Stitching Dreams, <em className="hero-title-accent">Styling You</em>
            </h1>

            <p className="hero-subtitle">
              Perfect Fits, Beautiful Designs and Affordable Fashion—crafted with care for
              everyday grace, festive celebrations, and bridal couture.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="btn btn--primary btn--shimmer"
                onClick={() => onBookAppointment()}
              >
                Book an Appointment
                <ArrowRight size={17} />
              </button>

              <a href="#gallery" className="btn btn--secondary">
                Explore Our Collection
              </a>
            </div>

            <div className="hero-highlights">
              <div className="hero-stat">
                <strong>100% Custom</strong>
                <span>Patterned to your measurements</span>
              </div>
              <div className="hero-stat">
                <strong>Bridal &amp; Festive</strong>
                <span>Blouses, suits, lehengas &amp; gowns</span>
              </div>
              <div className="hero-stat">
                <strong>On-Time Fit</strong>
                <span>Careful trials &amp; neat finishing</span>
              </div>
            </div>
          </div>

          <div className="hero-showcase-card" aria-hidden="true">
            <div className="hero-showcase-inner">
              <div className="hero-showcase-icon">
                <Award size={20} />
              </div>
              <p className="hero-showcase-eyebrow">Women-Only Atelier</p>
              <h2 className="hero-showcase-title">Tailored to Celebrate Your Silhouette</h2>
              <p className="hero-showcase-text">
                One-on-one fabric &amp; neckline consultation, custom women&rsquo;s pattern
                drafting, and complimentary trial fittings.
              </p>
              <div className="hero-showcase-tags">
                <span>Blouses</span>
                <span>Bridal</span>
                <span>Salwar Suits</span>
                <span>Kurtis</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="craft-ribbon" aria-label="Boutique Specialties">
        <div className="craft-ribbon-track">
          {[...RIBBON_ITEMS, ...RIBBON_ITEMS].map((item, idx) => (
            <span key={`${item}-${idx}`} className="craft-ribbon-item">
              <Sparkles size={12} aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
