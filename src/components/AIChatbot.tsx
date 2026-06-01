import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, MapPin, Sparkles, Phone, Calendar, Users, Clock, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Booking, ContactMessage } from "../types";

interface AIChatbotProps {
  onAddBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  onAddMessage: (message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  isBookingReceipt?: boolean;
  bookingData?: any;
}

export default function AIChatbot({ onAddBooking, onAddMessage }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Bonjour et bienvenue chez **Gaspard Signature** ! 🥂\n\nJe suis votre **Concierge Virtuel personnel**. Je suis ici pour vous accompagner :\n\n📍 Vous indiquer la **localisation** de notre établissement à Cocody\n🔥 Vous faire découvrir nos **spécialités de prestige** (filets de bœuf grillés au feu de bois, pizzas haut de gamme)\n🗓️ Vous aider à **réserver une table mémorable** en quelques instants\n\nComment puis-je enrichir votre journée aujourd'hui ?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Handle quick suggestions
  const handleQuickSuggestion = (text: string, displayText?: string) => {
    handleSendMessage(displayText || text, text);
  };

  // Turn off notification once opened
  useEffect(() => {
    if (isOpen) {
      setShowNotification(false);
    }
  }, [isOpen]);

  // Analyzes the chat transaction and pushes leads / unanswered questions summaries to Admin Panel (Inbox)
  const processConversationAnalysis = (
    userText: string,
    botReply: string,
    isBookingCall: boolean,
    bookingDetails?: any
  ) => {
    if (!onAddMessage) return;

    const userLower = userText.toLowerCase();
    const botLower = botReply.toLowerCase();

    // 1. Check for UNANSWERED / EXCEPTION / REQUEST FOR HUMAN HELP
    const isRequestingHuman = userLower.includes("humain") || 
                              userLower.includes("responsable") || 
                              userLower.includes("gérant") || 
                              userLower.includes("directeur") || 
                              userLower.includes("gérance") ||
                              userLower.includes("vrai personne") ||
                              userLower.includes("personne physique");

    const fallbackTriggered = botReply.includes("Désolé, j'ai rencontré un petit contretemps") || 
                               botLower.includes("excuse") || 
                               botLower.includes("ne peux pas répondre") || 
                               botLower.includes("pas d'information") ||
                               botLower.includes("pas en mesure") ||
                               botLower.includes("je ne sais pas") ||
                               botLower.includes("hors de mes compétences") ||
                               botLower.includes("contacter notre directeur") ||
                               botReply.includes("Je m'excuse, je n'ai pas pu formuler ma réponse");

    if (isRequestingHuman || fallbackTriggered) {
      const formatUnresolvedSummary = `
[CONCIERGE AI - ALERTE ASSISTANCE MANUELLE REQUISE]

Statut : Question non-résolue ou appel à l'aide d'un responsable.
Type : Demande d'intervention humaine directe.

-- DERNIER MESSAGE DE L'UTILISATEUR --
"${userText}"

-- DERNIÈRE RÉPONSE DE L'ASSISTANT --
"${botReply}"

-- DIAGNOSTIC CONCIERGERIE --
L'utilisateur a posé une question pour laquelle l'IA n'a pas pu fournir une réponse complète / satisfaisante, ou a expressément formulé le besoin d'échanger avec le gérant du restaurant.

-- RECOMMANDATION POUR LE RESPONSABLE --
Veuillez contacter ce client par téléphone ou consulter ses messages récents pour de l'aide immédiate.
      `;

      onAddMessage({
        name: "Assistance Requise (Client en attente)",
        email: "concierge-alert@gaspardsignature.ci",
        phone: "Intervention Manuelle",
        subject: "⚠️ Alerte Message non-résolu (Concierge AI)",
        message: formatUnresolvedSummary.trim()
      });
      return; // Stop here to prevent generating a secondary lead email in the same turn
    }

    // 2. Check for lead/business opportunity (can bring customers)
    const isBookingRelated = isBookingCall || 
                              userLower.includes("réserv") || 
                              userLower.includes("booking") || 
                              userLower.includes("table") || 
                              userLower.includes("places") || 
                              userLower.includes("rdv") || 
                              userLower.includes("rendez-vous") || 
                              userLower.includes("venir");

    const isMenuRelated = userLower.includes("menu") || 
                          userLower.includes("carte") || 
                          userLower.includes("manger") || 
                          userLower.includes("spécialité") || 
                          userLower.includes("prix") || 
                          userLower.includes("coûte") || 
                          userLower.includes("tarif") || 
                          userLower.includes("grillade") || 
                          userLower.includes("pizza") || 
                          userLower.includes("vin");

    const isLocationRelated = userLower.includes("adresse") || 
                              userLower.includes("localisation") || 
                              userLower.includes("situé") || 
                              userLower.includes("où se trouve") || 
                              userLower.includes("comment s'y rendre") || 
                              userLower.includes("pharmacie");

    const isEventRelated = userLower.includes("privat") || 
                           userLower.includes("événement") || 
                           userLower.includes("anniversaire") || 
                           userLower.includes("mariage") || 
                           userLower.includes("groupe") || 
                           userLower.includes("traiteur");

    if (isBookingRelated || isMenuRelated || isLocationRelated || isEventRelated) {
      let focusCategory = "Intérêt Général / Visite";
      if (isBookingCall) focusCategory = "RÉSERVATION EFFECTUÉE (À VALIDER MANUELLEMENT)";
      else if (isBookingRelated) focusCategory = "Intention de Réservation / Rendez-vous";
      else if (isEventRelated) focusCategory = "Demande de Privatisation / Groupe / Traiteur";
      else if (isMenuRelated) focusCategory = "Consultation du Menu & Spécialités";
      else if (isLocationRelated) focusCategory = "Recherche d'Itinéraire / Adresse";

      let keyDetailsStr = "Intérêt pour la carte ou la visite.";
      if (isBookingCall && bookingDetails) {
        keyDetailsStr = `Réservation de table enregistrée :
• Client : ${bookingDetails.firstName} ${bookingDetails.lastName}
• Téléphone : ${bookingDetails.phone}
• Date & Heure : ${bookingDetails.date} à ${bookingDetails.time}
• Nombre de personnes : ${bookingDetails.guestsCount}
• Note spéciale : ${bookingDetails.message || 'Aucune'}`;
      } else {
        keyDetailsStr = `Le client s'intéresse à notre offre :
• Sujet présumé : ${focusCategory}
• Message client : "${userText}"
• Action conseillée : Préparez l'accueil ou offrez une relance si le client renseigne ses détails de contact dans le chat ou le formulaire.`;
      }

      const formatLeadSummary = `
[CONCIERGE AI - HISTORIQUE ET OPPORTUNITÉ CLIENT DÉTECTÉE]

Type d'Intérêt : ${focusCategory}
Statut : Opportunité commerciale à forte valeur ajoutée.

-- HISTORIQUE CONTEXTUEL EXTRAYABLE --
- Question : "${userText}"
- Réponse donnée : "${botReply.substring(0, 250)}..."

-- RÉSUMÉ POUR LA GÉRANCE --
${keyDetailsStr}

-- ACTION RECOMMANDÉE --
Veuillez valider manuellement l'enregistrement (si réservation de table ou commande) ou suivre le prospect dans les plus brefs délais pour maximiser la conversion.
      `;

      onAddMessage({
        name: isBookingCall && bookingDetails ? `${bookingDetails.firstName} ${bookingDetails.lastName}` : "Client Potentiel (AI Prospect)",
        email: isBookingCall && bookingDetails?.email ? bookingDetails.email : "visiteur-ia@gaspardsignature.ci",
        phone: isBookingCall && bookingDetails?.phone ? bookingDetails.phone : "Chat AI Direct",
        subject: isBookingCall ? "🗓️ Dépôt de Réservation par IA" : "💼 Opportunité Client (Concierge AI)",
        message: formatLeadSummary.trim()
      });
    }
  };

  const handleSendMessage = async (userText: string, apiText?: string) => {
    if (!userText.trim()) return;

    const textToSend = apiText || userText;

    // Add user message locally
    const updatedMessages = [...messages, { role: "user", content: userText } as Message];
    setMessages(updatedMessages);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Erreur de communication avec le serveur.");
      }

      const data = await response.json();
      setIsTyping(false);

      if (data.functionCall && data.functionCall.name === "bookTable") {
        // AI decided to book a table!
        const args = data.functionCall.args;
        
        // Ensure parsing types for guestsCount
        const guestsCountNum = parseInt(args.guestsCount) || 2;
        const formattedBooking = {
          firstName: args.firstName || "Client",
          lastName: args.lastName || "Gaspard",
          phone: args.phone || "0000000000",
          email: args.email || "",
          date: args.date || new Date().toISOString().split('T')[0],
          time: args.time || "19:30",
          guestsCount: guestsCountNum,
          message: args.message || "Réservé via Concierge AI"
        };

        // Add to global react storage / confirm booking
        onAddBooking(formattedBooking);

        // Add receipt message locally
        const receiptId = 'book-' + Math.random().toString(36).substr(2, 9);
        const autoReplyTxt = data.reply || "Merveilleux ! J'ai enfilé ma tenue de maître d'hôtel et j'ai le plaisir de confirmer votre table de prestige de la part de notre Chef. Voici votre reçu de réservation :";
        
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: autoReplyTxt,
            isBookingReceipt: true,
            bookingData: {
              ...formattedBooking,
              id: receiptId
            }
          }
        ]);

        // Process analysis for lead generation & sync to admin panel (Inbox)
        processConversationAnalysis(userText, autoReplyTxt, true, formattedBooking);

      } else {
        // Standard text reply
        const autoReplyTxt = data.reply || "Je m'excuse, je n'ai pas pu formuler ma réponse. Comment puis-je vous aider ?";
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: autoReplyTxt
          }
        ]);

        // Process analysis for lead generation & sync to admin panel (Inbox)
        processConversationAnalysis(userText, autoReplyTxt, false);
      }

    } catch (error) {
      console.error("Chatbot API Error:", error);
      setIsTyping(false);
      const errReply = "Désolé, j'ai rencontré un petit contretemps de connexion avec notre service de conciergerie. Vous pouvez joindre notre Directeur directement par téléphone au **07 00 00 60 82** ou réessayer dans un instant.";
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: errReply
        }
      ]);

      // Process analysis for fallback failure tracking
      processConversationAnalysis(userText, errReply, false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage(inputValue);
    }
  };

  // Simple formatter to replace markdown-style elements (**bold**) with HTML elements or spans in a elegant visual styling
  const formatMessageText = (text: string) => {
    if (!text) return "";
    
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="text-gold-300 font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <>
      {/* FLOATING ACTION TRIGGER */}
      <div id="ai-chat-trigger-container" className="fixed bottom-6 right-24 z-40 flex flex-col items-center">
        
        {/* Pulsing notification bubble */}
        <AnimatePresence>
          {showNotification && !isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsOpen(true)}
              className="absolute bottom-16 right-0 bg-gradient-to-r from-gold-600 to-gold-400 text-black text-[11px] font-bold py-2 px-3.5 rounded-xl shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer whitespace-nowrap mb-2 border border-black/10 flex items-center space-x-1.5"
            >
              <Sparkles size={12} className="animate-pulse" />
              <span>Besoin d'aide ? Réservez ici !</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          id="btn-ai-chatbot"
          onClick={() => setIsOpen(!isOpen)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className={`${
            isOpen ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gradient-to-br from-[#1c1a1a] via-[#0d0d0d] to-black text-gold-400 border border-gold-400/30 hover:border-gold-400 shadow-gold"
          } p-4 rounded-full shadow-22xl flex items-center justify-center cursor-pointer hover:scale-105 transition-all outline-none`}
          title="Concierge Gaspard AI"
        >
          {isOpen ? <X size={20} /> : <MessageSquare size={20} className="animate-pulse" />}
        </motion.button>
      </div>

      {/* CHAT WINDOW INTERFACE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="ai-chatbot-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-24 w-[350px] sm:w-[390px] h-[550px] max-h-[80vh] bg-[#0d0d0d] rounded-2xl border border-gold-400/20 shadow-2xl z-45 flex flex-col overflow-hidden backdrop-blur-md"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-black to-[#151414] px-5 py-4 border-b border-gold-400/20 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gold-400/10 border border-gold-400/35 flex items-center justify-center">
                    <Sparkles className="text-gold-400 h-5 w-5" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full" />
                </div>
                <div>
                  <h3 className="text-white font-serif font-bold text-sm leading-tight">Concierge Gaspard AI</h3>
                  <p className="text-[10px] text-gold-400/80 font-mono tracking-wider uppercase">Ambassadeur de prestige</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-gradient-to-b from-[#0a0a0a] to-black">
              {messages.map((msg, index) => {
                const isAI = msg.role === "assistant";
                return (
                  <div
                    key={index}
                    className={`flex flex-col ${isAI ? "items-start" : "items-end"} space-y-1`}
                  >
                    <span className="text-[9px] font-mono uppercase tracking-wider text-white/30 px-1">
                      {isAI ? "Concierge Gaspard" : "Vous"}
                    </span>
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                        isAI
                          ? "bg-[#141313] text-white/90 border border-white/5"
                          : "bg-gradient-to-r from-gold-600 to-gold-400 text-black font-semibold"
                      }`}
                    >
                      {formatMessageText(msg.content)}

                      {/* Display luxury confirmed receipt layout */}
                      {msg.isBookingReceipt && msg.bookingData && (
                        <div className="mt-4 bg-black/50 border border-gold-400/30 rounded-xl p-4 space-y-2.5 text-left font-mono text-[11px] sm:text-xs">
                          <div className="flex items-center space-x-2 text-gold-400 border-b border-white/5 pb-2">
                            <Check size={14} className="bg-gold-400/20 rounded p-0.5 text-gold-400 font-bold" />
                            <span className="font-serif text-xs font-bold uppercase tracking-wider">Réservation Confirmée</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/40">ID</span>
                            <span className="text-gold-400 font-bold">{msg.bookingData.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/40">Nom</span>
                            <span className="text-white font-semibold">{msg.bookingData.firstName} {msg.bookingData.lastName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/40">Date & Heure</span>
                            <span className="text-white font-semibold">{msg.bookingData.date} à {msg.bookingData.time}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/40">Invités</span>
                            <span className="text-white font-semibold">{msg.bookingData.guestsCount} {msg.bookingData.guestsCount > 1 ? "Personnes" : "Personne"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/40">Téléphone</span>
                            <span className="text-white font-semibold">{msg.bookingData.phone}</span>
                          </div>
                          {msg.bookingData.message && (
                            <div className="border-t border-white/5 pt-1.5 text-[10px] text-white/50 italic">
                              "{msg.bookingData.message}"
                            </div>
                          )}
                          <a
                            href={`https://wa.me/2250700006082?text=Bonjour%20Concierge%20Gaspard,%20concerne%20ma%20réservation%20de%20table%20avec%20le%20code%20${msg.bookingData.id}`}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-serif uppercase tracking-widest text-[9px] py-2 rounded flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                          >
                            <Phone size={10} />
                            <span>Contacter via Whatsapp</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex flex-col items-start space-y-1">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white/30">Concierge Gaspard</span>
                  <div className="bg-[#141313] text-gold-400 border border-white/5 rounded-xl px-4 py-3 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions chips row */}
            <div className="px-4 py-2 border-t border-white/5 bg-black flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
              <button
                onClick={() => handleQuickSuggestion("Je souhaite réserver une table mémorable pour demain soir.", "🗓️ Réserver une table")}
                className="bg-[#121111] hover:bg-[#1a1a1a] text-white/80 hover:text-gold-400 text-[10px] border border-white/10 rounded-full py-1.5 px-3 transition-colors cursor-pointer"
              >
                🗓️ Réserver une table
              </button>
              <button
                onClick={() => handleQuickSuggestion("Où se trouve le restaurant Gaspard Signature et comment s'y rendre ?", "📍 Où se trouve le restaurant ?")}
                className="bg-[#121111] hover:bg-[#1a1a1a] text-white/80 hover:text-gold-400 text-[10px] border border-white/10 rounded-full py-1.5 px-3 transition-colors cursor-pointer"
              >
                📍 Où se trouve le restaurant ?
              </button>
              <button
                onClick={() => handleQuickSuggestion("Quels sont les services et spécialités culinaires que vous proposez ?", "🍕 Nos spécialités / Services")}
                className="bg-[#121111] hover:bg-[#1a1a1a] text-white/80 hover:text-gold-400 text-[10px] border border-white/10 rounded-full py-1.5 px-3 transition-colors cursor-pointer"
              >
                🍕 Nos spécialités & Services
              </button>
              <button
                onClick={() => handleQuickSuggestion("Comment vous contacter pour un événement de plus de 10 personnes ?", "💼 Privatisation / Traiteur")}
                className="bg-[#121111] hover:bg-[#1a1a1a] text-white/80 hover:text-gold-400 text-[10px] border border-white/10 rounded-full py-1.5 px-3 transition-colors cursor-pointer"
              >
                💼 Privatisation & Traiteur
              </button>
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-black border-t border-gold-400/20 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Écrivez votre demande..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-[#141313] border border-white/10 text-white rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-gold-400 font-serif"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim()}
                className={`${
                  inputValue.trim()
                    ? "bg-gradient-to-r from-gold-600 to-gold-400 text-black hover:opacity-90"
                    : "bg-[#181818] text-white/20 cursor-not-allowed"
                } p-2.5 rounded-lg transition-colors cursor-pointer`}
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
