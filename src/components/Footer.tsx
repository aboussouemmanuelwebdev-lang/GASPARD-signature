import { Phone, Mail, MapPin, ShieldCheck, Facebook, Instagram } from 'lucide-react';
import { RestaurantConfig } from '../types';

interface FooterProps {
  onScrollToSection: (id: string) => void;
  onOpenAdmin: () => void;
  config?: RestaurantConfig | null;
}

export default function Footer({ onScrollToSection, onOpenAdmin, config }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080808] border-t border-white/5 pt-16 pb-8 text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand/Slogan Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/src/assets/images/gaspard_logo_1780221046879.png" 
                alt="Gaspard Signature Logo" 
                className="w-10 h-10 rounded-lg object-cover border border-gold-500/30"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-widest text-gold-400">
                  GASPARD
                </span>
                <span className="text-[10px] uppercase tracking-[0.35em] text-white/60 -mt-1 font-mono">
                  Signature
                </span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-light">
              Une table de famille chaleureuse, des garnitures d'exception au feu de bois et l'exigence d'une expérience culinaire inoubliable à Angré.
            </p>

            {/* Social media links */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                id="footer-social-fb"
                href={config?.facebookUrl || "https://facebook.com/gaspardsignature"}
                target="_blank"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-gold-400 hover:bg-white/10 transition-colors"
                title="Suivez-nous sur Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                id="footer-social-ig"
                href={config?.instagramUrl || "https://instagram.com/gaspardsignature"}
                target="_blank"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-gold-400 hover:bg-white/10 transition-colors"
                title="Suivez-nous sur Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                id="footer-social-tiktok"
                href={config?.tiktokUrl || "https://www.tiktok.com/@gaspardsignature_"}
                target="_blank"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-gold-400 hover:bg-white/10 transition-colors"
                title="Suivez-nous sur TikTok"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-[15px] h-[15px] lucide lucide-tiktok"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-widest mb-4">Navigation</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onScrollToSection('home')}
                  className="hover:text-gold-400 transition-colors cursor-pointer block"
                >
                  Accueil / Présentation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('about')}
                  className="hover:text-gold-400 transition-colors cursor-pointer block"
                >
                  Notre Histoire & Équipe
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('menu')}
                  className="hover:text-gold-400 transition-colors cursor-pointer block"
                >
                  Consulter notre Carte
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('gallery')}
                  className="hover:text-gold-400 transition-colors cursor-pointer block"
                >
                  Galerie Photos HD
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('booking')}
                  className="hover:text-gold-400 transition-colors cursor-pointer block"
                >
                  Faire une Réservation
                </button>
              </li>
            </ul>
          </div>

          {/* Opening times column */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-widest mb-4">Horaires de table</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-white/50 font-mono">
              {config?.openingHours?.map((hour, idx) => (
                <li key={`footer-hour-${hour.day}-${idx}`} className="flex justify-between hover:text-white transition-colors duration-200">
                  <span>{hour.day}</span>
                  <span className="text-gold-400">{hour.hours}</span>
                </li>
              )) || (
                <>
                  <li className="flex justify-between">
                    <span>Lundi - Dimanche</span>
                    <span className="text-gold-400">08:00 - 03:00</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Rapid Concierge contact column */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-widest mb-4">Conciergerie</h4>
            
            <div className="flex items-start space-x-2 text-xs sm:text-sm">
              <MapPin size={16} className="text-gold-400 mt-0.5 flex-shrink-0" />
              <span>{config?.address || "8ème Tranche, en face de la pharmacie, Cocody, Abidjan"}</span>
            </div>

            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <Phone size={16} className="text-gold-400" />
              <a href={`tel:${config?.phone || "+2250700006082"}`} className="hover:text-gold-400 font-mono">
                {config?.phone || "07 00 00 60 82"}
              </a>
            </div>

            <div className="flex items-center space-x-2 text-xs sm:text-sm">
              <Mail size={16} className="text-gold-400" />
              <a href={`mailto:${config?.email || "hassanfissai1988@gmail.com"}`} className="hover:text-gold-400 font-mono transition-colors">
                {config?.email || "hassanfissai1988@gmail.com"}
              </a>
            </div>
          </div>

        </div>

        {/* Separator & Copy/Admin footer */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/40">
          <p>© {currentYear} Gaspard Signature. Tous droits réservés. Abidjan, Côte d'Ivoire.</p>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0 font-mono">
            <span>Créé avec excellence</span>
            <span>•</span>
            <button
              id="footer-admin-trigger"
              onClick={onOpenAdmin}
              className="hover:text-gold-400 flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <ShieldCheck size={12} />
              <span>Espace Professionnel</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
