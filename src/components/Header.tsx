import { useState, useEffect } from 'react';
import { Menu, X, Phone, Calendar, ShieldCheck, Clock, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PromotionalBanner } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAdmin: () => void;
  cartCount: number;
  onOpenCart: () => void;
  banners: PromotionalBanner[];
}

export default function Header({ activeTab, setActiveTab, onOpenAdmin, cartCount, onOpenCart, banners }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        isScrolled || setIsScrolled(true);
      } else {
        !isScrolled || setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'about', label: 'À Propos' },
    { id: 'menu', label: 'Menu' },
    { id: 'gallery', label: 'Galerie' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
    
    // Smooth scroll to element
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Promotional Banners */}
      {banners && banners.filter(b => b.isActive).map((banner) => (
        <div
          key={banner.id}
          className={`${banner.bgColor || 'bg-gold-500 text-black'} py-1.5 px-4 text-center text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider relative flex items-center justify-center gap-2 shadow-md border-b border-white/10`}
        >
          <span>{banner.text}</span>
        </div>
      ))}

      <header
        id="main-header"
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0A0A0Ac0] backdrop-blur-md border-b border-gold-500/10 shadow-lg py-3'
            : 'bg-[#0A0A0A40] border-b border-white/5 py-5'
        }`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavClick('home')}
            id="brand-logo"
          >
            <img 
              src="/src/assets/images/gaspard_logo_1780221046879.png" 
              alt="Gaspard Signature Logo" 
              className="w-10 h-10 rounded-lg object-cover border border-gold-500/30 group-hover:border-gold-400 transition-colors duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-widest text-gold-400">
                GASPARD
              </span>
              <span className="text-[9px] uppercase tracking-[0.35em] text-white/60 -mt-1 font-mono">
                Signature
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`relative py-2 text-sm uppercase tracking-widest font-medium transition-colors cursor-pointer ${
                  activeTab === item.id ? 'text-gold-400' : 'text-white/80 hover:text-gold-300'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-400"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Desktop Right Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              id="header-btn-call"
              onClick={() => window.open('tel:+2250700006082')}
              className="flex items-center space-x-2 text-sm text-gold-300 hover:text-gold-400 font-medium transition-colors border border-gold-400/20 px-3 py-1.5 rounded"
            >
              <Phone size={14} />
              <span className="font-mono">07 00 00 60 82</span>
            </button>
            <button
              id="header-btn-cart"
              onClick={onOpenCart}
              className="relative p-2 text-white hover:text-gold-400 transition-colors cursor-pointer mr-1"
              title="Mon Panier"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-[1px] -right-[1px] bg-red-600 text-white font-mono text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              id="header-btn-reserve"
              onClick={() => handleNavClick('booking')}
              className="bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-700 hover:to-gold-500 text-black text-sm uppercase tracking-wider font-semibold px-4 py-2 rounded shadow-md transition-all cursor-pointer"
            >
              Réserver une table
            </button>
            <button
              id="header-btn-admin-panel"
              onClick={onOpenAdmin}
              title="Espace Administration"
              className="text-white/40 hover:text-gold-400 p-2 transition-colors cursor-pointer"
            >
              <ShieldCheck size={20} />
            </button>
          </div>

          {/* Mobile Right Quick Action & Drawer Toggle */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              id="mobile-btn-cart"
              onClick={onOpenCart}
              className="relative p-2 text-white hover:text-gold-400 transition-colors cursor-pointer"
              title="Mon Panier"
            >
              <ShoppingBag size={21} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white font-mono text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              id="mobile-btn-reserve"
              onClick={() => handleNavClick('booking')}
              className="bg-gradient-to-r from-gold-600 to-gold-400 text-black text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded cursor-pointer"
            >
              Réserver
            </button>
            <button
              id="mobile-nav-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gold-400 p-1 cursor-pointer"
              aria-label="Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer (AnimatePresence) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#0F0F0F]/95 backdrop-blur-lg border-b border-gold-500/20"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left py-2.5 px-3 rounded text-[15px] uppercase tracking-widest font-medium transition-colors ${
                    activeTab === item.id ? 'bg-gold-500/10 text-gold-400 border-l-2 border-gold-400' : 'text-white/75'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <button
                id="mobile-nav-booking"
                onClick={() => handleNavClick('booking')}
                className={`block w-full text-left py-2.5 px-3 rounded text-[15px] uppercase tracking-widest font-medium transition-colors ${
                  activeTab === 'booking' ? 'bg-gold-500/10 text-gold-400 border-l-2 border-gold-400' : 'text-white/75'
                }`}
              >
                Réservations
              </button>

              <div className="pt-4 border-t border-white/5 flex flex-col space-y-3 px-3">
                <a
                  id="mobile-drawer-call"
                  href="tel:+2250700006082"
                  className="flex items-center space-x-2 text-gold-300 font-mono text-sm py-1"
                >
                  <Phone size={14} />
                  <span>07 00 00 60 82</span>
                </a>
                <button
                  id="mobile-drawer-admin"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenAdmin();
                  }}
                  className="text-left text-white/50 hover:text-gold-400 text-xs py-1 flex items-center space-x-1"
                >
                  <ShieldCheck size={14} />
                  <span>Espace Gestion Administrateur</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  </div>
  );
}
