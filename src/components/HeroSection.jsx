import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection({ onBookAppointment }) {
  return (
    <section id="home" className="hero">
      <div className="hero-bg" aria-hidden="true">
        <img
          src="/images/hero-boutique.jpg"
          alt="Tailored blush pink bridal blouse and silk lehenga inside SuiSaaj ladies boutique"
          fetchPriority="high"
        />
        <div className="hero-overlay" />
      </div>

      <div className="container">
        <div className="hero-content">
          <div className="hero-pill">
            <Sparkles size={15} />
            <span>Bespoke Ladies Tailoring &amp; Ethnic Boutique</span>
          </div>

          <h1 className="hero-title">Stitching Dreams, Styling You</h1>

          <p className="hero-subtitle">
            Perfect Fits, Beautiful Designs and Affordable Fashion.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn btn--primary"
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
      </div>
    </section>
  );
}
