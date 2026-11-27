import {
  BadgeIndianRupee,
  Clock,
  Heart,
  Ruler,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { WHY_CHOOSE_US } from '../data/boutiqueData.js';

const ICON_MAP = {
  BadgeIndianRupee,
  Ruler,
  Sparkles,
  ShieldCheck,
  Clock,
  Heart,
};

export default function WhyChooseUsSection() {
  return (
    <section id="why-us" className="section section--blush">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Why Choose Us</span>
          <h2 className="section-title">The SuiSaaj Promise in Every Seam</h2>
          <p className="section-subtitle">
            Thoughtful craftsmanship, fair pricing, and personal care so every visit feels warm,
            seamless, and inspiring.
          </p>
        </div>

        <div className="why-grid">
          {WHY_CHOOSE_US.map((feature) => {
            const IconComponent = ICON_MAP[feature.icon] || Sparkles;
            return (
              <div key={feature.title} className="why-card">
                <div className="why-icon" aria-hidden="true">
                  <IconComponent size={21} />
                </div>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
