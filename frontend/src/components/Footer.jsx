import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, ArrowUp, Flame, Linkedin } from 'lucide-react';
import { LOGO_URL, INSTAGRAM_URL, WHATSAPP_URL, SOCIAL_LINKEDIN, FREELANCER_FORM, FOUNDER_FORM } from '@/config/constants';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Community', href: '/community' },
    { name: 'Growth Consultation', href: '/consultation' },
    { name: 'Freelancer Hub', href: '/freelancer-hub' },
    { name: 'Incubator', href: '/incubator' },
  ];

  const resourceLinks = [
    { name: 'AI Tools', href: '/ai-tools' },
    { name: 'Blog', href: '/blog' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="relative bg-[#050505] border-t border-white/5 py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={LOGO_URL} alt="Flareonix" className="h-12 w-auto" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Where creators are reborn. Build your identity. Earn. Grow. Dominate.
            </p>
            <p className="text-primary font-heading font-bold text-sm italic flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Rise. Ignite. Conquer.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
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
              >
                <Instagram className="h-4 w-4" />
                @flare.onix
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                WhatsApp Channel
              </a>
              <a
                href={SOCIAL_LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
              <a
                href={FOUNDER_FORM}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Founder Application
              </a>
              <a
                href={FREELANCER_FORM}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Freelancer Application
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Flareonix. All rights reserved.
          </p>
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
