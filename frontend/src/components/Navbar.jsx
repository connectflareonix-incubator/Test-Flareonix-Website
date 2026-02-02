import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_67b702d1-b010-4e85-8987-3c95d6ed01fa/artifacts/ko2oskb5_Flareonix.png";
const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSf5EK_CDUtKwZFo1s9z6MeM-XIoeNfegqdODcNbCGSlRa4Lcw/viewform";

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Ecosystem', href: '#ecosystem' },
  { name: 'Community', href: '#community' },
  { name: 'Vision', href: '#vision' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass py-3' : 'bg-transparent py-5'
        }`}
        data-testid="navbar"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3"
            data-testid="navbar-logo"
          >
            <img 
              src={LOGO_URL} 
              alt="Flareonix" 
              className="h-10 md:h-12 w-auto"
            />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm tracking-wide"
                data-testid={`nav-link-${link.name.toLowerCase()}`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://instagram.com/flare.onix"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-instagram"
            >
              <Instagram size={20} />
            </a>
            <Button
              onClick={() => window.open(GOOGLE_FORM_URL, '_blank')}
              className="bg-primary text-white hover:bg-primary/90 rounded-full px-6 py-2 text-sm font-semibold transition-all hover:scale-105 hover-glow"
              data-testid="nav-join-btn"
            >
              Join Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
            data-testid="mobile-menu-btn"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden mobile-nav-bg pt-20"
            data-testid="mobile-menu"
          >
            <div className="flex flex-col items-center gap-6 p-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-white text-xl font-heading font-semibold hover:text-primary transition-colors"
                  data-testid={`mobile-nav-${link.name.toLowerCase()}`}
                >
                  {link.name}
                </button>
              ))}
              <div className="flex items-center gap-6 mt-6">
                <a
                  href="https://instagram.com/flare.onix"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram size={24} />
                </a>
              </div>
              <Button
                onClick={() => window.open(GOOGLE_FORM_URL, '_blank')}
                className="mt-4 bg-primary text-white hover:bg-primary/90 rounded-full px-8 py-3 text-base font-semibold"
                data-testid="mobile-join-btn"
              >
                Join Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
