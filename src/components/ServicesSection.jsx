import {
  ArrowRight,
  Crown,
  Feather,
  Gem,
  HeartHandshake,
  Palette,
  Ruler,
  Scissors,
  Sparkles,
} from 'lucide-react';
import { SERVICES } from '../data/boutiqueData.js';

const ICON_MAP = {
  Scissors,
  Sparkles,
  Feather,
  Crown,
  Gem,
  Palette,
  Ruler,
  HeartHandshake,
};

export default function ServicesSection({ onSelectService }) {
  return (
    <section id="services" className="section section--beige">
      <div className="container">
        <div className="section-header" data-reveal>
          <span className="eyebrow">Our Services</span>
          <h2 className="section-title">
            Bespoke Tailoring &amp; <em>Boutique Creations</em>
          </h2>
          <p className="section-subtitle">
            Every silhouette is individually drafted, cut, and finished to celebrate your comfort
            and style—from everyday kurtis to heirloom bridal wear.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES.map((service, index) => {
            const IconComponent = ICON_MAP[service.icon] || Sparkles;
            const orderNum = String(index + 1).padStart(2, '0');
            return (
              <article
                key={service.id}
                className="service-card"
                data-reveal
                style={{ transitionDelay: `${(index % 4) * 60}ms` }}
              >
                <div className="service-card-top">
                  <div className="service-icon" aria-hidden="true">
                    <IconComponent size={22} />
                  </div>
                  <div className="service-meta">
                    <span className="service-num">{orderNum}</span>
                    <span className="service-badge">{service.badge}</span>
                  </div>
                </div>

                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.description}</p>

                <button
                  type="button"
                  className="service-link"
                  onClick={() => onSelectService(service.title)}
                >
                  Enquire for {service.title}
                  <ArrowRight size={15} />
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
