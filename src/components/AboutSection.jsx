import { CheckCircle2, Sparkles } from 'lucide-react';
import { assetUrl } from '../data/boutiqueData.js';

const STUDIO_HIGHLIGHTS = [
  'Master Ladies Tailors',
  'Personal Style Consultations',
  'Hand-Finished Detailing',
  'Honest & Affordable Pricing',
];

const JOURNEY_STEPS = [
  { step: '01', title: 'Style & Fabric Consult', detail: 'Pick silhouettes, necklines & trims' },
  { step: '02', title: 'Custom Measurements', detail: 'Individual patterns cut to your fit' },
  { step: '03', title: 'Trial & Neat Finish', detail: 'Refined adjustments before delivery' },
];

export default function AboutSection({ onBookAppointment }) {
  return (
    <section id="about" className="section">
      <div className="container about-grid">
        <div className="about-media" data-reveal>
          <div className="about-frame-wrap">
            <div className="about-frame">
              <img
                src={assetUrl('images/about-atelier.jpg')}
                alt="Blush silk fabric, rose-gold tailoring scissors, and embroidery swatches at SuiSaaj studio"
                loading="lazy"
              />
            </div>
          </div>
          <div className="about-badge">
            <strong>Crafted with Grace</strong>
            <span>Tailoring excellence for every occasion</span>
          </div>
        </div>

        <div className="about-copy" data-reveal>
          <span className="eyebrow">About Our Boutique</span>
          <h2 className="section-title">
            Where Traditional Craft Meets <em>Effortless Modern Fit</em>
          </h2>
          <p>
            At SuiSaaj, we believe every woman deserves clothing that feels made exclusively for
            her—without having to choose between impeccable fit, graceful styling, and reasonable
            pricing.
          </p>
          <p>
            From delicate hand-embroidered bridal blouses and flowing Anarkali suits to everyday
            kurtis and thoughtful alterations, our skilled tailors and designers guide you from
            fabric selection and neckline sketching through final trial fitting with warmth and
            precision.
          </p>

          <div className="about-pillars">
            {STUDIO_HIGHLIGHTS.map((item) => (
              <div key={item} className="about-pillar">
                <CheckCircle2 size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="journey-strip" aria-label="Our 3-step tailoring process">
            {JOURNEY_STEPS.map((item) => (
              <div key={item.step} className="journey-step">
                <span className="journey-num">{item.step}</span>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn btn--primary"
            onClick={() => onBookAppointment('Custom Tailoring')}
          >
            <Sparkles size={16} />
            Consult Our Stylist
          </button>
        </div>
      </div>
    </section>
  );
}
