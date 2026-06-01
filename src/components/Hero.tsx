import { motion } from 'motion/react';
import { Calendar, ChevronDown, MapPin } from 'lucide-react';

interface HeroProps {
  onScrollToSection: (id: string) => void;
}

export default function Hero({ onScrollToSection }: HeroProps) {
  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Immersive Background Image with Zoom effect */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.55 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80')"
          }}
        />
        {/* Dark radial overlay to focus text */}
        <div className="absolute inset-0 bg-radial-gradient-overlay bg-black/60 md:bg-black/40" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-12 flex flex-col items-center">
        {/* Subtle Pretitle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex items-center space-x-2 text-gold-400 text-xs sm:text-sm tracking-[0.4em] uppercase mb-4"
        >
          <span className="h-[1px] w-6 bg-gold-400" />
          <span>Restaurant Gastronomique Familial</span>
          <span className="h-[1px] w-6 bg-gold-400" />
        </motion.div>

        {/* Brand Display Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.0 }}
          className="font-serif text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white mb-5 select-none leading-none"
        >
          Gaspard <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600">Signature</span>
        </motion.h1>

        {/* Corporate Slogan */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-white/80 max-w-2xl text-base sm:text-lg lg:text-xl font-light tracking-wide mb-8"
        >
          L'alliance subtile d'ingrédients d'exception et de saveurs authentiques. 
          Vivez une expérience culinaire inoubliable au cœur d'Abidjan.
        </motion.p>

        {/* Location badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="flex items-center space-x-2 text-white/50 text-xs sm:text-sm font-mono tracking-wider bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full mb-10"
        >
          <MapPin size={14} className="text-gold-400" />
          <span>8ème Tranche, Cocody, Abidjan</span>
        </motion.div>

        {/* Dual Call-To-Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            id="hero-book-btn"
            onClick={() => onScrollToSection('booking')}
            className="w-full sm:w-auto bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:from-gold-700 hover:to-gold-500 text-black font-semibold uppercase tracking-widest text-xs px-8 py-4 rounded shadow-2xl hover:shadow-gold-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <Calendar size={15} />
            <span>Réserver une table</span>
          </button>
          
          <button
            id="hero-menu-btn"
            onClick={() => onScrollToSection('menu')}
            className="w-full sm:w-auto bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-gold-400 transition-all font-semibold uppercase tracking-widest text-xs px-8 py-4 rounded cursor-pointer"
          >
            Découvrir le menu
          </button>
        </motion.div>
      </div>

      {/* Down Chevron link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6, y: [0, 8, 0] }}
        transition={{ delay: 1.3, duration: 1.5, repeat: Infinity }}
        onClick={() => onScrollToSection('about')}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 cursor-pointer hidden sm:flex flex-col items-center"
      >
        <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-white/40 mb-1">Découvrir</span>
        <ChevronDown size={20} className="text-gold-400" />
      </motion.div>
    </section>
  );
}
