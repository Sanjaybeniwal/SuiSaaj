import { Calendar, Instagram, MessageCircle, Phone } from 'lucide-react';
import { BOUTIQUE_CONFIG } from '../data/boutiqueData.js';

export default function Footer({ onBookAppointment }) {
  const whatsappText = encodeURIComponent(
    `Hello ${BOUTIQUE_CONFIG.name}! I would like to book a tailoring appointment.`
  );
  const whatsappUrl = `https://wa.me/${BOUTIQUE_CONFIG.whatsappNumber}?text=${whatsappText}`;

  return (
    <>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <h3 className="footer-brand">{BOUTIQUE_CONFIG.name}</h3>
              <p className="footer-muted">
                Exclusively Women&rsquo;s Boutique &amp; Ladies Custom Tailoring Studio dedicated to
                perfect fits, timeless Indian designs, and warm personal service.
              </p>
              <a
                href={BOUTIQUE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-pill"
              >
                <Instagram size={16} />
                <span>Follow us on Instagram</span>
              </a>
            </div>

            <div>
              <h4 className="footer-heading">Explore</h4>
              <ul className="footer-links">
                <li>
                  <a href="#home">Home</a>
                </li>
                <li>
                  <a href="#about">About Us</a>
                </li>
                <li>
                  <a href="#services">Our Services</a>
                </li>
                <li>
                  <a href="#gallery">Gallery</a>
                </li>
                <li>
                  <a href="#contact">Contact &amp; Enquiry</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="footer-heading">Connect</h4>
              <ul className="footer-links">
                <li>
                  <a href={`tel:${BOUTIQUE_CONFIG.phoneRaw}`}>
                    Call: {BOUTIQUE_CONFIG.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    WhatsApp Enquiry
                  </a>
                </li>
                <li>
                  <a
                    href={BOUTIQUE_CONFIG.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </li>
                <li>{BOUTIQUE_CONFIG.address}</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>
              &copy; {new Date().getFullYear()} {BOUTIQUE_CONFIG.name} Boutique. All rights
              reserved.
            </span>
            <a
              href={BOUTIQUE_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-bottom-social"
            >
              <Instagram size={15} />
              <span>Exclusively for Women &bull; Follow @SuiSaaj on Instagram</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Desktop Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp"
        aria-label="Enquire on WhatsApp"
      >
        <MessageCircle size={18} />
        <span>WhatsApp Us</span>
      </a>

      {/* Sticky Mobile Contact Bar */}
      <div className="mobile-sticky-bar" role="region" aria-label="Quick Contact Actions">
        <a href={`tel:${BOUTIQUE_CONFIG.phoneRaw}`} className="mobile-sticky-btn">
          <Phone size={16} />
          <span>Call</span>
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-sticky-btn mobile-sticky-btn--wa"
        >
          <MessageCircle size={16} />
          <span>WhatsApp</span>
        </a>
        <button
          type="button"
          className="mobile-sticky-btn mobile-sticky-btn--book"
          onClick={() => onBookAppointment()}
        >
          <Calendar size={16} />
          <span>Book Now</span>
        </button>
      </div>
    </>
  );
}
