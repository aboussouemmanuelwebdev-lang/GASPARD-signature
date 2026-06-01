import React, { useState, useEffect } from 'react';
import { Phone, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FloatingActions() {
  const [isVisible, setIsVisible] = useState(false);

  // Monitor viewport scroll to show back-to-top helper
  useEffect(() => {
    const handleScrollEffects = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScrollEffects);
    return () => window.removeEventListener('scroll', handleScrollEffects);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div id="floating-actions-container" className="fixed bottom-6 right-6 z-40 flex flex-col items-center space-y-4">
      
      <AnimatePresence>
        {/* WhatsApp Floating Button - Always Visible with pulsing badge */}
        <motion.a
          id="btn-whatsapp-floating"
          href="https://wa.me/2250700006082?text=Bonjour%20Gaspard%20Signature,%20je%20souhaiterais%20avoir%20des%20informations%20ou%20faire%20une%20réservation..."
          target="_blank"
          referrerPolicy="no-referrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer group hover:scale-105 transition-all"
          title="Nous écrire sur WhatsApp"
        >
          {/* Pulsing ring */}
          <span className="absolute inset-0 rounded-full bg-emerald-600/30 animate-ping group-hover:hidden" />
          
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="relative z-10"
          >
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
          </svg>
          
          <span className="absolute right-14 bg-emerald-600 text-white font-mono text-[10px] uppercase tracking-widest px-2.5 py-1.5 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Chat WhatsApp
          </span>
        </motion.a>

        {/* Call Now Button - Always visible */}
        <motion.a
          id="btn-call-floating"
          href="tel:+2250700006082"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gold-500 hover:bg-gold-400 text-black p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer group hover:scale-105 transition-all"
          title="Appeler Gaspard Signature"
        >
          <Phone size={20} />
          
          <span className="absolute right-14 bg-gold-500 text-black font-semibold text-[10px] uppercase tracking-widest px-2.5 py-1.5 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            07 00 00 60 82
          </span>
        </motion.a>

        {/* Scroll To Top helper */}
        {isVisible && (
          <motion.button
            id="btn-scroll-top-floating"
            onClick={scrollToTop}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="bg-[#121111]/80 backdrop-blur-xs hover:bg-[#222]/90 text-gold-400 border border-gold-400/20 p-3.5 rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:border-gold-400 transition-colors"
            title="Revenir en haut"
          >
            <ChevronUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
