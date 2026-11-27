import { useCallback, useState } from 'react';
import Header from './components/Header.jsx';
import HeroSection from './components/HeroSection.jsx';
import AboutSection from './components/AboutSection.jsx';
import ServicesSection from './components/ServicesSection.jsx';
import GallerySection from './components/GallerySection.jsx';
import WhyChooseUsSection from './components/WhyChooseUsSection.jsx';
import ContactSection from './components/ContactSection.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [preselectedService, setPreselectedService] = useState('');
  const [focusToken, setFocusToken] = useState(0);

  const handleBookAppointment = useCallback((serviceName = '') => {
    if (serviceName) {
      setPreselectedService(serviceName);
    }
    setFocusToken((prev) => prev + 1);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      <Header onBookAppointment={handleBookAppointment} />
      <main>
        <HeroSection onBookAppointment={handleBookAppointment} />
        <AboutSection onBookAppointment={handleBookAppointment} />
        <ServicesSection onSelectService={handleBookAppointment} />
        <GallerySection onBookService={handleBookAppointment} />
        <WhyChooseUsSection />
        <ContactSection preselectedService={preselectedService} focusToken={focusToken} />
      </main>
      <Footer onBookAppointment={handleBookAppointment} />
    </>
  );
}
