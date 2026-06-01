import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send, Check, ShieldAlert, Award } from 'lucide-react';
import { ContactMessage, RestaurantConfig } from '../types';

interface ContactSectionProps {
  onAddMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => void;
  config?: RestaurantConfig | null;
}

export default function ContactSection({ onAddMessage, config }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Réservation de banquet',
    message: ''
  });

  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Simple, elegant premium mathematical anti-spam captcha
  const safetyQuestion = "Pour valider, combien font 4 + 3 ? *";

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Veuillez remplir les informations obligatoires (Nom, Email, Message)");
      return;
    }

    if (captchaAnswer.trim() !== '7') {
      alert("La réponse au calcul de sécurité de validation anti-spam est erronée.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      onAddMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      });

      setIsLoading(false);
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Réservation de banquet',
        message: ''
      });
      setCaptchaAnswer('');

      // Auto-hide success check after 4 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 4000);
    }, 1200);
  };

  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15886.721464761405!2d-3.978255963281222!3d5.405719530467772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf94f1c7d24ab9%3A0xe5a3f33cc86dd549!2sAngr%C3%A9%208%C3%A8me%20Tranche%2C%20Abidjan!5e0!3m2!1sfr!2sci!4v1717070000000!5m2!1sfr!2sci";
  const externalMapDirectionsUrl = "https://www.google.com/maps/dir/?api=1&destination=Angre+8eme+Tranche+Cocody+Abidjan+Cote+d'Ivoire";

  return (
    <section id="contact" className="py-24 bg-[#0A0A0A] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold-400 font-mono text-xs uppercase tracking-[0.3em] mb-2 block">
            Nous Contacter
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            Horaires & Écoute
          </h2>
          <p className="text-white/60 text-sm sm:text-base">
            Notre conciergerie et notre direction se tiennent à votre entière disposition pour répondre à toutes vos demandes d'informations, de privatisation ou de partenariats.
          </p>
        </div>

        {/* Info & Map/Form Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
          
          {/* Left Side: Details & Google Map Embed */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            
            {/* Contact details blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#121111] p-6 rounded-xl border border-white/5">
              <div className="flex items-start space-x-3">
                <MapPin className="text-gold-400 mt-1 flex-shrink-0" size={18} />
                <div>
                  <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Adresse</h4>
                  <p className="text-white/60 text-xs sm:text-sm mt-1 leading-relaxed">
                    Angré 8ème Tranche, en face de la pharmacie de la 8ème Tranche, <br />
                    Cocody, Abidjan
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="text-gold-400 mt-1 flex-shrink-0" size={18} />
                <div>
                  <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Téléphones</h4>
                  <p className="text-white/60 text-xs sm:text-sm mt-1 font-mono">
                    <a href="tel:+2250700006082" className="hover:text-gold-400 font-semibold text-white transition-colors">07 00 00 60 82</a>
                  </p>
                  <p className="text-white/40 text-[10px] uppercase font-mono mt-0.5">Appel ou Chat WhatsApp</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 border-t border-white/5 pt-4 sm:pt-0 sm:border-t-0">
                <Mail className="text-gold-400 mt-1 flex-shrink-0" size={18} />
                <div>
                  <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Email</h4>
                  <p className="text-white/60 text-xs sm:text-sm mt-1 break-all">
                    <a href={`mailto:${config?.email || "hassanfissai1988@gmail.com"}`} className="hover:text-gold-400 font-mono transition-colors">
                      {config?.email || "hassanfissai1988@gmail.com"}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 border-t border-white/5 pt-4 sm:pt-0 sm:border-t-0">
                <Clock className="text-gold-400 mt-1 flex-shrink-0" size={18} />
                <div>
                  <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Horaires</h4>
                  <div className="text-white/60 text-xs mt-1 leading-snug font-mono space-y-0.5">
                    {config?.openingHours?.map((hour, idx) => (
                      <div key={`contact-hour-${hour.day}-${idx}`} className="flex justify-between gap-4">
                        <span className="text-white/40">{hour.day}</span>
                        <span className="text-gold-400 font-semibold">{hour.hours}</span>
                      </div>
                    )) || (
                      <div className="flex justify-between gap-4">
                        <span className="text-white/40">Lundi - Dimanche</span>
                        <span className="text-gold-400 font-semibold">08:00 - 03:00</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map Box */}
            <div id="google-maps" className="bg-[#121111] p-4 rounded-xl border border-white/5 flex flex-col space-y-3 h-80">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white/50">Angré 8ème Tranche, Cocody</span>
                <a
                  id="btn-itinerary-one-click"
                  href={externalMapDirectionsUrl}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="text-gold-400 hover:text-gold-300 font-bold underline flex items-center space-x-1"
                >
                  <span>Itinéraire en 1 clic</span>
                </a>
              </div>
              
              {/* Actual Map iframe using Google Embedded Service */}
              <div className="w-full flex-grow rounded-lg overflow-hidden relative border border-white/10">
                <iframe
                  title="Localisation Gaspard Signature"
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale invert opacity-80"
                />
              </div>
            </div>

          </div>

          {/* Right Side: Professional Contact Form */}
          <div className="lg:col-span-6">
            <div className="bg-[#121111] border border-white/5 rounded-2xl p-6 sm:p-10 shadow-2xl">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2">Écrivez-nous</h3>
              <p className="text-white/40 text-xs sm:text-sm mb-6">Recevez un retour de notre service clientèle sous 12 heures.</p>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                
                {/* Full name input */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono font-bold">Nom Complet *</label>
                  <input
                    type="text"
                    required
                    id="contact-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Emmanuel Aboussou"
                    className="w-full bg-[#181717] border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400 transition-all"
                  />
                </div>

                {/* Email and Phone grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono font-bold">Adresse Email *</label>
                    <input
                      type="email"
                      required
                      id="contact-email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Ex: emmanuel@gmail.com"
                      className="w-full bg-[#181717] border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono font-bold">Numéro de téléphone</label>
                    <input
                      type="tel"
                      id="contact-phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Ex: 07 00 00 60 82"
                      className="w-full bg-[#181717] border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Subject Selector */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono font-bold">Sujet du Message</label>
                  <select
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#181717] border border-white/10 rounded px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-gold-400"
                  >
                    <option value="Réservation de banquet">Réservation de banquet / Groupe (+10 pers.)</option>
                    <option value="Privatisation totale">Privatisation totale du restaurant</option>
                    <option value="Recrutement cuisine">Candidature / Recrutement de personnel</option>
                    <option value="Partenariat fournisseurs">Partenariat et approvisionnement</option>
                    <option value="Autre demande">Autre demande générale</option>
                  </select>
                </div>

                {/* Narrative Message */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1 font-mono font-bold">Votre Message *</label>
                  <textarea
                    required
                    id="contact-message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Écrivez-nous en détail et mentionnez toutes vos exigences pratiques..."
                    rows={4}
                    className="w-full bg-[#181717] border border-white/10 rounded p-4 text-xs sm:text-sm text-white focus:outline-none focus:border-gold-400 transition-all"
                  />
                </div>

                {/* Premium security anti-spam input */}
                <div className="p-4 bg-amber-500/5 rounded border border-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-2.5">
                    <ShieldAlert size={16} className="text-amber-500 flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs text-white/70">{safetyQuestion}</span>
                  </div>
                  <input
                    type="text"
                    required
                    id="contact-captcha"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    placeholder="Résultat"
                    className="w-20 bg-[#181717] border border-white/10 focus:border-gold-400 rounded py-1.5 px-3 text-sm text-center font-mono text-white focus:outline-none"
                  />
                </div>

                {/* Submission CTA overlay feedback */}
                <button
                  type="submit"
                  id="contact-submit-btn"
                  disabled={isLoading || isSuccess}
                  className="w-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:from-gold-700 hover:to-gold-500 text-black font-semibold uppercase tracking-widest text-xs py-4 rounded shadow-md cursor-pointer flex items-center justify-center space-x-2 transition-all"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin border-2 border-black border-t-transparent rounded-full h-4 w-4" />
                      <span>Transmission en cours...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <Check size={14} />
                      <span>Message envoyé avec succès!</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Envoyer le Message</span>
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
