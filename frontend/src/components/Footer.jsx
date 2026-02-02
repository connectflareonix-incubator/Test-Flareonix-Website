import React from 'react';
import { Instagram, ArrowUp } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_67b702d1-b010-4e85-8987-3c95d6ed01fa/artifacts/ko2oskb5_Flareonix.png";
const INSTAGRAM_URL = "https://instagram.com/flare.onix";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Ecosystem', href: '#ecosystem' },
    { name: 'Community', href: '#community' },
    { name: 'Vision', href: '#vision' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer 
      className="relative bg-[#050505] border-t border-white/5 py-12 md:py-16"
      data-testid="footer"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={LOGO_URL} 
                alt="Flareonix" 
                className="h-10 w-auto"
              />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The youth-powered, AI-driven startup ecosystem for ambitious Indian founders.
            </p>
            <p className="text-primary font-heading font-bold text-sm italic">
              Rise. Ignite. Conquer.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    data-testid={`footer-link-${link.name.toLowerCase()}`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="space-y-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
                data-testid="footer-instagram"
              >
                <Instagram className="h-4 w-4" />
                @flare.onix
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Flareonix. All rights reserved.
          </p>
          
          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm group"
            data-testid="back-to-top"
          >
            Back to top
            <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary transition-colors">
              <ArrowUp className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
