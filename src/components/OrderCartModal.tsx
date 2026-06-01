import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ShoppingBag, Trash2, Truck, Store, MapPin, Clock, 
  CreditCard, Phone, Mail, User, ShieldCheck, ArrowRight, 
  CheckCircle, Loader, DollarSign, Smartphone
} from 'lucide-react';
import { CustomizedCartItem, Order } from '../types';

interface OrderCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CustomizedCartItem[];
  onRemoveFromCart: (cartId: string) => void;
  onUpdateQuantity: (cartId: string, quantity: number) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
}

const DISTRICTS_ABIDJAN = [
  { name: "Angré (Cocody)", fee: 1000 },
  { name: "Deux Plateau (Cocody)", fee: 1500 },
  { name: "Riviera 1, 2, 3, 4 (Cocody)", fee: 1500 },
  { name: "Marcory / Zone 4", fee: 2500 },
  { name: "Plateau", fee: 2000 },
  { name: "Treichville", fee: 2500 },
  { name: "Biétry", fee: 3000 },
  { name: "Yopougon", fee: 3000 },
  { name: "Bingerville", fee: 2500 }
];

export default function OrderCartModal({
  isOpen,
  onClose,
  cartItems,
  onRemoveFromCart,
  onUpdateQuantity,
  onClearCart,
  onPlaceOrder
}: OrderCartModalProps) {
  // Stage handling inside modal: 'cart', 'checkout', 'payment_simulation', 'success'
  const [stage, setStage] = useState<'cart' | 'checkout' | 'payment' | 'success'>('cart');

  // Customer checkout inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState<'pickup' | 'delivery'>('delivery');
  
  // Service configuration
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDistrict, setDeliveryDistrict] = useState(DISTRICTS_ABIDJAN[0].name);
  const [pickupTime, setPickupTime] = useState('13:00');

  // Payment details
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'momo_simulated'>('momo_simulated');
  const [momoOperator, setMomoOperator] = useState<'wave' | 'orange' | 'mtn'>('wave');
  const [momoPhone, setMomoPhone] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Success receipts references
  const [createdOrderId, setCreatedOrderId] = useState('');

  if (!isOpen) return null;

  // Calcul totals
  const subtotal = cartItems.reduce((acc, curr) => {
    const itemPrice = (curr.item as any).isPromotion && (curr.item as any).promotionPrice ? (curr.item as any).promotionPrice : curr.item.price;
    const extraPrice = curr.options?.extraCheese ? 1500 : 0;
    return acc + (itemPrice + extraPrice) * curr.quantity;
  }, 0);

  const selectedDist = DISTRICTS_ABIDJAN.find(d => d.name === deliveryDistrict);
  const deliveryFee = serviceType === 'delivery' ? (selectedDist?.fee || 1500) : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleNextToCheckout = () => {
    if (cartItems.length === 0) return;
    setStage('checkout');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone) {
      alert("Veuillez renseigner les champs obligatoires (Prénom, Nom et Téléphone).");
      return;
    }

    if (serviceType === 'delivery' && !deliveryAddress) {
      alert("Veuillez spécifier votre adresse précise pour la livraison à Abidjan.");
      return;
    }

    if (paymentMethod === 'cash') {
      // Cash on delivery doesn't require simulation, proceed to place order directly
      submitOrder();
    } else {
      // Proceed to Mobile Money simulation screen
      setMomoPhone(phone);
      setStage('payment');
    }
  };

  const startMomoPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!momoPhone) {
      alert("Renseignez un numéro Mobile Money.");
      return;
    }

    setIsPaying(true);

    // Simulate OTP / Validation triggering
    setTimeout(() => {
      setOtpSent(true);
      setIsPaying(false);
    }, 1500);
  };

  const verifyOtpAndDone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      alert("Code incorrect.");
      return;
    }

    setIsPaying(true);

    // Finalize payment loader
    setTimeout(() => {
      setIsPaying(false);
      submitOrder();
    }, 2000);
  };

  const submitOrder = () => {
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    setCreatedOrderId(orderId);

    const formattedItems = cartItems.map(c => {
      const price = (c.item as any).isPromotion && (c.item as any).promotionPrice ? (c.item as any).promotionPrice : c.item.price;
      const opts: string[] = [];
      if (c.options.spiceLevel) opts.push(`Spice: ${c.options.spiceLevel}`);
      if (c.options.cookingDegree) opts.push(`Cuisson: ${c.options.cookingDegree}`);
      if (c.options.extraCheese) opts.push(`Extra Fromage (+1,500 F)`);
      if (c.options.choppedOnions === false) opts.push(`Sans Oignon`);
      
      return {
        itemId: c.item.id,
        name: c.item.name,
        price: price + (c.options.extraCheese ? 1500 : 0),
        quantity: c.quantity,
        customInstructions: c.customInstructions,
        optionsSummary: opts.join(', ')
      };
    });

    onPlaceOrder({
      clientName: `${firstName} ${lastName}`,
      clientPhone: phone,
      clientEmail: email || undefined,
      serviceType,
      deliveryDistrict: serviceType === 'delivery' ? deliveryDistrict : undefined,
      deliveryAddress: serviceType === 'delivery' ? deliveryAddress : undefined,
      pickupTime: serviceType === 'pickup' ? pickupTime : undefined,
      paymentMethod,
      items: formattedItems,
      subtotal,
      deliveryFee,
      totalPrice: grandTotal
    });

    // Move to success receipt
    onClearCart();
    setStage('success');
  };

  const handleFinish = () => {
    onClose();
    setStage('cart');
    // Clear forms
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setDeliveryAddress('');
    setOtpSent(false);
    setOtpCode('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-gold-400/20 rounded-2xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden relative shadow-2xl">
        
        {/* Top Header of the Cart Modal */}
        <div className="bg-[#181818] border-b border-white/5 py-4 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShoppingBag className="text-gold-400" size={20} />
            <h2 className="font-serif text-base sm:text-lg font-bold text-white uppercase tracking-wider">
              {stage === 'cart' && "Votre Panier Gourmet"}
              {stage === 'checkout' && "Passation de la Commande"}
              {stage === 'payment' && "Sécurisation Mobile Money (Simulé)"}
              {stage === 'success' && "Commande Confirmée !"}
            </h2>
          </div>
          
          <button
            onClick={stage === 'success' ? handleFinish : onClose}
            className="text-white/40 hover:text-white p-1 hover:bg-white/5 rounded cursor-pointer transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dynamic Inner layouts depending on Stage */}
        <div className="flex-grow overflow-y-auto p-6 sm:p-8">
          
          {/* STAGE 1: CART OVERVIEW */}
          {stage === 'cart' && (
            <div className="h-full flex flex-col justify-between">
              {cartItems.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4 py-8">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white/30">
                    <ShoppingBag size={28} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">Votre panier est encore vide</h3>
                  <p className="text-white/40 text-xs sm:text-sm max-w-xs leading-relaxed">
                    Parcourez notre carte d'exception pour dénicher des grillades feu de bois, nos pizzas dorées, ou nos suggestions du jour et confectionnez votre commande.
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-gold-500 text-black font-semibold text-xs uppercase tracking-wider py-2.5 px-5 rounded-full hover:bg-gold-400 cursor-pointer shadow-md"
                  >
                    Découvrir la carte
                  </button>
                </div>
              ) : (
                <div className="space-y-6 flex flex-col h-full justify-between">
                  {/* Cart list items */}
                  <div className="space-y-4 overflow-y-auto max-h-[45vh] pr-1 scrollbar-none">
                    {cartItems.map((cartItem) => {
                      const itemPrice = (cartItem.item as any).isPromotion && (cartItem.item as any).promotionPrice ? (cartItem.item as any).promotionPrice : cartItem.item.price;
                      const extraCharge = cartItem.options?.extraCheese ? 1500 : 0;
                      const unitTotal = itemPrice + extraCharge;

                      return (
                        <div
                          key={cartItem.cartId}
                          className="bg-[#181818] p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center space-x-3.5">
                            <img src={cartItem.item.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-white/5 flex-shrink-0" />
                            <div>
                              <h4 className="font-serif font-bold text-white text-sm">{cartItem.item.name}</h4>
                              
                              {/* Custom summary inline badges */}
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {cartItem.options.spiceLevel && (
                                  <span className="text-[9px] font-mono bg-white/5 text-white/60 py-0.5 px-2 rounded">
                                    Piment: {cartItem.options.spiceLevel}
                                  </span>
                                )}
                                {cartItem.options.cookingDegree && (
                                  <span className="text-[9px] font-mono bg-white/5 text-white/60 py-0.5 px-2 rounded">
                                    Cuisson: {cartItem.options.cookingDegree}
                                  </span>
                                )}
                                {cartItem.options.extraCheese && (
                                  <span className="text-[9px] font-mono bg-gold-400/10 text-gold-400 py-0.5 px-2 rounded border border-gold-400/10">
                                    Supplément Fromage (+1,500 F)
                                  </span>
                                )}
                                {cartItem.options.choppedOnions === false && (
                                  <span className="text-[9px] font-mono bg-red-500/10 text-red-400 py-0.5 px-2 rounded">
                                    Sans Oignons
                                  </span>
                                )}
                              </div>
                              
                              {cartItem.customInstructions && (
                                <p className="text-[11px] text-white/50 italic mt-1.5 leading-relaxed bg-black/20 p-1.5 rounded border border-white/5">
                                  &ldquo;{cartItem.customInstructions}&rdquo;
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex sm:flex-row items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                            {/* Quantity buttons */}
                            <div className="flex items-center space-x-3 bg-black/40 border border-white/5 rounded-lg p-1.5">
                              <button
                                onClick={() => onUpdateQuantity(cartItem.cartId, Math.max(1, cartItem.quantity - 1))}
                                className="text-white/40 hover:text-gold-400 font-bold px-1 text-xs"
                              >
                                -
                              </button>
                              <span className="text-white font-mono text-xs font-bold w-5 text-center">
                                {cartItem.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(cartItem.cartId, cartItem.quantity + 1)}
                                className="text-white/40 hover:text-gold-400 font-bold px-1 text-xs"
                              >
                                +
                              </button>
                            </div>

                            <div className="flex items-center space-x-4">
                              <span className="font-mono text-xs sm:text-sm font-semibold text-gold-300 w-24 text-right">
                                {(unitTotal * cartItem.quantity).toLocaleString()} F
                              </span>
                              <button
                                onClick={() => onRemoveFromCart(cartItem.cartId)}
                                className="text-red-400/60 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                                title="Enlever du panier"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary Pricing and Button to proceed */}
                  <div className="border-t border-white/5 pt-6 space-y-4">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-white/70">
                      <span>Sous-total de la carte :</span>
                      <strong className="text-white font-semibold text-sm sm:text-base">{subtotal.toLocaleString()} FCFA</strong>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={onClearCart}
                        className="bg-red-950/20 hover:bg-red-950/40 border border-red-500/10 text-red-400 hover:text-red-300 font-semibold px-4 py-3 rounded text-xs uppercase tracking-wider cursor-pointer"
                      >
                        Vider le panier
                      </button>
                      <button
                        id="btn-goto-checkout"
                        onClick={handleNextToCheckout}
                        className="flex-grow bg-gradient-to-r from-gold-600 to-gold-400 text-black font-semibold text-xs uppercase tracking-widest py-3 rounded hover:scale-[1.01] transition-all flex items-center justify-center space-x-2 cursor-pointer shadow"
                      >
                        <span>Valider et choisir livraison/retrait</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STAGE 2: CHECKOUT CONTACT & METADATA DETAILS */}
          {stage === 'checkout' && (
            <form onSubmit={handleCheckoutSubmit} className="space-y-6">
              
              {/* Service choice Pick vs Delivery */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  id="choice-service-delivery"
                  onClick={() => setServiceType('delivery')}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center space-y-2 cursor-pointer transition-all ${
                    serviceType === 'delivery'
                      ? 'bg-gold-500/10 border-gold-500 text-gold-400'
                      : 'bg-[#181818] border-white/5 text-white/50 hover:text-white'
                  }`}
                >
                  <Truck size={22} />
                  <span className="font-serif text-sm font-bold uppercase tracking-wider">Livraison à Abidjan</span>
                  <span className="text-[10px] font-mono text-white/40">Chez vous en 30-50 min</span>
                </button>

                <button
                  type="button"
                  id="choice-service-pickup"
                  onClick={() => setServiceType('pickup')}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center space-y-2 cursor-pointer transition-all ${
                    serviceType === 'pickup'
                      ? 'bg-gold-500/10 border-gold-500 text-gold-400'
                      : 'bg-[#181818] border-white/5 text-white/50 hover:text-white'
                  }`}
                >
                  <Store size={22} />
                  <span className="font-serif text-sm font-bold uppercase tracking-wider">Retrait sur Place</span>
                  <span className="text-[10px] font-mono text-white/40">Angré 8ème tranche, Gratuit</span>
                </button>
              </div>

              {/* Customer Base Coordinates */}
              <div className="bg-[#181818] p-5 rounded-xl border border-white/5 space-y-4">
                <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <User size={15} className="text-gold-400" />
                  <span>Vos informations de contact</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-mono text-white/50">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                      placeholder="Jean"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-mono text-white/50">Nom de famille *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                      placeholder="Brou"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-mono text-white/50">Téléphone de contact *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white font-mono"
                      placeholder="07 00 00 60 82"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase font-mono text-white/50">Courriel (Email optionnel)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                      placeholder="client@gaspard-signature.ci"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery specific district & address or Pickup time */}
              {serviceType === 'delivery' ? (
                <div className="bg-[#181818] p-5 rounded-xl border border-white/5 space-y-4">
                  <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                    <MapPin size={15} className="text-gold-400" />
                    <span>Adresse de Livraison (Abidjan, CI)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-mono text-white/50">Commune / Quartier de livraison *</label>
                      <select
                        value={deliveryDistrict}
                        onChange={(e) => setDeliveryDistrict(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                      >
                        {DISTRICTS_ABIDJAN.map(dist => (
                          <option key={dist.name} value={dist.name}>
                            {dist.name} – {dist.fee.toLocaleString()} FCFA
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-mono text-white/50">Adresse complète & indications précises *</label>
                      <input
                        type="text"
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                        placeholder="Ex: Riviera 3, Cité EEC, villa 4, face à l'école..."
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#181818] p-5 rounded-xl border border-white/5 space-y-4">
                  <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                    <Clock size={15} className="text-gold-400" />
                    <span>Créneau de retrait sur place</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-mono text-white/50">Précisez l'heure de retrait souhaitée *</label>
                      <input
                        type="time"
                        required
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white font-mono w-full"
                      />
                    </div>

                    <p className="text-[11px] text-white/40 leading-relaxed pl-2">
                      Nos fourneaux préparent votre repas chaud pour l'heure indiquée. Retrait au : <strong>Angré 8ème Tranche, Abidjan</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* Payment selection controls */}
              <div className="bg-[#181818] p-5 rounded-xl border border-white/5 space-y-4">
                <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <CreditCard size={15} className="text-gold-400" />
                  <span>Mode de Règlement</span>
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('momo_simulated')}
                    className={`p-3 rounded-lg border flex items-center justify-center space-x-2 text-xs font-mono font-bold uppercase cursor-pointer transition-colors ${
                      paymentMethod === 'momo_simulated'
                        ? 'bg-gold-500/10 border-gold-500 text-gold-400'
                        : 'bg-black/30 border-white/5 text-white/50'
                    }`}
                  >
                    <Smartphone size={14} />
                    <span>Mobile Money (Wave / MoMo)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-lg border flex items-center justify-center space-x-2 text-xs font-mono font-bold uppercase cursor-pointer transition-colors ${
                      paymentMethod === 'cash'
                        ? 'bg-gold-500/10 border-gold-500 text-gold-400'
                        : 'bg-black/30 border-white/5 text-white/50'
                    }`}
                  >
                    <DollarSign size={14} />
                    <span>Épices / Cash sur place</span>
                  </button>
                </div>
              </div>

              {/* Recap Box totals and submission */}
              <div className="bg-black/40 p-5 rounded-xl border border-white/5 space-y-3.5 font-mono text-xs text-white/80">
                <div className="flex justify-between">
                  <span>Panier :</span>
                  <span>{subtotal.toLocaleString()} FCFA</span>
                </div>
                {serviceType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Frais de livraison ({deliveryDistrict}) :</span>
                    <span>{deliveryFee.toLocaleString()} FCFA</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-white/5 pt-3 text-sm text-gold-400 font-bold">
                  <span>Montant Total à payer :</span>
                  <span>{grandTotal.toLocaleString()} FCFA</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStage('cart')}
                  className="bg-[#242424] hover:bg-[#333] text-white font-semibold text-xs uppercase py-3 px-5 rounded-lg cursor-pointer"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  id="checkout-confirm-btn"
                  className="flex-grow bg-gradient-to-r from-gold-600 to-gold-400 text-black font-semibold uppercase tracking-wider text-xs py-3 rounded-lg hover:scale-[1.01] transition-all cursor-pointer text-center"
                >
                  {paymentMethod === 'momo_simulated' ? "Continuer vers la transaction (simulée)" : `Confirmer Commande Cash de ${grandTotal.toLocaleString()} F`}
                </button>
              </div>

            </form>
          )}

          {/* STAGE 3: ACTIVE MOBILE MONEY TRANSACTION SIMULATION */}
          {stage === 'payment' && (
            <div className="max-w-md mx-auto space-y-8 py-4">
              <div className="text-center space-y-2">
                <span className="text-gold-400 font-mono text-[10px] uppercase tracking-widest block">Simulation Transactionnelle</span>
                <h3 className="font-serif text-lg font-bold text-white">Passerelle de Paiement Abidjan</h3>
                <p className="text-white/50 text-xs leading-relaxed">
                  Cette simulation imite en conditions réelles les terminaux ivoiriens de paiements mobiles pour faciliter l'architecture de démonstration d'achats de Gaspard Signature.
                </p>
              </div>

              {/* Step A: Input number and choose operator */}
              {!otpSent ? (
                <form onSubmit={startMomoPayment} className="space-y-6">
                  
                  {/* Select Operator with proper colors */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setMomoOperator('wave')}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center font-mono font-black text-xs cursor-pointer transition-all ${
                        momoOperator === 'wave'
                          ? 'bg-sky-500/10 border-sky-500 text-sky-400 scale-[1.02]'
                          : 'bg-[#181818] border-white/5 text-white/40'
                      }`}
                    >
                      <span className="text-base font-serif font-black tracking-normal block mb-1">Wave</span>
                      <span className="text-[9px] font-normal uppercase">Côte d'Ivoire</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMomoOperator('orange')}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center font-mono font-black text-xs cursor-pointer transition-all ${
                        momoOperator === 'orange'
                          ? 'bg-orange-500/10 border-orange-500 text-orange-400 scale-[1.02]'
                          : 'bg-[#181818] border-white/5 text-white/40'
                      }`}
                    >
                      <span className="text-base font-serif font-black tracking-normal block mb-1">Orange</span>
                      <span className="text-[9px] font-normal uppercase">Orange Money</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMomoOperator('mtn')}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center font-mono font-black text-xs cursor-pointer transition-all ${
                        momoOperator === 'mtn'
                          ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400 scale-[1.02]'
                          : 'bg-[#181818] border-white/5 text-white/40'
                      }`}
                    >
                      <span className="text-base font-serif font-black tracking-normal block mb-1">MTN</span>
                      <span className="text-[9px] font-normal uppercase">MoMo</span>
                    </button>
                  </div>

                  <div className="bg-[#181818] p-5 rounded-xl border border-white/5 space-y-4">
                    <label className="block text-center text-[10px] uppercase font-mono text-white/40">
                      Entrez le numéro lié au compte de prélèvement
                    </label>
                    
                    <div className="flex shadow-md rounded overflow-hidden">
                      <span className="bg-[#121212] border border-r-0 border-white/10 text-white/40 font-mono text-xs flex items-center px-3">
                        +225
                      </span>
                      <input
                        type="tel"
                        required
                        value={momoPhone}
                        onChange={(e) => setMomoPhone(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 rounded-r py-3 px-3.5 text-sm text-white font-mono text-center focus:outline-none"
                      />
                    </div>

                    <div className="text-center pt-2">
                      <span className="text-gold-400 font-mono text-xs font-bold block">
                        Débit total : {grandTotal.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPaying}
                    className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-black font-semibold uppercase tracking-wider text-xs py-3.5 rounded-lg flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-50"
                  >
                    {isPaying ? (
                      <>
                        <Loader size={14} className="animate-spin text-black" />
                        <span>Initiation de la demande...</span>
                      </>
                    ) : (
                      <span>Initier le paiement sécurisé</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStage('checkout')}
                    className="w-full text-center text-xs text-white/40 hover:text-white underline font-mono"
                  >
                    S'inscrire sous une autre modalité
                  </button>

                </form>
              ) : (
                
                /* Step B: Simulated verification of OTP or code confirmation */
                <form onSubmit={verifyOtpAndDone} className="space-y-6">
                  
                  <div className="bg-[#181818] p-5 rounded-xl border border-white/5 text-center space-y-4">
                    <span className="text-emerald-500 font-mono text-xs block">✔ SMS de confirmation envoyé !</span>
                    <p className="text-white/60 text-xs leading-relaxed px-4">
                      Nous avons simulé l'envoi d'un code OTP sur votre numéro <strong>+225 {momoPhone}</strong>. Veuillez saisir un code à 4 chiffres (ex: 2026) pour finaliser l'achat du repas.
                    </p>

                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Saisissez le code (ex: 2026)"
                      className="w-44 bg-black/60 border border-white/10 rounded py-2 px-3 text-sm text-center font-mono text-white tracking-[0.4em] font-black focus:outline-none focus:border-emerald-500 text-center mx-auto block"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPaying}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold uppercase tracking-wider text-xs py-3.5 rounded-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {isPaying ? (
                      <>
                        <Loader size={14} className="animate-spin text-white animate-pulse" />
                        <span>Vérification de la provision...</span>
                      </>
                    ) : (
                      <span>Valider la transaction & finaliser</span>
                    )}
                  </button>

                  <p className="text-[10px] text-white/20 text-center uppercase tracking-widest font-mono">
                    Simulation de sandbox sécurisée de Gaspard Signature
                  </p>
                </form>
              )}

            </div>
          )}

          {/* STAGE 4: SUCCESS RECEIPT */}
          {stage === 'success' && (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-4 max-w-md mx-auto space-y-6">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                <CheckCircle size={32} />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">Akwaba ! Votre commande est reçue</h3>
                <span className="font-mono text-sm text-gold-400 bg-gold-400/5 px-2.5 py-1 rounded border border-gold-400/10 inline-block font-bold mt-1">
                  Référence : {createdOrderId}
                </span>
                <p className="text-white/60 text-xs sm:text-sm leading-relaxed pt-2">
                  Notre équipe de conciergerie à Angré a reçu votre commande et procède dès à présent à sa préparation thermique au feu de bois. 
                </p>
              </div>

              {/* Informative advice */}
              <div className="w-full bg-white/5 p-4 rounded-xl border border-white/5 text-left text-xs space-y-2 leading-relaxed">
                <p className="text-white/80 font-serif font-bold flex items-center space-x-1.5 border-b border-white/5 pb-1.5 uppercase text-[10px]">
                  <ShieldCheck size={12} className="text-emerald-400" />
                  <span>Suivi de commande</span>
                </p>
                <div>
                  • Mode choisi : <strong>{serviceType === 'pickup' ? 'Retrait sur Place' : 'Livraison à Domicile'}</strong>
                </div>
                {serviceType === 'delivery' ? (
                  <div>• Quartier : <strong>{deliveryDistrict}</strong> — {deliveryAddress}</div>
                ) : (
                  <div>• Heure de rendez-vous : <strong>{pickupTime}</strong></div>
                )}
                <div>
                  • Paiement : <strong>{paymentMethod === 'cash' ? "Espèces / Mobile Money à réception" : "Confirmé via transaction Mobile Money (Simulée)"}</strong>
                </div>
                <div className="italic text-white/50 text-[11px] pt-1.5">
                  Conservez précieusement votre référence. Un conseiller client de Gaspard Signature est susceptible de vous joindre par téléphone au <strong>{phone}</strong> pour l'acheminement final.
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-black font-semibold uppercase tracking-wider text-xs py-3 rounded cursor-pointer transition-all font-sans hover:from-gold-700"
              >
                Fermer et continuer
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
