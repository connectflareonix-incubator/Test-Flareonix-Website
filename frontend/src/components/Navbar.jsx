import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { LOGO_URL } from '@/config/constants';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Community', href: '/community' },
  { name: 'Events', href: '/events' },
  { name: 'Growth Consultation', href: '/consultation' },
  { name: 'Incubator', href: '/incubator' },
  { name: 'AI Tools', href: '/ai-tools' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, login, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href) => location.pathname === href;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass py-3' : 'bg-transparent py-4'
        }`}
        data-testid="navbar"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" data-testid="navbar-logo">
            <img src={LOGO_URL} alt="Flareonix" className="h-10 md:h-12 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href) 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-white'
                }`}
                data-testid={`nav-link-${link.name.toLowerCase()}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="ghost" className="text-white gap-2" data-testid="dashboard-btn">
                    <User size={18} />
                    {user.name?.split(' ')[0]}
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={logout}
                  className="text-muted-foreground hover:text-white"
                  data-testid="logout-btn"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              <Button
                onClick={login}
                className="bg-primary text-white hover:bg-primary/90 rounded-full px-6"
                data-testid="login-btn"
              >
                Enter the Fire
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2"
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
            className="fixed inset-0 z-40 lg:hidden bg-[#050505]/98 backdrop-blur-lg pt-20"
          >
            <div className="flex flex-col items-center gap-4 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-lg font-semibold ${
                    isActive(link.href) ? 'text-primary' : 'text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-white/10 w-full text-center">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full mb-2 bg-primary">Dashboard</Button>
                    </Link>
                    <Button variant="ghost" onClick={logout} className="text-white w-full">
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button onClick={login} className="bg-primary text-white w-full">
                    Enter the Fire
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
