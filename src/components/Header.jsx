import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BOUTIQUE_CONFIG } from '../data/boutiqueData.js';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Our Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact Us', href: '#contact' },
];

export default function Header({ onBookAppointment }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="container header-inner">
        <a href="#home" className="brand-logo" aria-label={`${BOUTIQUE_CONFIG.name} Home`}>
          <span className="brand-mark" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M19.5 4.5C15 4.5 11.5 8 8.5 13.5L4.5 19.5M19.5 4.5C19.5 9 16 12.5 10.5 15.5M19.5 4.5L14 10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
            </svg>
          </span>
          <span className="brand-text">
            <span className="brand-name">{BOUTIQUE_CONFIG.name}</span>
            <span className="brand-sub">Exclusively for Women</span>
          </span>
        </a>

        <nav className="nav-desktop" aria-label="Primary Navigation">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="btn btn--primary header-cta"
          onClick={() => onBookAppointment()}
        >
          Book an Appointment
        </button>

        <button
          type="button"
          className="mobile-menu-btn"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="mobile-drawer" aria-label="Mobile Navigation">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} onClick={handleNavClick}>
              {item.label}
            </a>
          ))}
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => {
              setMenuOpen(false);
              onBookAppointment();
            }}
          >
            Book an Appointment
          </button>
        </nav>
      )}
    </header>
  );
}
