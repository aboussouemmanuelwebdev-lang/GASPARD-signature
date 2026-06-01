import { useState, useMemo } from 'react';
import { MenuItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Flame, CirclePercent, ArrowRight } from 'lucide-react';

interface MenuSectionProps {
  menuItems: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
}

export default function MenuSection({ menuItems, onSelectItem }: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Tout voir' },
    { id: 'entrées', label: 'Entrées' },
    { id: 'salades', label: 'Salades' },
    { id: 'pizzas', label: 'Pizzas' },
    { id: 'grillades', label: 'Grillades' },
    { id: 'burgers', label: 'Burgers' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'boissons', label: 'Boissons' }
  ];

  // Filter items dynamically
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  return (
    <section id="menu" className="py-24 bg-black scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header summary */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold-400 font-mono text-xs uppercase tracking-[0.3em] mb-2 block">
            Saveurs d'Exception
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Notre Carte Signature
          </h2>
          <p className="text-white/60 text-sm sm:text-base">
            Découvrez nos spécialités cuites au feu de bois, nos pizzas artisanales façonnées main et nos créations internationales imaginées par notre Chef d'exception.
          </p>
        </div>

        {/* Filters and search layout */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          
          {/* Category Chips - Scrollable on Mobile */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-4 md:pb-0 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`cat-filter-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/10'
                    : 'bg-[#121111] hover:bg-[#1C1A1A] text-white/70 hover:text-white border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              id="menu-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un mets..."
              className="w-full bg-[#121111] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-gold-400 font-mono transition-all"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          </div>

        </div>

        {/* Menu Grid with Animations */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-[#121111] rounded-xl border border-white/5">
            <p className="text-white/50 text-base font-medium">Aucun plat ne correspond à votre recherche.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="text-gold-400 hover:text-gold-300 font-mono text-sm underline mt-3 cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  id={`menu-item-${item.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-[#121212]/30 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 border ${
                    item.isAvailable ? 'border-white/5' : 'border-white/5 opacity-55'
                  } hover:border-gold-500/15 hover:bg-[#121212]/60 transition-all duration-300 relative group`}
                >
                  {/* Item Image */}
                  <div className="w-full sm:w-28 sm:h-28 h-40 overflow-hidden rounded-lg bg-[#222] flex-shrink-0 relative">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Promotion badge overlay */}
                    {item.isPromotion && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded flex items-center space-x-1 shadow-md">
                        <CirclePercent size={10} />
                        <span>PROMO</span>
                      </div>
                    )}

                    {/* Out of Stock overlay */}
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center">
                        <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider font-mono bg-red-800/80 px-2 py-1 rounded">Épuisé</span>
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-gold-300 transition-colors">
                          {item.name}
                        </h3>
                        
                        {/* Price rendering */}
                        <div className="text-right flex-shrink-0">
                          {item.isPromotion && item.promotionPrice ? (
                            <div className="flex flex-col">
                              <span className="text-gold-400 font-mono text-sm sm:text-base font-semibold">
                                {item.promotionPrice.toLocaleString()} FCFA
                              </span>
                              <span className="text-white/40 font-mono text-xs line-through">
                                {item.price.toLocaleString()} F
                              </span>
                            </div>
                          ) : (
                            <span className="text-gold-300 font-mono text-sm sm:text-base font-semibold">
                              {item.price.toLocaleString()} FCFA
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-white/50 text-xs sm:text-sm mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Availability / Tag Indicator */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 gap-3">
                      <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono">
                        {item.category}
                      </span>
                      
                      {item.isAvailable ? (
                        <button
                          type="button"
                          id={`btn-add-item-cart-${item.id}`}
                          onClick={() => onSelectItem(item)}
                          className="bg-gold-500/10 hover:bg-[#D4AF37] hover:text-black border border-gold-400/20 hover:border-[#D4AF37] text-gold-400 font-bold text-[10px] uppercase tracking-widest py-1.5 px-3 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          Ajouter au panier
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-red-500/80 uppercase font-bold">
                          Épuisé
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Call to Order Button/CTA */}
        <div className="mt-16 bg-gradient-to-r from-gold-950/40 via-gold-900/10 to-transparent p-6 sm:p-8 rounded-xl border border-gold-400/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h4 className="font-serif text-lg font-bold text-white">Une envie particulière ou une allergie ?</h4>
            <p className="text-white/50 text-xs sm:text-sm mt-1">Nos chefs adaptent volontiers vos plats sur simple demande.</p>
          </div>
          <button
            onClick={() => {
              const bookingSec = document.getElementById('booking');
              if (bookingSec) bookingSec.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-transparent hover:bg-gold-500/10 text-gold-400 hover:text-gold-300 font-semibold border border-gold-400/20 px-5 py-3 rounded text-xs uppercase tracking-widest flex items-center space-x-2 transition-all cursor-pointer"
          >
            <span>Commander en réservant</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </section>
  );
}
