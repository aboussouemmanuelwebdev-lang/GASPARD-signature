import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Clock, Phone, Mail, FileText, Check, ArrowRight, Star } from 'lucide-react';
import { Booking } from '../types';

interface BookingFormProps {
  onAddBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
}

export default function BookingForm({ onAddBooking }: BookingFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    date: '',
    time: '19:30',
    guestsCount: 2,
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastSubmittedReceipt, setLastSubmittedReceipt] = useState<Booking | null>(null);

  // Tomorrow's date is the default minimum date to reserve
  const minDate = useMemo(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  }, []);

  const timeOptions = [
    "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00",
    "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00", "00:30", "01:00", "01:30", "02:00"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.date) {
      alert("Veuillez remplir tous les champs obligatoires (Prénom, Nom, Téléphone, Date)");
      return;
    }

    setIsLoading(true);

    // Simulate luxury email and administration dispatch delay
    setTimeout(() => {
      const generatedBooking: Booking = {
        id: 'book-' + Math.random().toString(36).substr(2, 9),
        ...formData,
        status: 'confirmed', // Instantly confirm for testing but show premium receipt
        createdAt: new Date().toISOString()
      };

      onAddBooking(formData);
      setLastSubmittedReceipt(generatedBooking);
      setIsLoading(false);

      // Reset form variables
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        date: '',
        time: '19:30',
        guestsCount: 2,
        message: ''
      });
    }, 1500);
  };

  return (
    <section id="booking" className="py-24 bg-gradient-to-b from-black to-[#0A0A0A] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Text / Info Accent */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <span className="text-gold-400 font-mono text-xs uppercase tracking-[0.3em] mb-2 block">
              Tables Privées
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Réserver votre <br />
              <span className="text-gold-400">table mémorable</span>
            </h2>
            <p className="text-white/70 mb-8 leading-relaxed text-sm sm:text-base">
              Que ce soit pour un déjeuner d’affaires confidentiel, un dîner en amoureux ou une célébration familiale chaleureuse, notre équipe prépare votre table avec la plus grande considération.
            </p>

            {/* Quick Policies cards */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-left">
                <div className="p-2 bg-gold-400/5 rounded border border-gold-400/10 text-gold-400">
                  <Clock size={16} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-white">Politique de retard</h4>
                  <p className="text-white/40 text-xs mt-0.5">La table est réservée pendant 15 minutes au-delà de l'heure définie.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-left">
                <div className="p-2 bg-gold-400/5 rounded border border-gold-400/10 text-gold-400">
                  <Star size={16} />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-white">Événements de groupe (+10 pers.)</h4>
                  <p className="text-white/40 text-xs mt-0.5">Veuillez nous appeler directement au <strong className="text-gold-400">07 00 00 60 82</strong> pour personnaliser l'offre de menu traiteur.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Booking Interactive Container */}
          <div id="booking-container" className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!lastSubmittedReceipt ? (
                // Booking Form
                <motion.div
                  key="booking-form-div"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-[#121111] border border-white/5 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 h-40 w-40 bg-gold-500/5 rounded-full blur-3xl" />
                  
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-6">Formulaire de Réservation</h3>
                  
                  <form onSubmit={handleSubmit} id="actual-booking-form" className="space-y-5">
                    
                    {/* First & Last Name row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1.5 font-mono font-bold">Prénom *</label>
                        <input
                          type="text"
                          required
                          id="booking-firstname"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="Ex: Kouassi"
                          className="w-full bg-[#181717] border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1.5 font-mono font-bold">Nom de famille *</label>
                        <input
                          type="text"
                          required
                          id="booking-lastname"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Ex: Konan"
                          className="w-full bg-[#181717] border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400"
                        />
                      </div>
                    </div>

                    {/* Phone & Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1.5 font-mono font-bold">N° Téléphone *</label>
                        <div className="relative">
                          <input
                            type="tel"
                            required
                            id="booking-phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Ex: 07 00 00 60 82"
                            className="w-full bg-[#181717] border border-white/10 rounded pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400 font-mono"
                          />
                          <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                        </div>
                      </div>
                      <div className="relative">
                        <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1.5 font-mono font-bold">Adresse Email (Optionnelle)</label>
                        <div className="relative">
                          <input
                            type="email"
                            id="booking-email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Ex: k.konan@gmail.com"
                            className="w-full bg-[#181717] border border-white/10 rounded pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400"
                          />
                          <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                        </div>
                      </div>
                    </div>

                    {/* Date, Time & Guest Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="relative">
                        <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1.5 font-mono font-bold">Date *</label>
                        <div className="relative">
                          <input
                            type="date"
                            required
                            id="booking-date"
                            min={minDate}
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full bg-[#181717] border border-white/10 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1.5 font-mono font-bold">Heure *</label>
                        <select
                          id="booking-time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="w-full bg-[#181717] border border-white/10 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold-400 font-mono"
                        >
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1.5 font-mono font-bold">Convives *</label>
                        <div className="flex items-center justify-between bg-[#181717] border border-white/10 rounded py-1 px-2">
                          <button
                            type="button"
                            id="booking-guest-dec"
                            onClick={() => setFormData((prev) => ({ ...prev, guestsCount: Math.max(1, prev.guestsCount - 1) }))}
                            className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 rounded cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-mono text-white text-sm font-semibold">{formData.guestsCount}</span>
                          <button
                            type="button"
                            id="booking-guest-inc"
                            onClick={() => setFormData((prev) => ({ ...prev, guestsCount: Math.min(10, prev.guestsCount + 1) }))}
                            className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 rounded cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Personal message request */}
                    <div className="relative">
                      <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1.5 font-mono font-bold">Remarques ou Besoins spéciaux (allergies, etc.)</label>
                      <div className="relative">
                        <textarea
                          id="booking-message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Notez ici toute demande de placement de table ou restriction alimentaire..."
                          rows={3}
                          className="w-full bg-[#181717] border border-white/10 rounded p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-gold-400"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      id="booking-submit-btn"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:from-gold-700 hover:to-gold-500 text-black font-semibold uppercase tracking-widest text-xs py-4 rounded shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin border-2 border-black border-t-transparent rounded-full h-4 w-4" />
                          <span>Validation en cours...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirmer la réservation</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>

                  </form>
                </motion.div>
              ) : (
                // Success Premium Receipt
                <motion.div
                  key="booking-success-div"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#121111] border border-gold-400/25 rounded-2xl p-6 sm:p-10 shadow-3xl text-center relative overflow-hidden"
                >
                  <div className="w-16 h-16 bg-gold-400/20 border border-gold-400/25 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="text-gold-400 h-8 w-8 animate-bounce" />
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-white mb-2">Excellente Nouvelle !</h3>
                  <p className="text-gold-300 font-mono text-xs uppercase tracking-widest mb-6">
                    Votre table de prestige est attribuée d'avance
                  </p>
                  
                  {/* Detailed receipt card */}
                  <div className="bg-[#181717] rounded-xl p-5 border border-white/5 text-left space-y-3.5 max-w-sm mx-auto mb-8 font-mono text-[11px] sm:text-xs">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/40">ID Réservation</span>
                      <span className="text-white font-semibold text-gold-400">{lastSubmittedReceipt.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Réservé par</span>
                      <span className="text-white font-semibold">{lastSubmittedReceipt.firstName} {lastSubmittedReceipt.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Date</span>
                      <span className="text-white font-semibold">{lastSubmittedReceipt.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Heure de table</span>
                      <span className="text-white font-semibold">{lastSubmittedReceipt.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Nombre de places</span>
                      <span className="text-white font-semibold">{lastSubmittedReceipt.guestsCount} {lastSubmittedReceipt.guestsCount > 1 ? 'Personnes' : 'Personne'}</span>
                    </div>
                    {lastSubmittedReceipt.email && (
                      <div className="flex justify-between">
                        <span className="text-white/40">Notification email</span>
                        <span className="text-white font-semibold text-[10px] break-all">{lastSubmittedReceipt.email}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-white/5 pt-2">
                      <span className="text-white/40">N° Mobile enregistré</span>
                      <span className="text-gold-300 font-semibold">{lastSubmittedReceipt.phone}</span>
                    </div>
                  </div>

                  <p className="text-white/60 text-xs sm:text-sm max-w-md mx-auto mb-8 leading-relaxed">
                    Un email contenant vos détails a été automatiquement adressé. Pour toute modification ultérieure, notre conciergerie est accessible directement via WhatsApp.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      id="receipt-return-btn"
                      onClick={() => setLastSubmittedReceipt(null)}
                      className="bg-[#181717] hover:bg-[#222] text-white border border-white/20 hover:border-gold-400 font-semibold uppercase tracking-widest text-[10px] px-6 py-3.5 rounded cursor-pointer text-center"
                    >
                      Nouvelle réservation
                    </button>
                    <a
                      id="receipt-whatsapp-link"
                      href={`https://wa.me/2250700006082?text=Bonjour,%20je%20viens%20de%20réserver%20une%20table%20avec%20le%20code%20${lastSubmittedReceipt.id}`}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold uppercase tracking-widest text-[10px] px-6 py-3.5 rounded flex items-center justify-center space-x-1"
                    >
                      <span>Nous écrire via WhatsApp</span>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
