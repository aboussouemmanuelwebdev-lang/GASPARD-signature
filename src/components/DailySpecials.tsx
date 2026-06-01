import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Utensils, Star, Flame, Clock } from 'lucide-react';
import { DailySpecial } from '../types';

interface DailySpecialsProps {
  specials: DailySpecial[];
  onSelectSpecial: (special: DailySpecial) => void;
}

export default function DailySpecials({ specials, onSelectSpecial }: DailySpecialsProps) {
  // Only display active and available specials
  const availableSpecials = specials.filter(s => s.isAvailable);

  if (availableSpecials.length === 0) return null;

  return (
    <section id="specials" className="py-24 bg-gradient-to-b from-[#0A0A0A] to-black scroll-mt-20 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section title & branding */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-gold-400/10 border border-gold-400/20 px-3 py-1 rounded-full mb-4">
            <Sparkles size={12} className="text-gold-400 animate-pulse" />
            <span className="text-gold-400 font-mono text-[10px] uppercase tracking-widest font-bold">Suggestions du Chef</span>
          </div>
          
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Créations Éphémères & Ardoise du Jour
          </h2>
          
          <p className="text-white/60 text-sm sm:text-base">
            Inspiré par le marché matinal d'Abidjan et les plus nobles arrivages internationaux, notre Chef gaspésien élabore chaque jour des assiettes signatures en quantités limitées.
          </p>
        </div>

        {/* Specials Cards list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {availableSpecials.map((special, idx) => (
            <motion.div
              key={special.id}
              id={`daily-special-${special.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-[#121212]/40 rounded-2xl border border-white/5 overflow-hidden flex flex-col justify-between hover:border-gold-400/20 group hover:bg-[#121212]/80 transition-all duration-300 relative"
            >
              <div>
                
                {/* Enticing food photo with nice zoom effects */}
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={special.imageUrl}
                    alt={special.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Dark gradient shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Badge Text banner */}
                  {special.badgeText && (
                    <span className="absolute top-4 left-4 bg-gradient-to-r from-gold-600 to-gold-400 text-black text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded shadow-md">
                      {special.badgeText}
                    </span>
                  )}

                  {/* Daily tag indicator */}
                  <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-xs px-2.5 py-1 rounded flex items-center space-x-1.5 border border-white/10">
                    <Clock size={10} className="text-gold-400" />
                    <span className="text-[9px] text-white/90 font-mono uppercase tracking-wider font-bold">Aujourd'hui seulement</span>
                  </div>
                </div>

                {/* Content description */}
                <div className="p-6 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-gold-300 transition-colors leading-snug">
                      {special.name}
                    </h3>
                  </div>

                  <p className="text-white/60 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {special.description}
                  </p>
                </div>

              </div>

              {/* Pricing & Cart Action feet */}
              <div className="p-6 pt-0 border-t border-white/5 mt-auto flex items-center justify-between">
                <div>
                  <span className="block text-[9px] uppercase font-mono tracking-widest text-white/40">Tarif Unique</span>
                  <span className="text-gold-400 font-mono text-base font-bold">
                    {special.price.toLocaleString()} FCFA
                  </span>
                </div>

                <button
                  id={`btn-order-special-${special.id}`}
                  onClick={() => onSelectSpecial(special)}
                  className="bg-white/5 hover:bg-gold-500 hover:text-black border border-white/10 hover:border-gold-500 text-white font-semibold text-[11px] uppercase tracking-wider py-2 px-3.5 rounded transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Utensils size={13} />
                  <span>Commander</span>
                </button>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Limited items alert ticker */}
        <div className="mt-12 text-center text-[11px] text-white/40 font-mono flex items-center justify-center space-x-2">
          <Flame size={12} className="text-red-500 animate-bounce" />
          <span>Notre cuisine travaille des produits d'une fraîcheur absolue. Les suggestions sont servies uniquement dans la limite des stocks du jour.</span>
        </div>

      </div>
    </section>
  );
}
