import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, ShieldCheck, Heart, ShoppingBag } from 'lucide-react';
import { MenuItem, DailySpecial, CustomizedCartItem } from '../types';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | DailySpecial | null;
  onAddToCart: (customCartItem: Omit<CustomizedCartItem, 'cartId'>) => void;
}

export default function CustomizationModal({
  isOpen,
  onClose,
  item,
  onAddToCart
}: CustomizationModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [customInstructions, setCustomInstructions] = useState('');
  
  // Specific Options
  const [spiceLevel, setSpiceLevel] = useState<'doux' | 'moyen' | 'épicé' | 'piment_doublé'>('moyen');
  const [cookingDegree, setCookingDegree] = useState<'bleu' | 'saignant' | 'à point' | 'bien cuit'>('à point');
  const [extraCheese, setExtraCheese] = useState(false);
  const [choppedOnions, setChoppedOnions] = useState(true);

  // Reset state when a new item is selected
  useEffect(() => {
    if (item) {
      setQuantity(1);
      setCustomInstructions('');
      setSpiceLevel('moyen');
      setCookingDegree('à point');
      setExtraCheese(false);
      setChoppedOnions(true);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  // Determine item category or if it's a meat-based dish
  const isMeatDish = 
    item.name.toLowerCase().includes('bœuf') || 
    item.name.toLowerCase().includes('agneau') || 
    item.name.toLowerCase().includes('steak') ||
    item.name.toLowerCase().includes('filet') ||
    (item as any).category === 'grillades' || 
    (item as any).category === 'burgers';

  const isPizzaOrBurger = 
    item.name.toLowerCase().includes('pizza') || 
    item.name.toLowerCase().includes('burger') ||
    (item as any).category === 'pizzas' ||
    (item as any).category === 'burgers';

  const hasSpiceOption = 
    !(item as any).category || // specials may want spice control
    isPizzaOrBurger || 
    (item as any).category === 'grillades' || 
    (item as any).category === 'salades';

  const itemPrice = (item as any).isPromotion && (item as any).promotionPrice ? (item as any).promotionPrice : item.price;
  const totalPrice = (itemPrice + (extraCheese ? 1500 : 0)) * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToCart({
      item,
      quantity,
      customInstructions,
      options: {
        spiceLevel: hasSpiceOption ? spiceLevel : undefined,
        cookingDegree: isMeatDish ? cookingDegree : undefined,
        extraCheese: isPizzaOrBurger ? extraCheese : undefined,
        choppedOnions: isPizzaOrBurger ? choppedOnions : undefined
      }
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-[#121212] border border-gold-400/20 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative"
        >
          {/* Header Image representation */}
          <div className="h-44 w-full relative">
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-black/30" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white hover:text-gold-400 p-2 rounded-full cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>

            <div className="absolute bottom-4 left-5 right-5">
              <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400 bg-gold-400/10 px-2 py-0.5 rounded border border-gold-400/20">
                {('category' in item) ? `Carte • ${item.category}` : 'Suggestion Exceptionnelle'}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-2 drop-shadow-md">
                {item.name}
              </h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Description and standard pricing */}
            <div className="space-y-1">
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                {item.description}
              </p>
              <p className="text-gold-300 font-mono text-xs pt-1">
                Base: <strong className="text-sm">{itemPrice.toLocaleString()} FCFA</strong>
              </p>
            </div>

            {/* Customization Details form */}
            <div className="space-y-5 max-h-[35vh] overflow-y-auto pr-1">
              
              {/* Spice choice */}
              {hasSpiceOption && (
                <div className="space-y-2">
                  <span className="block text-[11px] uppercase font-mono tracking-wider text-white/50">Niveau de piment (Gratuit)</span>
                  <div className="grid grid-cols-4 gap-2">
                    {(['doux', 'moyen', 'épicé', 'piment_doublé'] as const).map((level) => (
                      <button
                        type="button"
                        key={level}
                        onClick={() => setSpiceLevel(level)}
                        className={`py-2 px-1 text-[10px] sm:text-xs font-mono uppercase font-semibold rounded text-center border cursor-pointer transition-colors ${
                          spiceLevel === level
                            ? 'bg-gold-500 text-black border-gold-500 font-bold'
                            : 'bg-black/30 text-white/60 border-white/5 hover:border-white/10 hover:text-white'
                        }`}
                      >
                        {level === 'doux' ? 'Sans piment' : level === 'moyen' ? 'Moyen' : level === 'épicé' ? 'Épicé 🔥' : 'Fort 🔥🔥'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cooking degree (for beef items) */}
              {isMeatDish && (
                <div className="space-y-2">
                  <span className="block text-[11px] uppercase font-mono tracking-wider text-white/50">Degré de cuisson (Viande)</span>
                  <div className="grid grid-cols-4 gap-2">
                    {(['bleu', 'saignant', 'à point', 'bien cuit'] as const).map((degree) => (
                      <button
                        type="button"
                        key={degree}
                        onClick={() => setCookingDegree(degree)}
                        className={`py-2 px-1 text-[10px] sm:text-xs font-mono uppercase font-semibold rounded text-center border cursor-pointer transition-colors ${
                          cookingDegree === degree
                            ? 'bg-gold-500 text-black border-gold-500 font-bold'
                            : 'bg-black/30 text-white/60 border-white/5 hover:border-white/10 hover:text-white'
                        }`}
                      >
                        {degree}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Extras checkbox */}
              {isPizzaOrBurger && (
                <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="block text-[11px] uppercase font-mono tracking-wider text-white/40">Garnitures additionnelles</span>
                  
                  <div className="flex flex-col space-y-2.5">
                    <label className="flex items-center justify-between text-xs text-white/80 cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={extraCheese}
                          onChange={(e) => setExtraCheese(e.target.checked)}
                          className="rounded text-gold-500 focus:ring-0 bg-black/40 border-white/10"
                        />
                        <span>Supplément Fromage Royal Double (Fior di latte)</span>
                      </div>
                      <span className="text-gold-400 font-mono text-[11px] font-bold">+1,500 F</span>
                    </label>

                    <label className="flex items-center justify-between text-xs text-white/80 cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={choppedOnions}
                          onChange={(e) => setChoppedOnions(e.target.checked)}
                          className="rounded text-gold-500 focus:ring-0 bg-black/40 border-white/10"
                        />
                        <span>Oignons émincés croustillants</span>
                      </div>
                      <span className="text-white/40 text-[10px]">Inclus</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div className="space-y-1.5">
                <label className="block text-[11px] uppercase font-mono tracking-wider text-white/50">
                  Instructions culinaires spécifiques
                </label>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="Ex: Sans oignon, champignons à part, sauce à la truffe séparée..."
                  rows={2}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-gold-400 focus:ring-0 transition-colors"
                />
              </div>

            </div>

            {/* Quantity and Checkout Cart Button */}
            <div className="border-t border-white/5 pt-5 flex items-center justify-between gap-4">
              
              {/* Quantity selector */}
              <div className="flex items-center space-x-3 bg-black/40 border border-white/10 rounded-lg py-1 px-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-white/50 hover:text-gold-400 text-lg font-bold px-1 transition-colors"
                >
                  -
                </button>
                <span className="text-white font-mono font-bold text-sm w-6 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-white/50 hover:text-gold-400 text-lg font-bold px-1 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                id="btn-confirm-customization"
                className="flex-grow bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-700 hover:to-gold-500 text-black font-semibold uppercase tracking-wider text-xs py-3.5 px-4 rounded-lg shadow-md hover:scale-[1.01] transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ShoppingBag size={14} />
                <span>Ajouter • {totalPrice.toLocaleString()} FCFA</span>
              </button>

            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
