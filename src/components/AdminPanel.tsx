import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, X, BookOpen, Calendar, HelpCircle, Settings, 
  Trash2, Plus, Edit3, HeartHandshake, Eye, CheckCircle2, ShieldAlert,
  Save, RefreshCw, PowerOff, ShoppingBag, Sparkles, Phone, Printer, Camera
} from 'lucide-react';
import { MenuItem, Booking, ContactMessage, Promotion, RestaurantConfig, DailySpecial, Order, PromotionalBanner, GalleryItem } from '../types';
import { 
  INITIAL_MENU, 
  INITIAL_CONFIG, 
  INITIAL_DAILY_SPECIALS, 
  INITIAL_BANNERS, 
  INITIAL_PROMOTIONS, 
  INITIAL_GALLERY 
} from '../data';

let adminIdCounter = 0;
const generateAdminUniqueId = (prefix: string): string => {
  adminIdCounter++;
  const rand = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `${prefix}-${Date.now()}-${adminIdCounter}-${rand}`;
};

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[]) => void;
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  messages: ContactMessage[];
  setMessages: (messages: ContactMessage[]) => void;
  promotions: Promotion[];
  setPromotions: (promos: Promotion[]) => void;
  config: RestaurantConfig;
  setConfig: (cfg: RestaurantConfig) => void;
  dailySpecials: DailySpecial[];
  setDailySpecials: (specials: DailySpecial[]) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  banners: PromotionalBanner[];
  setBanners: (banners: PromotionalBanner[]) => void;
  galleryItems: GalleryItem[];
  setGalleryItems: (gallery: GalleryItem[]) => void;
}

export default function AdminPanel({
  isOpen,
  onClose,
  menuItems,
  setMenuItems,
  bookings,
  setBookings,
  messages,
  setMessages,
  promotions,
  setPromotions,
  config,
  setConfig,
  dailySpecials,
  setDailySpecials,
  orders,
  setOrders,
  banners,
  setBanners,
  galleryItems,
  setGalleryItems
}: AdminPanelProps) {
  // Security authentications
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const ADMIN_PASS = "Admin-gaspard"; // Secure administration password

  // Panel state navigation
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'menu' | 'bookings' | 'messages' | 'config' | 'specials' | 'orders' | 'gallery'>('dashboard');

  // New Daily Special temporary form state
  const [isAddingSpecial, setIsAddingSpecial] = useState(false);
  const [newSpecial, setNewSpecial] = useState<Omit<DailySpecial, 'id'>>({
    name: '',
    description: '',
    price: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
    isAvailable: true,
    badgeText: 'Suggestion du Chef'
  });

  // New Menu Item temporary form state
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    description: '',
    price: 10000,
    category: 'pizzas',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
    isAvailable: true,
    isPromotion: false,
    promotionPrice: undefined
  });

  // Promotional Banners state
  const [newBannerText, setNewBannerText] = useState('');
  const [newBannerBg, setNewBannerBg] = useState('bg-gold-500 text-black');

  // Editing states for CRUD
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingSpecial, setEditingSpecial] = useState<DailySpecial | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editingBanner, setEditingBanner] = useState<PromotionalBanner | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Gallery management state
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [newPhoto, setNewPhoto] = useState<Omit<GalleryItem, 'id'>>({
    imageUrl: '',
    caption: '',
    category: 'interior'
  });
  const [editingPhoto, setEditingPhoto] = useState<GalleryItem | null>(null);

  // Custom iframe-safe dialog and toast notification states
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    danger?: boolean;
    confirmText?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    danger: false,
    confirmText: 'Confirmer'
  });

  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  const triggerConfirm = (title: string, message: string, onConfirm: () => void, danger = false, confirmText = 'Confirmer') => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      danger,
      confirmText
    });
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({
      isOpen: true,
      message,
      type
    });
    setTimeout(() => {
      setToast(prev => (prev.message === message ? { ...prev, isOpen: false } : prev));
    }, 4500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASS) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Mot de passe incorrect ou non autorisé. Veuillez réessayer.');
    }
  };

  // Menu action handlings
  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.description) {
      showToast("Veuillez renseigner le nom et la description.", "error");
      return;
    }

    const itemToAdd: MenuItem = {
      id: generateAdminUniqueId('menu'),
      ...newItem,
      promotionPrice: newItem.isPromotion ? newItem.promotionPrice : undefined
    };

    const updated = [...menuItems, itemToAdd];
    setMenuItems(updated);
    setIsAddingItem(false);

    // Reset temporary state
    setNewItem({
      name: '',
      description: '',
      price: 10000,
      category: 'pizzas',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
      isAvailable: true,
      isPromotion: false,
      promotionPrice: undefined
    });
    showToast("Le plat a été ajouté au menu !");
  };

  const handleDeleteItem = (id: string) => {
    triggerConfirm(
      "Retirer du Menu",
      "⚠️ Êtes-vous sûr de vouloir retirer ce plat du menu ? Cette action est irréversible.",
      () => {
        const updated = menuItems.filter(item => item.id !== id);
        setMenuItems(updated);
        showToast("Le plat a été supprimé du menu avec succès !");
      },
      true,
      "Retirer"
    );
  };

  const toggleItemAvailability = (id: string) => {
    const updated = menuItems.map(item => {
      if (item.id === id) {
        return { ...item, isAvailable: !item.isAvailable };
      }
      return item;
    });
    setMenuItems(updated);
  };

  // Booking action handlings
  const handleUpdateBookingStatus = (id: string, newStatus: 'confirmed' | 'cancelled') => {
    const updated = bookings.map(b => {
      if (b.id === id) {
        return { ...b, status: newStatus };
      }
      return b;
    });
    setBookings(updated);
  };

  // Message read status
  const toggleMessageRead = (id: string) => {
    const updated = messages.map(m => {
      if (m.id === id) {
        return { ...m, status: m.status === 'read' ? 'unread' : 'read' as any };
      }
      return m;
    });
    setMessages(updated);
  };

  // Promotions Setup Action
  const handleTogglePromoStatus = (id: string) => {
    const updated = promotions.map(p => {
      if (p.id === id) {
        return { ...p, isActive: !p.isActive };
      }
      return p;
    });
    setPromotions(updated);
  };

  const handleUpdateHours = (dayIndex: number, newHours: string) => {
    const updatedHours = [...config.openingHours];
    updatedHours[dayIndex].hours = newHours;
    setConfig({ ...config, openingHours: updatedHours });
  };

  // Daily Specials Action Handlers
  const handleAddNewSpecial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecial.name || !newSpecial.description) {
      showToast("Veuillez renseigner le nom et la description.", "error");
      return;
    }
    const specialToAdd: DailySpecial = {
      id: generateAdminUniqueId('special'),
      ...newSpecial
    };
    const updated = [...dailySpecials, specialToAdd];
    setDailySpecials(updated);
    setIsAddingSpecial(false);
    setNewSpecial({
      name: '',
      description: '',
      price: 15000,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
      isAvailable: true,
      badgeText: 'Suggestion du Chef'
    });
    showToast("La suggestion du chef a été ajoutée à l'ardoise !");
  };

  const handleDeleteSpecial = (id: string) => {
    triggerConfirm(
      "Retirer de l'Ardoise",
      "⚠️ Êtes-vous sûr de vouloir retirer cette suggestion de l'ardoise ? Cette action est irréversible.",
      () => {
        const updated = dailySpecials.filter(item => item.id !== id);
        setDailySpecials(updated);
        showToast("La suggestion a été retirée de l'ardoise avec succès !");
      },
      true,
      "Retirer"
    );
  };

  const toggleSpecialAvailability = (id: string) => {
    const updated = dailySpecials.map(s => {
      if (s.id === id) {
        return { ...s, isAvailable: !s.isAvailable };
      }
      return s;
    });
    setDailySpecials(updated);
  };

  // Orders Action Handlers
  const handleUpdateOrderStatus = (id: string, newStatus: Order['status']) => {
    const updated = orders.map(o => {
      if (o.id === id) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    setOrders(updated);
  };

  const handleDeleteOrder = (id: string) => {
    triggerConfirm(
      "Supprimer la commande",
      "⚠️ Voulez-vous supprimer définitivement cette commande des archives ?",
      () => {
        const updated = orders.filter(o => o.id !== id);
        setOrders(updated);
        showToast("La commande a été supprimée des archives !");
      },
      true,
      "Supprimer"
    );
  };

  // Promotional Banners action handlers
  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerText.trim()) return;
    const bannerToAdd: PromotionalBanner = {
      id: generateAdminUniqueId('banner'),
      text: newBannerText.trim(),
      isActive: true,
      bgColor: newBannerBg
    };
    setBanners([...banners, bannerToAdd]);
    setNewBannerText('');
  };

  const handleToggleBannerStatus = (id: string) => {
    const updated = banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b);
    setBanners(updated);
  };

  const handleDeleteBanner = (id: string) => {
    triggerConfirm(
      "Supprimer la bannière",
      "Voulez-vous supprimer cette bannière ?",
      () => {
        const updated = banners.filter(b => b.id !== id);
        setBanners(updated);
        showToast("La bannière promotionnelle a été supprimée !");
      },
      true,
      "Supprimer"
    );
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const updated = menuItems.map(it => it.id === editingItem.id ? editingItem : it);
    setMenuItems(updated);
    setEditingItem(null);
  };

  const handleUpdateSpecial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpecial) return;
    const updated = dailySpecials.map(s => s.id === editingSpecial.id ? editingSpecial : s);
    setDailySpecials(updated);
    setEditingSpecial(null);
  };

  const handleUpdateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    const updated = bookings.map(b => b.id === editingBooking.id ? editingBooking : b);
    setBookings(updated);
    setEditingBooking(null);
  };

  const handleDeleteBooking = (id: string) => {
    triggerConfirm(
      "Supprimer la réservation",
      "Voulez-vous supprimer définitivement cette réservation ?",
      () => {
        const updated = bookings.filter(b => b.id !== id);
        setBookings(updated);
        showToast("La réservation a été supprimée des archives !");
      },
      true,
      "Supprimer"
    );
  };

  const handleDeleteMessage = (id: string) => {
    triggerConfirm(
      "Supprimer le message",
      "Voulez-vous supprimer définitivement ce message des archives ?",
      () => {
        const updated = messages.filter(m => m.id !== id);
        setMessages(updated);
        showToast("Le message de contact a été supprimé des archives !");
      },
      true,
      "Supprimer"
    );
  };

  const handleUpdateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;
    const updated = banners.map(b => b.id === editingBanner.id ? editingBanner : b);
    setBanners(updated);
    setEditingBanner(null);
  };

  const handleUpdateOrderDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    const updated = orders.map(o => o.id === editingOrder.id ? editingOrder : o);
    setOrders(updated);
    setEditingOrder(null);
  };

  // Gallery CRUD Handlers
  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const id = generateAdminUniqueId('gal');
    const photo: GalleryItem = {
      ...newPhoto,
      id
    };
    setGalleryItems([...galleryItems, photo]);
    setIsAddingPhoto(false);
    setNewPhoto({ imageUrl: '', caption: '', category: 'interior' });
    showToast("Photo ajoutée à la galerie avec succès !");
  };

  const handleUpdatePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;
    const updated = galleryItems.map(p => p.id === editingPhoto.id ? editingPhoto : p);
    setGalleryItems(updated);
    setEditingPhoto(null);
    showToast("Photo de la galerie mise à jour avec succès !");
  };

  const handleDeletePhoto = (id: string) => {
    triggerConfirm(
      "Supprimer la photo",
      "⚠️ Êtes-vous sûr de vouloir supprimer définitivement cette photo de la galerie ?",
      () => {
        const updated = galleryItems.filter(p => p.id !== id);
        setGalleryItems(updated);
        showToast("La photo a été supprimée de la galerie !");
      },
      true,
      "Supprimer"
    );
  };

  // Factory/Admin Panel reset handler
  const handleResetAllData = () => {
    triggerConfirm(
      "Restauration d'Usine",
      "⚠️ ATTENTION ! Voulez-vous vraiment réinitialiser toutes les données de l'administration et de l'applet aux valeurs d'origine ? Tout le menu personnalisé, les bannières, les suggestions, la configuration seront réinitialisés d'origine. Les commandes, messages et réservations seront totalement effacés et vidés !",
      () => {
        // 1. Update localStorage
        localStorage.setItem('gaspard_menu', JSON.stringify(INITIAL_MENU));
        localStorage.setItem('gaspard_config', JSON.stringify(INITIAL_CONFIG));
        localStorage.setItem('gaspard_promotions', JSON.stringify(INITIAL_PROMOTIONS));
        localStorage.setItem('gaspard_gallery', JSON.stringify(INITIAL_GALLERY));
        localStorage.setItem('gaspard_bookings', '[]');
        localStorage.setItem('gaspard_messages', '[]');
        localStorage.setItem('gaspard_daily_specials', JSON.stringify(INITIAL_DAILY_SPECIALS));
        localStorage.setItem('gaspard_orders', '[]');
        localStorage.setItem('gaspard_banners', JSON.stringify(INITIAL_BANNERS));
        localStorage.removeItem('gaspard_cart');

        // 2. Set React states
        setMenuItems(INITIAL_MENU);
        setConfig(INITIAL_CONFIG);
        setPromotions(INITIAL_PROMOTIONS);
        setBookings([]);
        setMessages([]);
        setDailySpecials(INITIAL_DAILY_SPECIALS);
        setOrders([]);
        setBanners(INITIAL_BANNERS);
        setGalleryItems(INITIAL_GALLERY);

        showToast("L'établissement a été entièrement réinitialisé aux valeurs d'usine !");
      },
      true,
      "Tout réinitialiser"
    );
  };

  // Receipt Printing layout constructor
  const handlePrintReceipt = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Impossible de lancer l'aperçu d'impression. Veuillez autoriser les fenêtres pop-up.");
      return;
    }

    const itemsHtml = order.items.map(it => `
      <tr style="border-bottom: 1px dashed #ddd;">
        <td style="padding: 8px 0; font-family: monospace; font-size: 13px; text-align: left;">
          <strong>${it.quantity}x</strong> ${it.name}
          ${it.optionsSummary ? `<br/><span style="color: #555; font-size: 11px;">Options: ${it.optionsSummary}</span>` : ''}
          ${it.customInstructions ? `<br/><span style="color: #666; font-size: 11px; font-style: italic;">Note: "${it.customInstructions}"</span>` : ''}
        </td>
        <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 13px; vertical-align: top;">
          ${(it.price * it.quantity).toLocaleString()} F
        </td>
      </tr>
    `).join('');

    const serviceDetails = order.serviceType === 'delivery' 
      ? `
        <p><strong>Mode :</strong> LIVRAISON À DOMICILE 🛵</p>
        <p><strong>Quartier :</strong> ${order.deliveryDistrict || 'N/A'}</p>
        <p><strong>Adresse de livraison :</strong> ${order.deliveryAddress || 'N/A'}</p>
      `
      : `
        <p><strong>Mode :</strong> RETRAIT SUR PLACE 🏠</p>
        <p><strong>Heure de retrait souhaitée :</strong> ${order.pickupTime || 'N/A'}</p>
      `;

    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket Cuisine - Commande ${order.id}</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              color: #000;
              margin: 0;
              padding: 15px;
              line-height: 1.3;
              background: #fff;
            }
            .receipt-container {
              max-width: 380px;
              margin: 0 auto;
              border: 1px solid #ccc;
              padding: 15px;
              box-sizing: border-box;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #000;
              padding-bottom: 12px;
              margin-bottom: 12px;
            }
            .logo {
              font-size: 19px;
              font-weight: bold;
              letter-spacing: 2px;
              margin: 0 0 4px 0;
            }
            .sub-logo {
              font-size: 9px;
              letter-spacing: 3px;
              text-transform: uppercase;
              color: #333;
              font-weight: bold;
            }
            .details {
              font-size: 11px;
              border-bottom: 1px dashed #000;
              padding-bottom: 8px;
              margin-bottom: 12px;
            }
            .details p {
              margin: 3px 0;
            }
            .total-section {
              border-top: 2px dashed #000;
              padding-top: 8px;
              margin-top: 12px;
              font-size: 12px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 10px;
              color: #444;
              border-top: 1px solid #eee;
              padding-top: 8px;
            }
            @media print {
              body { padding: 0; background: none; }
              .receipt-container { border: none; padding: 0; max-width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <h1 class="logo">GASPARD SIGNATURE</h1>
              <span class="sub-logo">Cuisine d'Exception</span>
              <p style="font-size: 10px; margin: 4px 0 0 0;">Angré 8ème Tranche, Cocody, Abidjan</p>
              <p style="font-size: 10px; margin: 2px 0 0 0;">Tél : 07 00 00 60 82</p>
            </div>
            
            <div class="details">
              <p><strong>ID Commande :</strong> ${order.id}</p>
              <p><strong>Date & Heure :</strong> ${new Date(order.createdAt).toLocaleDateString()} a ${new Date(order.createdAt).toLocaleTimeString()}</p>
              <p><strong>Client :</strong> ${order.clientName}</p>
              <p><strong>Téléphone :</strong> ${order.clientPhone}</p>
              ${serviceDetails}
              <p><strong>Règlement :</strong> ${order.paymentMethod === 'cash' ? 'Espèces / Momo à la livraison' : 'Prépayé Momo'}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
              <thead>
                <tr style="border-bottom: 1px solid #000; font-size: 10px; text-transform: uppercase;">
                  <th style="text-align: left; padding-bottom: 4px;">Détail</th>
                  <th style="text-align: right; padding-bottom: 4px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="total-section">
              <table style="width: 100%; font-size: 11px;">
                <tr>
                  <td>Frais d'emballage/livraison :</td>
                  <td style="text-align: right; font-family: monospace;">${order.deliveryFee.toLocaleString()} F</td>
                </tr>
                <tr>
                  <td>Sous-total :</td>
                  <td style="text-align: right; font-family: monospace;">${order.subtotal.toLocaleString()} F</td>
                </tr>
                <tr style="font-size: 15px; font-weight: bold; border-top: 1px dashed #000;">
                  <td style="padding-top: 6px;">TOTAL À PAYER :</td>
                  <td style="text-align: right; padding-top: 6px; font-family: monospace;">${order.totalPrice.toLocaleString()} FCFA</td>
                </tr>
              </table>
            </div>

            <div class="footer">
              <p>Merci pour votre confiance ! Bon appétit !</p>
              <p style="font-size: 7px; font-family: monospace; color: #777;">Gaspard Signature Custom CMS - ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => { window.close(); }, 800);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      
      {/* Outer panel box */}
      <div className="bg-[#121212] border border-gold-400/20 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden relative shadow-2xl">
        
        {/* Top bar header */}
        <div className="bg-[#181818] border-b border-white/5 py-4 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="text-gold-400" size={22} />
            <h2 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
              Panneau d'administration – Gaspard Signature
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white p-1 hover:bg-white/5 rounded cursor-pointer transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Auth Barrier Screen */}
        {!isAuthenticated ? (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
            <div className="w-14 h-14 bg-gold-400/10 border border-gold-400/20 rounded-full flex items-center justify-center text-gold-400 mb-6">
              <ShieldAlert size={26} />
            </div>

            <h3 className="font-serif text-xl font-bold text-white mb-2">Zone Professionnelle Sécurisée</h3>
            <p className="text-white/60 text-xs sm:text-sm mb-6 leading-relaxed">
              Pour accéder aux commandes de réservations, aux messages d'inbox, et modifier directement le menu, veuillez saisir le mot de passe d'administration.
            </p>

            <form onSubmit={handleLogin} id="admin-pass-form" className="w-full space-y-4">
              <input
                type="password"
                required
                id="admin-pass-input"
                autoFocus
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Mot de passe d'administration"
                className="w-full bg-[#181818] border border-white/10 rounded px-4 py-3 text-center text-sm font-mono text-white focus:outline-none focus:border-gold-400"
              />
              
              {loginError && (
                <p className="text-red-500 font-mono text-[11px] bg-red-500/10 py-1.5 px-3 rounded border border-red-500/25">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                id="admin-login-submit"
                className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-black font-semibold uppercase tracking-wider text-xs py-3 rounded cursor-pointer shadow hover:from-gold-700 transition-all font-sans"
              >
                Déverrouiller le panneau
              </button>
            </form>
          </div>
        ) : (
          
          /* Admin Main Controls Layout */
          <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar navigation */}
            <div className="md:w-56 bg-[#181818] border-r border-white/5 flex flex-col justify-between py-4">
              <div className="space-y-1 px-2">
                <button
                  id="tab-admin-dashboard"
                  onClick={() => setActiveSubTab('dashboard')}
                  className={`w-full text-left py-2.5 px-3 rounded text-xs uppercase tracking-wider font-semibold flex items-center space-x-2.5 transition-colors cursor-pointer ${
                    activeSubTab === 'dashboard' ? 'bg-gold-500 text-black' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ShieldCheck size={14} />
                  <span>Vue globale</span>
                </button>

                <button
                  id="tab-admin-menu"
                  onClick={() => setActiveSubTab('menu')}
                  className={`w-full text-left py-2.5 px-3 rounded text-xs uppercase tracking-wider font-semibold flex items-center space-x-2.5 transition-colors cursor-pointer ${
                    activeSubTab === 'menu' ? 'bg-gold-500 text-black' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <BookOpen size={14} />
                  <span>Menu (Cartes)</span>
                </button>

                <button
                  id="tab-admin-bookings"
                  onClick={() => setActiveSubTab('bookings')}
                  className={`w-full text-left py-2.5 px-3 rounded text-xs uppercase tracking-wider font-semibold flex items-center space-x-2.5 transition-colors cursor-pointer ${
                    activeSubTab === 'bookings' ? 'bg-gold-500 text-black' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Calendar size={14} />
                  <span>Réservations</span>
                  {bookings.filter(b => b.status === 'pending').length > 0 && (
                    <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-auto">
                      {bookings.filter(b => b.status === 'pending').length}
                    </span>
                  )}
                </button>

                <button
                  id="tab-admin-messages"
                  onClick={() => setActiveSubTab('messages')}
                  className={`w-full text-left py-2.5 px-3 rounded text-xs uppercase tracking-wider font-semibold flex items-center space-x-2.5 transition-colors cursor-pointer ${
                    activeSubTab === 'messages' ? 'bg-gold-500 text-black' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <HelpCircle size={14} />
                  <span>Messages Inbox</span>
                  {messages.filter(m => m.status === 'unread').length > 0 && (
                    <span className="bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-auto">
                      {messages.filter(m => m.status === 'unread').length}
                    </span>
                  )}
                </button>

                <button
                  id="tab-admin-orders"
                  onClick={() => setActiveSubTab('orders')}
                  className={`w-full text-left py-2.5 px-3 rounded text-xs uppercase tracking-wider font-semibold flex items-center space-x-2.5 transition-colors cursor-pointer ${
                    activeSubTab === 'orders' ? 'bg-gold-500 text-black' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ShoppingBag size={14} />
                  <span>Commandes</span>
                  {orders.filter(o => o.status === 'pending' || o.status === 'preparing').length > 0 && (
                    <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-auto animate-pulse">
                      {orders.filter(o => o.status === 'pending' || o.status === 'preparing').length}
                    </span>
                  )}
                </button>

                <button
                  id="tab-admin-specials"
                  onClick={() => setActiveSubTab('specials')}
                  className={`w-full text-left py-2.5 px-3 rounded text-xs uppercase tracking-wider font-semibold flex items-center space-x-2.5 transition-colors cursor-pointer ${
                    activeSubTab === 'specials' ? 'bg-gold-500 text-black' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sparkles size={14} />
                  <span>Ardoise / Suggestions</span>
                </button>

                <button
                  id="tab-admin-config"
                  onClick={() => setActiveSubTab('config')}
                  className={`w-full text-left py-2.5 px-3 rounded text-xs uppercase tracking-wider font-semibold flex items-center space-x-2.5 transition-colors cursor-pointer ${
                    activeSubTab === 'config' ? 'bg-gold-500 text-black' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Settings size={14} />
                  <span>Horaires & Promos</span>
                </button>

                <button
                  id="tab-admin-gallery"
                  onClick={() => setActiveSubTab('gallery')}
                  className={`w-full text-left py-2.5 px-3 rounded text-xs uppercase tracking-wider font-semibold flex items-center space-x-2.5 transition-colors cursor-pointer ${
                    activeSubTab === 'gallery' ? 'bg-gold-500 text-black' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Camera size={14} />
                  <span>Galerie (Photos)</span>
                </button>
              </div>

              {/* Sidebar Logout bottom button */}
              <div className="px-2">
                <button
                  id="admin-logout-btn"
                  onClick={() => setIsAuthenticated(false)}
                  className="w-full text-left py-2 px-3 rounded text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <PowerOff size={13} />
                  <span>Quitter la session</span>
                </button>
              </div>
            </div>

            {/* Panels main dynamic screen */}
            <div className="flex-grow p-6 sm:p-8 overflow-y-auto">
              
              {/* SUB TAB: DASHBOARD */}
              {activeSubTab === 'dashboard' && (
                <div className="space-y-8 animate-fadeIn">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white">Vue d'ensemble de l'établissement</h3>
                    <p className="text-white/50 text-xs sm:text-sm mt-1">Données collectées à partir de la session locale.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-[#181818] border border-white/5 rounded-xl p-5">
                      <span className="text-white/40 text-[10px] uppercase font-mono tracking-wider">Tables Réservées</span>
                      <div className="text-white text-3xl font-serif font-black mt-2">{bookings.length}</div>
                      <span className="text-gold-400 text-[10px] font-mono mt-1 block">
                        {bookings.filter(b => b.status === "confirmed").length} confirmées
                      </span>
                    </div>

                    <div className="bg-[#181818] border border-white/5 rounded-xl p-5">
                      <span className="text-white/40 text-[10px] uppercase font-mono tracking-wider">Demandes en attente</span>
                      <div className="text-white text-3xl font-serif font-black mt-2">
                        {bookings.filter(b => b.status === "pending").length}
                      </div>
                      <span className="text-red-400 text-[10px] font-mono mt-1 block">Nécessitent une validation</span>
                    </div>

                    <div className="bg-[#181818] border border-white/5 rounded-xl p-5">
                      <span className="text-white/40 text-[10px] uppercase font-mono tracking-wider">Messages à lire</span>
                      <div className="text-white text-3xl font-serif font-black mt-2">
                        {messages.filter(m => m.status === "unread").length}
                      </div>
                      <span className="text-amber-500 text-[10px] font-mono mt-1 block">Formulaire de contact</span>
                    </div>
                  </div>

                  {/* Operational reminder box */}
                  <div className="p-6 bg-gold-400/5 border border-gold-400/15 rounded-xl space-y-2">
                    <h4 className="font-serif text-sm font-bold text-white flex items-center space-x-2">
                      <CheckCircle2 size={16} className="text-gold-400" />
                      <span>Console Propriétaire - gaspardsignature.ci</span>
                    </h4>
                    <p className="text-white/70 text-xs leading-relaxed">
                      Ce panneau d'administration sur mesure remplace un CMS complexe et permet de modifier à la volée les prix et la structure du site. Toutes les modifications effectuées se sauvegardent automatiquement de manière persistante face aux rechargements de navigateur.
                    </p>
                  </div>

                  {/* Actions d'administration d'urgence & réinitialisations ciblées */}
                  <div className="bg-[#181818] border border-white/5 p-6 rounded-xl space-y-4">
                    <h4 className="font-serif text-base font-bold text-white flex items-center gap-2">
                      <Settings className="text-gold-400" size={18} />
                      <span>Actions d'Administration d'Urgence & Réinitialisations</span>
                    </h4>
                    <p className="text-white/50 text-xs leading-snug">
                      Modifiez ou nettoyez les données stockées de manière ciblée, ou réinitialisez l'entièreté de l'application si vous souhaitez effacer vos essais et charger le menu d'origine.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                      <button
                        onClick={() => {
                          triggerConfirm(
                            "Vider les Réservations",
                            "⚠️ Voulez-vous supprimer TOUTES les demandes de réservation ? Cette action est irréversible.",
                            () => {
                              setBookings([]);
                              localStorage.setItem('gaspard_bookings', '[]');
                              showToast("Toutes les réservations ont été supprimées et vidées !");
                            },
                            true,
                            "Vider le Calendrier"
                          );
                        }}
                        className="bg-red-950/20 hover:bg-red-950/40 text-red-200 border border-red-500/20 py-2.5 px-3 rounded text-xs font-mono font-bold uppercase transition-colors text-center cursor-pointer"
                      >
                        🗑 Vider les Réservations
                      </button>

                      <button
                        onClick={() => {
                          triggerConfirm(
                            "Vider les Commandes",
                            "⚠️ Voulez-vous supprimer TOUTES les commandes actives et historiques ? Cette action est irréversible.",
                            () => {
                              setOrders([]);
                              localStorage.setItem('gaspard_orders', '[]');
                              showToast("Toutes les commandes ont été supprimées et vidées !");
                            },
                            true,
                            "Effacer l'Historique"
                          );
                        }}
                        className="bg-red-950/20 hover:bg-red-950/40 text-red-200 border border-red-500/20 py-2.5 px-3 rounded text-xs font-mono font-bold uppercase transition-colors text-center cursor-pointer"
                      >
                        🗑 Vider les Commandes
                      </button>

                      <button
                        onClick={() => {
                          triggerConfirm(
                            "Vider l'Inbox Client",
                            "⚠️ Voulez-vous supprimer TOUS les messages du formulaire de contact ? Cette action est irréversible.",
                            () => {
                              setMessages([]);
                              localStorage.setItem('gaspard_messages', '[]');
                              showToast("Tous les messages ont été supprimés et vidés !");
                            },
                            true,
                            "Vider la Boîte"
                          );
                        }}
                        className="bg-red-950/20 hover:bg-red-950/40 text-red-200 border border-red-500/20 py-2.5 px-3 rounded text-xs font-mono font-bold uppercase transition-colors text-center cursor-pointer"
                      >
                        🗑 Vider l'Inbox Client
                      </button>

                      <button
                        onClick={() => {
                          triggerConfirm(
                            "Réinitialiser la Carte",
                            "⚠️ Voulez-vous réinitialiser le MENU aux plats d'origine ? Les modifications personnalisées seront perdues.",
                            () => {
                              setMenuItems(INITIAL_MENU);
                              localStorage.setItem('gaspard_menu', JSON.stringify(INITIAL_MENU));
                              showToast("La carte du restaurant a été réinitialisée au menu d'origine !");
                            }
                          );
                        }}
                        className="bg-[#242424] hover:bg-[#333] text-gold-400 border border-gold-400/20 py-2.5 px-3 rounded text-xs font-mono font-bold uppercase transition-colors text-center cursor-pointer"
                      >
                        🔄 Réinitialiser la Carte
                      </button>

                      <button
                        onClick={() => {
                          triggerConfirm(
                            "Réinitialiser l'Ardoise",
                            "⚠️ Voulez-vous réinitialiser les SUGGESTIONS (L'Ardoise) aux valeurs d'origine ?",
                            () => {
                              setDailySpecials(INITIAL_DAILY_SPECIALS);
                              localStorage.setItem('gaspard_daily_specials', JSON.stringify(INITIAL_DAILY_SPECIALS));
                              showToast("L'Ardoise a été réinitialisée aux suggestions d'origine !");
                            }
                          );
                        }}
                        className="bg-[#242424] hover:bg-[#333] text-gold-400 border border-gold-400/20 py-2.5 px-3 rounded text-xs font-mono font-bold uppercase transition-colors text-center cursor-pointer"
                      >
                        🔄 Réinitialiser l'Ardoise
                      </button>

                      <button
                        onClick={() => {
                          triggerConfirm(
                            "Réinitialiser la Config",
                            "⚠️ Voulez-vous réinitialiser les COORDONNÉES ET LA CONFIGURATION aux valeurs d'origine ?",
                            () => {
                              setConfig(INITIAL_CONFIG);
                              localStorage.setItem('gaspard_config', JSON.stringify(INITIAL_CONFIG));
                              showToast("La configuration et les coordonnées ont été réinitialisées !");
                            }
                          );
                        }}
                        className="bg-[#242424] hover:bg-[#333] text-gold-400 border border-gold-400/20 py-2.5 px-3 rounded text-xs font-mono font-bold uppercase transition-colors text-center cursor-pointer"
                      >
                        🔄 Réinitialiser la Config
                      </button>

                      <button
                        onClick={() => {
                          triggerConfirm(
                            "Réinitialiser les Bannières",
                            "⚠️ Voulez-vous réinitialiser les BANNIÈRES de promotion aux valeurs d'origine ?",
                            () => {
                              setBanners(INITIAL_BANNERS);
                              localStorage.setItem('gaspard_banners', JSON.stringify(INITIAL_BANNERS));
                              showToast("Les bannières promotionnelles ont été réinitialisées d'origine !");
                            }
                          );
                        }}
                        className="bg-[#242424] hover:bg-[#333] text-gold-400 border border-gold-400/20 py-2.5 px-3 rounded text-xs font-mono font-bold uppercase transition-colors text-center cursor-pointer"
                      >
                        🔄 Réinitialiser les Bannières
                      </button>

                      <button
                        onClick={() => {
                          triggerConfirm(
                            "Réinitialiser la Galerie",
                            "⚠️ Voulez-vous réinitialiser la GALERIE aux photos d'origine ?",
                            () => {
                              setGalleryItems(INITIAL_GALLERY);
                              localStorage.setItem('gaspard_gallery', JSON.stringify(INITIAL_GALLERY));
                              showToast("La galerie de photos a été réinitialisée d'origine !");
                            }
                          );
                        }}
                        className="bg-[#242424] hover:bg-[#333] text-gold-400 border border-gold-400/20 py-2.5 px-3 rounded text-xs font-mono font-bold uppercase transition-colors text-center cursor-pointer sm:col-span-1"
                      >
                        🔄 Réinitialiser la Galerie
                      </button>

                      <button
                        onClick={handleResetAllData}
                        className="bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase py-2.5 px-3 rounded transition-colors text-center shadow-md cursor-pointer sm:col-span-3 mt-1"
                      >
                        ☠ RÉINITIALISER TOUT L'ÉTABLISSEMENT (RESTAURATION USINE)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB TAB: MENU EDITING */}
              {activeSubTab === 'menu' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white">Gestion de la Carte</h3>
                      <p className="text-white/50 text-xs sm:text-sm">Ajoutez, suspendez ou révisez les tarifs de vos mets.</p>
                    </div>
                    <button
                      id="btn-admin-add-item"
                      onClick={() => setIsAddingItem(true)}
                      className="bg-gold-500 text-black font-semibold text-xs uppercase tracking-wider py-2.5 px-4 rounded hover:bg-gold-400 cursor-pointer flex items-center space-x-2"
                    >
                      <Plus size={14} />
                      <span>Ajouter un plat</span>
                    </button>
                  </div>

                  {/* Add dish modal */}
                  <AnimatePresence>
                    {isAddingItem && (
                      <motion.div
                        id="add-item-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#181818] border border-white/10 rounded-xl p-6 mb-6"
                      >
                        <h4 className="font-serif text-base font-bold text-gold-400 mb-4 flex items-center space-x-2">
                          <Plus size={16} />
                          <span>Renseigner un nouveau mets</span>
                        </h4>
                        
                        <form onSubmit={handleAddNewItem} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-mono text-white/50 mb-1">Nom du plat</label>
                              <input
                                type="text"
                                required
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                                placeholder="Cassoulet d'Angré, Pizza etc."
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-mono text-white/50 mb-1">Catégorie</label>
                              <select
                                value={newItem.category}
                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                              >
                                <option value="entrées">Entrées</option>
                                <option value="salades">Salades</option>
                                <option value="pizzas">Pizzas</option>
                                <option value="grillades">Grillades</option>
                                <option value="burgers">Burgers</option>
                                <option value="desserts">Desserts</option>
                                <option value="boissons">Boissons</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-mono text-white/50 mb-1">Prix (FCFA)</label>
                              <input
                                type="number"
                                required
                                value={newItem.price}
                                onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-mono text-white/50 mb-1">Description française</label>
                            <input
                              type="text"
                              required
                              value={newItem.description}
                              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                              className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                              placeholder="Décrivez les saveurs, herbes, maturations..."
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-mono text-white/50 mb-1">Lien d'image HD Unsplash</label>
                              <input
                                type="text"
                                value={newItem.imageUrl}
                                onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-[11px] text-white"
                              />
                            </div>
                            <div className="flex items-center space-x-4 pt-4">
                              <label className="flex items-center space-x-2 text-xs text-white/80 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={newItem.isPromotion}
                                  onChange={(e) => setNewItem({ ...newItem, isPromotion: e.target.checked })}
                                  className="rounded text-gold-500"
                                />
                                <span>En Promotion</span>
                              </label>

                              {newItem.isPromotion && (
                                <input
                                  type="number"
                                  placeholder="Tarif spécial (F)"
                                  value={newItem.promotionPrice || ''}
                                  onChange={(e) => setNewItem({ ...newItem, promotionPrice: Number(e.target.value) })}
                                  className="w-28 bg-[#121212] border border-white/10 rounded py-1 px-2 text-xs text-white font-mono"
                                />
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 pt-2">
                            <button
                              type="submit"
                              className="bg-gold-500 text-black font-semibold text-xs uppercase tracking-wider py-2 px-4 rounded hover:bg-gold-400 cursor-pointer"
                            >
                              Confirmer l'ajout
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsAddingItem(false)}
                              className="bg-[#242424] hover:bg-[#333] text-white font-semibold text-xs uppercase py-2 px-4 rounded cursor-pointer"
                            >
                              Annuler
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Edit dish modal */}
                  <AnimatePresence>
                    {editingItem && (
                      <motion.div
                        id="edit-item-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#181818] border border-gold-400/30 rounded-xl p-6 mb-6"
                      >
                        <h4 className="font-serif text-base font-bold text-gold-400 mb-4 flex items-center space-x-2">
                          <Edit3 size={16} fill="none" />
                          <span>Modifier le mets : {editingItem.name}</span>
                        </h4>
                        
                        <form onSubmit={handleUpdateItem} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-mono text-white/50 mb-1">Nom du plat</label>
                              <input
                                type="text"
                                required
                                value={editingItem.name}
                                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-mono text-white/50 mb-1">Catégorie</label>
                              <select
                                value={editingItem.category}
                                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                              >
                                <option value="entrées">Entrées</option>
                                <option value="salades">Salades</option>
                                <option value="pizzas">Pizzas</option>
                                <option value="grillades">Grillades</option>
                                <option value="burgers">Burgers</option>
                                <option value="desserts">Desserts</option>
                                <option value="boissons">Boissons</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase font-mono text-white/50 mb-1">Prix (FCFA)</label>
                              <input
                                type="number"
                                required
                                value={editingItem.price}
                                onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-mono text-white/50 mb-1">Description française</label>
                            <input
                              type="text"
                              required
                              value={editingItem.description}
                              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                              className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-mono text-white/50 mb-1">Lien d'image HD Unsplash</label>
                              <input
                                type="text"
                                value={editingItem.imageUrl}
                                onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-[11px] text-white"
                              />
                            </div>
                            <div className="flex items-center space-x-4 pt-4">
                              <label className="flex items-center space-x-2 text-xs text-white/80 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editingItem.isPromotion}
                                  onChange={(e) => setEditingItem({ ...editingItem, isPromotion: e.target.checked })}
                                  className="rounded text-gold-500"
                                />
                                <span>En Promotion</span>
                              </label>

                              {editingItem.isPromotion && (
                                <input
                                  type="number"
                                  placeholder="Tarif spécial (F)"
                                  value={editingItem.promotionPrice || ''}
                                  onChange={(e) => setEditingItem({ ...editingItem, promotionPrice: Number(e.target.value) })}
                                  className="w-28 bg-[#121212] border border-white/10 rounded py-1 px-2 text-xs text-white font-mono"
                                />
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 pt-2">
                            <button
                              type="submit"
                              className="bg-gold-500 text-black font-semibold text-xs uppercase tracking-wider py-2 px-4 rounded hover:bg-gold-400 cursor-pointer"
                            >
                              Enregistrer les modifications
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingItem(null)}
                              className="bg-[#242424] hover:bg-[#333] text-white font-semibold text-xs uppercase py-2 px-4 rounded cursor-pointer"
                            >
                              Annuler
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Items List */}
                  <div className="space-y-3">
                    {menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#181818] p-4 rounded-lg flex items-center justify-between gap-4 border border-white/5"
                      >
                        <div className="flex items-center space-x-3">
                          <img src={item.imageUrl} className="w-10 h-10 rounded object-cover" />
                          <div>
                            <h5 className="font-bold text-white text-sm">{item.name}</h5>
                            <span className="text-[10px] uppercase font-mono text-gold-400">{item.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className="text-right font-mono text-xs">
                            <div className="text-white font-bold">{item.price.toLocaleString()} F</div>
                            {item.isPromotion && (
                              <div className="text-red-400 text-[10px]">Promo: {item.promotionPrice} F</div>
                            )}
                          </div>

                          <button
                            onClick={() => toggleItemAvailability(item.id)}
                            className={`px-3 py-1.5 rounded text-[10px] font-mono tracking-wider uppercase font-bold cursor-pointer ${
                              item.isAvailable 
                                ? 'bg-[#1b2f15] text-[#76df62] hover:bg-[#25441d]' 
                                : 'bg-[#2f1515] text-[#df6262] hover:bg-[#441d1d]'
                            }`}
                          >
                            {item.isAvailable ? 'En stock' : 'Rupture'}
                          </button>

                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setIsAddingItem(false);
                            }}
                            className="bg-[#242424] hover:bg-[#333] p-1.5 rounded text-gold-400 hover:text-gold-300 transition-colors cursor-pointer"
                            title="Modifier"
                          >
                            <Edit3 size={14} />
                          </button>

                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="bg-[#2a1b1b] hover:bg-[#412424] p-1.5 rounded text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB TAB: BOOKINGS LIST */}
              {activeSubTab === 'bookings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white">Réservations Enregistrées</h3>
                    <p className="text-white/50 text-xs sm:text-sm">Cliquez pour administrer le statut ou entrer en relation.</p>
                  </div>

                  {/* Edit Booking Modal */}
                  <AnimatePresence>
                    {editingBooking && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#181818] p-5 rounded-xl border border-gold-500/20 overflow-hidden mb-6"
                      >
                        <form onSubmit={handleUpdateBooking} className="space-y-4">
                          <h4 className="font-serif text-sm font-bold text-gold-400 uppercase tracking-widest border-b border-white/5 pb-2">
                            Modifier la réservation de : {editingBooking.firstName} {editingBooking.lastName}
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase font-mono text-white/50">Prénom *</label>
                              <input
                                type="text"
                                required
                                value={editingBooking.firstName}
                                onChange={(e) => setEditingBooking({ ...editingBooking, firstName: e.target.value })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase font-mono text-white/50">Nom *</label>
                              <input
                                type="text"
                                required
                                value={editingBooking.lastName}
                                onChange={(e) => setEditingBooking({ ...editingBooking, lastName: e.target.value })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase font-mono text-white/50">Téléphone *</label>
                              <input
                                type="text"
                                required
                                value={editingBooking.phone}
                                onChange={(e) => setEditingBooking({ ...editingBooking, phone: e.target.value })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase font-mono text-white/50">Email</label>
                              <input
                                type="email"
                                value={editingBooking.email || ''}
                                onChange={(e) => setEditingBooking({ ...editingBooking, email: e.target.value })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase font-mono text-white/50">Nombre de couverts *</label>
                              <input
                                type="number"
                                required
                                value={editingBooking.guestsCount}
                                onChange={(e) => setEditingBooking({ ...editingBooking, guestsCount: Number(e.target.value) })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase font-mono text-white/50">Date *</label>
                              <input
                                type="text"
                                required
                                value={editingBooking.date}
                                onChange={(e) => setEditingBooking({ ...editingBooking, date: e.target.value })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase font-mono text-white/50">Heure *</label>
                              <input
                                type="text"
                                required
                                value={editingBooking.time}
                                onChange={(e) => setEditingBooking({ ...editingBooking, time: e.target.value })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase font-mono text-white/50">Statut *</label>
                              <select
                                value={editingBooking.status}
                                onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value as any })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                              >
                                <option value="pending">En attente ⏳</option>
                                <option value="confirmed">Confirmée ✔</option>
                                <option value="cancelled">Annulée 🛑</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] uppercase font-mono text-white/50">Message / Demandes spéciales</label>
                            <textarea
                              rows={2}
                              value={editingBooking.message || ''}
                              onChange={(e) => setEditingBooking({ ...editingBooking, message: e.target.value })}
                              className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                            />
                          </div>

                          <div className="flex items-center space-x-3">
                            <button
                              type="submit"
                              className="bg-gold-500 hover:bg-gold-400 text-black font-semibold text-xs uppercase tracking-widest py-2 px-4 rounded cursor-pointer"
                            >
                              Enregistrer les modifications
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingBooking(null)}
                              className="bg-[#242424] hover:bg-[#333] text-white font-semibold text-xs py-2 px-4 rounded cursor-pointer"
                            >
                              Annuler
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {bookings.length === 0 ? (
                    <div className="text-center py-10 bg-[#181818] rounded-xl border border-white/5 text-white/40 text-sm">
                      Aucune réservation effectuée pour l'instant.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div
                          key={booking.id}
                          id={`admin-booking-item-${booking.id}`}
                          className={`p-5 rounded-lg border flex flex-col sm:flex-row justify-between gap-4 transition-all ${
                            booking.status === 'confirmed' 
                              ? 'bg-[#1b2f15]/10 border-[#76df62]/20' 
                              : booking.status === 'cancelled'
                              ? 'bg-[#2f1515]/10 border-[#df6262]/20'
                              : 'bg-[#181818] border-white/5'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-serif text-sm font-bold text-white">
                                {booking.firstName} {booking.lastName}
                              </span>
                              <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-white/50">
                                {booking.id}
                              </span>
                            </div>

                            <p className="text-xs text-white/70 font-mono">
                              Le: <strong>{booking.date}</strong> à <strong>{booking.time}</strong> — <strong>{booking.guestsCount} couverts</strong>
                            </p>

                            <div className="text-xs space-y-1">
                              <div><span className="text-white/40">Tél:</span> <strong className="text-gold-300 font-mono">{booking.phone}</strong></div>
                              {booking.email && <div><span className="text-white/40">Email:</span> <span className="text-white/80">{booking.email}</span></div>}
                              {booking.message && (
                                <div className="mt-2 text-white/60 italic text-[11px] bg-black/3c sm:p-2 rounded border border-white/5 max-w-md">
                                  &ldquo; {booking.message} &rdquo;
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-row sm:flex-col justify-end gap-2 items-end">
                            <span className={`text-[10px] uppercase font-mono px-2 py-1 rounded font-bold ${
                              booking.status === 'confirmed' 
                                ? 'bg-[#1b2f15] text-[#76df62]' 
                                : booking.status === 'cancelled'
                                ? 'bg-[#2f1515] text-[#df6262]'
                                : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              Statut: {booking.status === 'confirmed' ? 'Confirmé' : booking.status === 'cancelled' ? 'Annulé' : 'En attente'}
                            </span>

                            <div className="flex items-center space-x-2 mt-2">
                              {booking.status !== 'confirmed' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded cursor-pointer"
                                >
                                  Confirmer
                                </button>
                              )}
                              {booking.status !== 'cancelled' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                  className="bg-[#242424] hover:bg-[#333] hover:text-red-400 text-white/70 font-semibold text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded cursor-pointer"
                                >
                                  Annuler table
                                </button>
                              )}
                              <button
                                onClick={() => setEditingBooking(booking)}
                                className="bg-[#181818] border border-gold-400/20 hover:border-gold-400 text-gold-400 font-semibold text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded cursor-pointer transition-colors"
                              >
                                Modifier
                              </button>
                              <button
                                onClick={() => handleDeleteBooking(booking.id)}
                                className="bg-[#2a1b1b] hover:bg-[#412424] text-red-400 p-1.5 rounded cursor-pointer transition-colors"
                                title="Supprimer la réservation définitivement"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUB TAB: CONTACT MESSAGES */}
              {activeSubTab === 'messages' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white">Inboox Contacts Clients</h3>
                    <p className="text-white/50 text-xs sm:text-sm">Consultez les requêtes de privatisation et questions générales.</p>
                  </div>

                  {messages.length === 0 ? (
                    <div className="text-center py-10 bg-[#181818] rounded-xl border border-white/5 text-white/40 text-sm">
                      Aucun message d'inbox.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-5 rounded-lg border ${
                            msg.status === 'unread' ? 'bg-[#121212] border-amber-500/20' : 'bg-[#181818]/60 border-white/5 opacity-80'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-4 mb-3">
                            <div>
                              <h5 className="font-serif font-bold text-white text-base">{msg.name}</h5>
                              <span className="text-[10px] font-mono text-gold-400">{msg.subject}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleMessageRead(msg.id)}
                                className={`px-2 py-1 rounded text-[9px] uppercase font-mono ${
                                  msg.status === 'unread' ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 text-white/40'
                                } cursor-pointer`}
                              >
                                {msg.status === 'unread' ? 'Lu ?' : 'Lu'}
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="text-white/20 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                                title="Supprimer le message"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-white/80 leading-relaxed italic bg-black/20 p-3 rounded border border-white/5">
                            &ldquo; {msg.message} &rdquo;
                          </p>

                          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
                            <div className="space-x-4">
                              <span>Tél: <strong className="text-white/70">{msg.phone || 'Non renseigné'}</strong></span>
                              <span>Email: <strong className="text-white/70">{msg.email}</strong></span>
                            </div>
                            <span>Ex: {new Date(msg.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUB TAB: CONFIGURATION */}
              {activeSubTab === 'config' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white">Horaires d'ouverture & Coordonnées</h3>
                    <p className="text-white/50 text-xs sm:text-sm">Gérant les alertes flash, les heures opérationnelles, l'adresse, les réseaux et contacts du restaurant.</p>
                  </div>

                  {/* Coordonnées & Réseaux Sociaux */}
                  <div className="bg-[#181818] p-5 rounded-xl border border-white/5 space-y-4">
                    <h4 className="font-serif text-sm font-bold text-gold-400 uppercase tracking-widest">Coordonnées de l'établissement</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-mono text-white/50">Adresse complète</label>
                        <input
                          type="text"
                          value={config.address}
                          onChange={(e) => setConfig({ ...config, address: e.target.value })}
                          className="bg-[#121212] border border-white/10 rounded py-1.5 px-3 text-xs text-white w-full"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-mono text-white/50">N° de Téléphone principal</label>
                        <input
                          type="text"
                          value={config.phone}
                          onChange={(e) => setConfig({ ...config, phone: e.target.value })}
                          className="bg-[#121212] border border-white/10 rounded py-1.5 px-3 text-xs text-white w-full font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-mono text-white/50">Adresse Email publique</label>
                        <input
                          type="email"
                          value={config.email}
                          onChange={(e) => setConfig({ ...config, email: e.target.value })}
                          className="bg-[#121212] border border-white/10 rounded py-1.5 px-3 text-xs text-white w-full font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-mono text-white/50">Numéro WhatsApp de contact (ex: +2250700006082)</label>
                        <input
                          type="text"
                          value={config.whatsappNumber}
                          onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                          className="bg-[#121212] border border-white/10 rounded py-1.5 px-3 text-xs text-white w-full font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/5 pt-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-mono text-white/50">Lien Instagram</label>
                        <input
                          type="text"
                          value={config.instagramUrl || ''}
                          onChange={(e) => setConfig({ ...config, instagramUrl: e.target.value })}
                          className="bg-[#121212] border border-white/10 rounded py-1.5 px-3 text-xs text-white w-full font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-mono text-white/50">Lien Facebook</label>
                        <input
                          type="text"
                          value={config.facebookUrl || ''}
                          onChange={(e) => setConfig({ ...config, facebookUrl: e.target.value })}
                          className="bg-[#121212] border border-white/10 rounded py-1.5 px-3 text-xs text-white w-full font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-mono text-white/50">Lien TikTok</label>
                        <input
                          type="text"
                          value={config.tiktokUrl || ''}
                          onChange={(e) => setConfig({ ...config, tiktokUrl: e.target.value })}
                          className="bg-[#121212] border border-white/10 rounded py-1.5 px-3 text-xs text-white w-full font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hours schedule grid */}
                  <div className="bg-[#181818] p-5 rounded-xl border border-white/5 space-y-4">
                    <h4 className="font-serif text-sm font-bold text-gold-400 uppercase tracking-widest">Configurer les Horaires</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {config.openingHours.map((hour, idx) => (
                        <div key={`admin-hour-${hour.day}-${idx}`} className="space-y-1">
                          <label className="block text-[10px] uppercase font-mono text-white/50">{hour.day}</label>
                          <input
                            type="text"
                            value={hour.hours}
                            onChange={(e) => handleUpdateHours(idx, e.target.value)}
                            className="bg-[#121212] border border-white/10 rounded py-1.5 px-2 text-xs text-white w-full font-mono text-center"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Promotions control grid */}
                  <div className="bg-[#181818] p-5 rounded-xl border border-white/5 space-y-4">
                    <h4 className="font-serif text-sm font-bold text-gold-400 uppercase tracking-widest">Publier les Promotions</h4>
                    
                    <div className="space-y-4">
                      {promotions.map((p) => (
                        <div
                          key={p.id}
                          className="bg-black/40 p-4 rounded-lg border border-white/5 flex items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <h5 className="font-serif font-bold text-white text-sm">{p.title}</h5>
                            <p className="text-[11px] text-white/60">{p.description}</p>
                            <span className="text-[9px] bg-gold-400/5 text-gold-400 font-mono px-1.5 py-0.5 rounded border border-gold-400/10 inline-block mt-1">
                              Valable jusqu'à: {p.validUntil}
                            </span>
                          </div>

                          <button
                            onClick={() => handleTogglePromoStatus(p.id)}
                            className={`px-3 py-1.5 rounded text-[10px] font-mono uppercase font-bold cursor-pointer ${
                              p.isActive 
                                ? 'bg-[#1b2f15] text-[#76df62]' 
                                : 'bg-[#2f1515] text-[#df6262]'
                            }`}
                          >
                            {p.isActive ? 'Actif' : 'Désactivé'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bannières Promotionnelles d'en-tête */}
                  <div className="bg-[#181818] p-5 rounded-xl border border-white/5 space-y-4">
                    <h4 className="font-serif text-sm font-bold text-gold-400 uppercase tracking-widest">Bannières d'Annonces Défilantes</h4>
                    <p className="text-white/50 text-xs -mt-1.5 leading-snug">
                      Définissez des messages textuels accrocheurs à afficher en haut du site pour mettre en relief des événements ou offres flash.
                    </p>

                    {/* Add Banner Form */}
                    <form onSubmit={handleAddBanner} className="space-y-3 bg-black/30 p-4 rounded-lg border border-white/5">
                      <span className="text-[10px] uppercase font-mono text-gold-400 font-bold block">Ajouter un message d'en-tête :</span>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          required
                          value={newBannerText}
                          onChange={(e) => setNewBannerText(e.target.value)}
                          placeholder="Ex: 🎁 Livraison Gratuite ce weekend avec le code WEEKEND ! 🎁"
                          className="flex-grow bg-[#121212] border border-white/10 rounded px-3 py-2 text-xs text-white placeholder-white/30"
                        />
                        <select
                          value={newBannerBg}
                          onChange={(e) => setNewBannerBg(e.target.value)}
                          className="bg-[#121212] border border-white/10 rounded px-3 py-2 text-xs text-white font-semibold font-mono"
                        >
                          <option value="bg-gold-500 text-black">Or Signature (Orfèvre)</option>
                          <option value="bg-neutral-950 text-gold-400 border border-gold-400/20">Sombre Délicat (Abyssal)</option>
                          <option value="bg-red-950 text-red-200 border border-red-500/20">Alerte Rouge (Fête / Urgent)</option>
                          <option value="bg-emerald-950 text-emerald-200 border border-emerald-500/20">Émeraude (Saison / Nature)</option>
                        </select>
                        <button
                          type="submit"
                          className="bg-gold-500 hover:bg-gold-400 text-black font-semibold text-xs uppercase py-2 px-5 rounded font-mono flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          <Plus size={13} />
                          <span>Ajouter</span>
                        </button>
                      </div>
                    </form>

                    {/* List of current banners */}
                    <div className="space-y-3 pt-2">
                      {banners.length === 0 ? (
                        <div className="text-center py-4 bg-black/10 rounded border border-white/5 text-white/30 text-xs italic">
                          Aucun message d'annonce d'en-tête configuré.
                        </div>
                      ) : (
                        banners.map((banner) => (
                          <div 
                            key={banner.id}
                            className="bg-black/25 p-3.5 rounded-lg border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex-grow space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span className={`text-[8px] font-mono px-2 py-0.5 rounded font-bold uppercase ${banner.bgColor || 'bg-gold-500 text-black'}`}>
                                  Thème de Couleur
                                </span>
                                <span className="text-[9px] text-white/30 font-mono">{banner.id}</span>
                              </div>
                              <p className="text-xs sm:text-sm text-white/90 font-sans italic leading-tight">{banner.text}</p>
                            </div>

                            <div className="flex items-center space-x-3.5 flex-shrink-0 self-end sm:self-center">
                              <button
                                type="button"
                                onClick={() => handleToggleBannerStatus(banner.id)}
                                className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase font-bold cursor-pointer transition-colors ${
                                  banner.isActive 
                                    ? 'bg-[#1b2f15] text-[#76df62]' 
                                    : 'bg-[#2f1515] text-[#df6262]'
                                }`}
                              >
                                {banner.isActive ? 'Affiché' : 'Masqué'}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteBanner(banner.id)}
                                className="text-white/30 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Zone de Danger : Réinitialisation Complète */}
                  <div className="bg-[#241414] p-5 rounded-xl border border-red-500/25 space-y-4">
                    <div className="flex items-center space-x-2 text-red-400">
                      <ShieldAlert size={18} />
                      <h4 className="font-serif text-sm font-bold uppercase tracking-widest">Zone de Réinitialisation Administrative</h4>
                    </div>
                    <p className="text-white/60 text-xs leading-relaxed">
                      Si vous rencontrez des problèmes de synchronisation ou des incohérences de données fictives, vous pouvez réinitialiser l'ensemble de l'application à son état d'origine. Cette action effacera définitivement le menu personnalisé, les bannières, toutes les commandes simulées, les messages clients et les rendez-vous.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetAllData}
                      className="bg-red-600/10 hover:bg-red-600/25 text-red-300 border border-red-500/30 font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded cursor-pointer transition-colors font-mono"
                    >
                      ☠ Réinitialiser et redémarrer l'Administration
                    </button>
                  </div>

                  {/* Persist/Sync info bar */}
                  <div className="text-center font-mono text-[10px] text-emerald-500/80 bg-[#16271c] border border-emerald-500/20 rounded-lg p-3">
                    ✔ TOUTES LES MODIFICATIONS ONT ÉTÉ ENREGISTRÉES ET APPLIQUÉES SANS INTERRUPTION DE SERVICE.
                  </div>
                </div>
              )}

              {/* SUB TAB: DAILY SPECIALS CRUD */}
              {activeSubTab === 'specials' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white">Suggestions Spéciales du Chef</h3>
                      <p className="text-white/50 text-xs sm:text-sm">Gérez les créations éphémères du jour mises en valeur sur l'ardoise.</p>
                    </div>

                    <button
                      id="btn-admin-add-special-toggle"
                      onClick={() => setIsAddingSpecial(!isAddingSpecial)}
                      className="bg-gold-500 text-black text-xs font-semibold uppercase tracking-wider py-2 px-4 rounded flex items-center space-x-1.5 hover:bg-gold-400 cursor-pointer transition-colors"
                    >
                      <Plus size={14} />
                      <span>{isAddingSpecial ? 'Fermer le formulaire' : 'Nouvelle Suggestion'}</span>
                    </button>
                  </div>

                  {/* Add Special Form */}
                  <AnimatePresence>
                    {isAddingSpecial && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#181818] p-5 rounded-xl border border-gold-500/20 overflow-hidden"
                      >
                        <form onSubmit={handleAddNewSpecial} className="space-y-4">
                          <h4 className="font-serif text-sm font-bold text-gold-400 uppercase tracking-widest border-b border-white/5 pb-2">
                            Rédiger une fiche de suggestion
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase font-mono text-white/50">Nom du plat d'exception *</label>
                              <input
                                type="text"
                                required
                                value={newSpecial.name}
                                onChange={(e) => setNewSpecial({ ...newSpecial, name: e.target.value })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                                placeholder="Carré de Porc Epicé des Collines"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase font-mono text-white/50">Libellé Badge / Statut (Ex: Suggestion du Chef, Quantité Limitée) *</label>
                              <input
                                type="text"
                                required
                                value={newSpecial.badgeText}
                                onChange={(e) => setNewSpecial({ ...newSpecial, badgeText: e.target.value })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                                placeholder="Création Exclusive"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase font-mono text-white/50">Prix de vente (FCFA) *</label>
                              <input
                                type="number"
                                required
                                value={newSpecial.price}
                                onChange={(e) => setNewSpecial({ ...newSpecial, price: Number(e.target.value) })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white font-mono"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase font-mono text-white/50">URL de l'image gourmande *</label>
                              <input
                                type="text"
                                required
                                value={newSpecial.imageUrl}
                                onChange={(e) => setNewSpecial({ ...newSpecial, imageUrl: e.target.value })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] uppercase font-mono text-white/50">Description gastronomique alléchante *</label>
                            <textarea
                              required
                              rows={2}
                              value={newSpecial.description}
                              onChange={(e) => setNewSpecial({ ...newSpecial, description: e.target.value })}
                              className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                              placeholder="Tranches tendres découpées finement, flambées aux parfums des grands-pères ivoiriens, riz au jasmin..."
                            />
                          </div>

                          <button
                            type="submit"
                            id="btn-submit-new-special"
                            className="bg-gold-500 hover:bg-gold-400 text-black font-semibold text-xs uppercase tracking-widest py-2.5 px-6 rounded cursor-pointer"
                          >
                            Inscrire à l'Ardoise
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Edit Special Form */}
                  <AnimatePresence>
                    {editingSpecial && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[#181818] p-5 rounded-xl border border-gold-500/20 overflow-hidden mb-6"
                      >
                        <form onSubmit={handleUpdateSpecial} className="space-y-4">
                          <h4 className="font-serif text-sm font-bold text-gold-400 uppercase tracking-widest border-b border-white/5 pb-2">
                            Modifier la suggestion : {editingSpecial.name}
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase font-mono text-white/50">Nom du plat d'exception *</label>
                              <input
                                type="text"
                                required
                                value={editingSpecial.name}
                                onChange={(e) => setEditingSpecial({ ...editingSpecial, name: e.target.value })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase font-mono text-white/50">Libellé Badge / Statut *</label>
                              <input
                                type="text"
                                required
                                value={editingSpecial.badgeText || ''}
                                onChange={(e) => setEditingSpecial({ ...editingSpecial, badgeText: e.target.value })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase font-mono text-white/50">Prix de vente (FCFA) *</label>
                              <input
                                type="number"
                                required
                                value={editingSpecial.price}
                                onChange={(e) => setEditingSpecial({ ...editingSpecial, price: Number(e.target.value) })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white font-mono"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase font-mono text-white/50">URL de l'image *</label>
                              <input
                                type="text"
                                required
                                value={editingSpecial.imageUrl}
                                onChange={(e) => setEditingSpecial({ ...editingSpecial, imageUrl: e.target.value })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] uppercase font-mono text-white/50">Description gastronomique *</label>
                            <textarea
                              required
                              rows={2}
                              value={editingSpecial.description}
                              onChange={(e) => setEditingSpecial({ ...editingSpecial, description: e.target.value })}
                              className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                            />
                          </div>

                          <div className="flex items-center space-x-3">
                            <button
                              type="submit"
                              className="bg-gold-500 hover:bg-gold-400 text-black font-semibold text-xs uppercase tracking-widest py-2 px-4 rounded cursor-pointer"
                            >
                              Enregistrer les modifications
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingSpecial(null)}
                              className="bg-[#242424] hover:bg-[#333] text-white font-semibold text-xs uppercase py-2 px-4 rounded cursor-pointer"
                            >
                              Annuler
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Specials Grid List */}
                  <div className="space-y-4">
                    {dailySpecials.length === 0 ? (
                      <div className="text-center py-10 bg-[#181818] rounded-xl border border-white/5 text-white/40 text-sm">
                        Aucune suggestion spéciale paramétrée.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {dailySpecials.map((special) => (
                          <div
                            key={special.id}
                            className="bg-[#181818] p-4 rounded-xl border border-white/5 flex gap-4 items-start justify-between"
                          >
                            <img src={special.imageUrl} className="w-14 h-14 rounded-lg object-cover bg-white/5 flex-shrink-0" />
                            
                            <div className="flex-grow space-y-1">
                              <div className="flex items-center space-x-1.5">
                                {special.badgeText && (
                                  <span className="bg-gold-400/10 text-[8px] uppercase tracking-wider text-gold-400 py-0.5 px-2 rounded border border-gold-400/20 font-bold">
                                    {special.badgeText}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-serif font-bold text-white text-sm">{special.name}</h4>
                              <p className="text-[10px] text-white/50 line-clamp-2">{special.description}</p>
                              <span className="font-mono text-xs text-gold-400 font-bold block pt-1">
                                {special.price.toLocaleString()} FCFA
                              </span>
                            </div>

                            <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                              <button
                                onClick={() => toggleSpecialAvailability(special.id)}
                                className={`px-2 py-1 rounded text-[9px] uppercase font-mono font-bold cursor-pointer ${
                                  special.isAvailable 
                                    ? 'bg-[#1b2f15] text-[#76df62]' 
                                    : 'bg-[#2f1515] text-[#df6262]'
                                }`}
                              >
                                {special.isAvailable ? 'Actif' : 'Masqué'}
                              </button>

                              <button
                                onClick={() => {
                                  setEditingSpecial(special);
                                  setIsAddingSpecial(false);
                                }}
                                className="text-gold-400 hover:text-gold-300 p-1 rounded hover:bg-white/5 cursor-pointer"
                                title="Modifier la suggestion"
                              >
                                <Edit3 size={13} fill="none" />
                              </button>

                              <button
                                onClick={() => handleDeleteSpecial(special.id)}
                                className="text-white/30 hover:text-red-400 p-1 rounded hover:bg-white/5"
                                title="Supprimer la suggestion"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUB TAB: ONLINE ORDERS CMS */}
              {activeSubTab === 'orders' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white">Commandes & Ventes en ligne</h3>
                    <p className="text-white/50 text-xs sm:text-sm">Consultez, traitez, et modifiez le cycle de vie des achats de vos convives.</p>
                  </div>

                  {/* Order Stats counts */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-[#181818] p-4 rounded-xl border border-white/5 text-center">
                      <span className="block text-[10px] uppercase font-mono text-white/40">Total Ventes</span>
                      <strong className="text-base sm:text-lg text-gold-300 font-mono">
                        {orders.reduce((acc, curr) => curr.status !== 'cancelled' ? acc + curr.totalPrice : acc, 0).toLocaleString()} F
                      </strong>
                    </div>

                    <div className="bg-[#181818] p-4 rounded-xl border border-white/5 text-center">
                      <span className="block text-[10px] uppercase font-mono text-white/40">Nouvelles Commandes</span>
                      <strong className="text-base sm:text-lg text-amber-400 font-mono">
                        {orders.filter(o => o.status === 'pending').length}
                      </strong>
                    </div>

                    <div className="bg-[#181818] p-4 rounded-xl border border-white/5 text-center">
                      <span className="block text-[10px] uppercase font-mono text-white/40">En Préparation</span>
                      <strong className="text-base sm:text-lg text-sky-400 font-mono">
                        {orders.filter(o => o.status === 'preparing' || o.status === 'out_for_delivery').length}
                      </strong>
                    </div>

                    <div className="bg-[#181818] p-4 rounded-xl border border-white/5 text-center">
                      <span className="block text-[10px] uppercase font-mono text-white/40">Taux de Service</span>
                      <strong className="text-base sm:text-lg text-emerald-400 font-mono">
                        {orders.length > 0 ? Math.round((orders.filter(o => o.status === 'completed').length / orders.length) * 100) : 100}%
                      </strong>
                    </div>
                  </div>

                  {/* Orders itemized lists */}
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="text-center py-10 bg-[#181818] rounded-xl border border-white/5 text-white/40 text-sm">
                        Aucune commande en cours d'enregistrement.
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                        {/* Edit Order Form */}
                        <AnimatePresence>
                          {editingOrder && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-[#181818] p-5 rounded-xl border border-gold-500/20 overflow-hidden mb-6"
                            >
                              <form onSubmit={handleUpdateOrderDetails} className="space-y-4">
                                <h4 className="font-serif text-sm font-bold text-gold-400 uppercase tracking-widest border-b border-white/5 pb-2">
                                  Modifier les coordonnées de la commande : {editingOrder.id}
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label className="block text-[10px] uppercase font-mono text-white/50">Nom du client *</label>
                                    <input
                                      type="text"
                                      required
                                      value={editingOrder.clientName}
                                      onChange={(e) => setEditingOrder({ ...editingOrder, clientName: e.target.value })}
                                      className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="block text-[10px] uppercase font-mono text-white/50">Téléphone *</label>
                                    <input
                                      type="text"
                                      required
                                      value={editingOrder.clientPhone}
                                      onChange={(e) => setEditingOrder({ ...editingOrder, clientPhone: e.target.value })}
                                      className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <div className="space-y-1">
                                    <label className="block text-[10px] uppercase font-mono text-white/50">Frais d'emballage/livraison *</label>
                                    <input
                                      type="number"
                                      required
                                      value={editingOrder.deliveryFee}
                                      onChange={(e) => {
                                        const fee = Number(e.target.value);
                                        setEditingOrder({ ...editingOrder, deliveryFee: fee, totalPrice: editingOrder.subtotal + fee });
                                      }}
                                      className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white font-mono"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="block text-[10px] uppercase font-mono text-white/50">Mode de service *</label>
                                    <select
                                      value={editingOrder.serviceType}
                                      onChange={(e) => setEditingOrder({ ...editingOrder, serviceType: e.target.value as any })}
                                      className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                                    >
                                      <option value="pickup">Retrait sur place 🏠</option>
                                      <option value="delivery">Livraison à domicile 🛵</option>
                                    </select>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="block text-[10px] uppercase font-mono text-white/50">Règlement *</label>
                                    <select
                                      value={editingOrder.paymentMethod}
                                      onChange={(e) => setEditingOrder({ ...editingOrder, paymentMethod: e.target.value as any })}
                                      className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                                    >
                                      <option value="cash">Espèces / Momo à la livraison</option>
                                      <option value="momo">Prépayé Mobile Money</option>
                                    </select>
                                  </div>
                                </div>

                                {editingOrder.serviceType === 'delivery' ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                      <label className="block text-[10px] uppercase font-mono text-white/50">Quartier de livraison *</label>
                                      <input
                                        type="text"
                                        required
                                        value={editingOrder.deliveryDistrict || ''}
                                        onChange={(e) => setEditingOrder({ ...editingOrder, deliveryDistrict: e.target.value })}
                                        className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="block text-[10px] uppercase font-mono text-white/50">Adresse complète *</label>
                                      <input
                                        type="text"
                                        required
                                        value={editingOrder.deliveryAddress || ''}
                                        onChange={(e) => setEditingOrder({ ...editingOrder, deliveryAddress: e.target.value })}
                                        className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-1">
                                    <label className="block text-[10px] uppercase font-mono text-white/50">Heure de retrait souhaitée *</label>
                                    <input
                                      type="text"
                                      required
                                      value={editingOrder.pickupTime || ''}
                                      onChange={(e) => setEditingOrder({ ...editingOrder, pickupTime: e.target.value })}
                                      className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                                    />
                                  </div>
                                )}

                                <div className="flex items-center space-x-3 font-sans">
                                  <button
                                    type="submit"
                                    className="bg-gold-500 hover:bg-gold-400 text-black font-semibold text-xs uppercase tracking-widest py-2 px-4 rounded cursor-pointer"
                                  >
                                    Enregistrer les modifications
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingOrder(null)}
                                    className="bg-[#242424] hover:bg-[#333] text-white font-semibold text-xs py-2 px-4 rounded cursor-pointer"
                                  >
                                    Annuler
                                  </button>
                                </div>
                              </form>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className={`p-5 rounded-xl border ${
                              order.status === 'pending'
                                ? 'bg-[#18181c] border-amber-500/25'
                                : order.status === 'preparing'
                                  ? 'bg-[#141c24] border-sky-500/25'
                                  : 'bg-[#181818] border-white/5'
                            }`}
                          >
                            {/* Order sub-header titles */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3.5 mb-3.5">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono text-xs font-bold text-gold-400 bg-gold-400/5 px-2.5 py-0.5 rounded border border-gold-400/20">
                                    {order.id}
                                  </span>
                                  <span className="text-[10px] uppercase font-mono text-white/40">
                                    Créée le: {new Date(order.createdAt).toLocaleTimeString()}
                                  </span>
                                </div>
                                <h4 className="font-serif font-bold text-white text-base mt-1.5">
                                  {order.clientName}
                                </h4>
                              </div>

                              {/* Status Select action workflow */}
                              <div className="flex items-center space-x-2">
                                <label className="text-[9px] uppercase font-mono text-white/40">Statut:</label>
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                                  className="bg-[#121212] border border-white/10 rounded py-1 px-2.5 text-xs text-white font-semibold focus:outline-none"
                                >
                                  <option value="pending">En attente ⏳</option>
                                  <option value="preparing">En préparation 🍳</option>
                                  <option value="out_for_delivery">En livraison 🛵</option>
                                  <option value="ready_for_pickup">Prêt au Retrait 📦</option>
                                  <option value="completed">Complété ✔</option>
                                  <option value="cancelled">Annulé 🛑</option>
                                </select>
                              </div>
                            </div>

                            {/* Client address details and delivery vs pickup coordinates */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-white/70 mb-4 bg-black/25 p-3 rounded-lg border border-white/5">
                              <div className="space-y-1">
                                <span className="block text-[9px] uppercase text-white/30">Liaison Contact</span>
                                <div className="space-y-1">
                                  <a
                                    href={`tel:${order.clientPhone.replace(/\s+/g, '')}`}
                                    className="text-gold-400 font-bold hover:underline inline-flex items-center space-x-1"
                                  >
                                    <Phone size={10} />
                                    <span>{order.clientPhone}</span>
                                  </a>
                                  {order.clientEmail && <span className="block text-[10px] text-white/40 text-ellipsis overflow-hidden">{order.clientEmail}</span>}
                                </div>
                              </div>

                              <div className="space-y-1">
                                <span className="block text-[9px] uppercase text-white/30">Mode de service</span>
                                <span className="text-white font-bold block">
                                  {order.serviceType === 'delivery' ? '🛵 Livraison à Domicile' : '🏠 Retrait sur Place'}
                                </span>
                                {order.serviceType === 'pickup' && <span className="text-[10px] text-white/50 block">Heure: {order.pickupTime}</span>}
                              </div>

                              <div className="space-y-1">
                                <span className="block text-[9px] uppercase text-white/30">Adresse / Destination</span>
                                {order.serviceType === 'delivery' ? (
                                  <div className="leading-tight">
                                    <strong className="text-white">{order.deliveryDistrict}</strong>
                                    <span className="block text-[10px] text-white/50 text-ellipsis overflow-hidden mt-0.5">{order.deliveryAddress}</span>
                                  </div>
                                ) : (
                                  <span className="text-white/40 italic text-[11px]">N/A (Retrait Restaurant)</span>
                                )}
                              </div>
                            </div>

                            {/* List of items ordered with customized options */}
                            <div className="space-y-2 mb-4">
                              <span className="text-[9px] uppercase font-mono text-white/30 tracking-widest block">Détails des plats commandés :</span>
                              {order.items.map((it, itemIdx) => (
                                <div key={itemIdx} className="bg-white/5 p-2.5 rounded text-xs flex justify-between gap-4">
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-gold-400 font-serif font-bold">
                                        Qty: {it.quantity}x
                                      </span>
                                      <span className="text-white font-bold font-serif">{it.name}</span>
                                    </div>

                                    {/* Options inline */}
                                    {it.optionsSummary && (
                                      <p className="text-[10px] text-gold-500/80 font-mono mt-0.5">
                                        Options: {it.optionsSummary}
                                      </p>
                                    )}

                                    {it.customInstructions && (
                                      <p className="text-[10px] text-white/50 italic mt-1 font-mono">
                                        Note: &ldquo;{it.customInstructions}&rdquo;
                                      </p>
                                    )}
                                  </div>

                                  <span className="font-mono text-white/60 font-semibold self-center sm:self-start">
                                    {(it.price * it.quantity).toLocaleString()} F
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Order bottom bar showing price and delete */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-white/5 pt-3.5">
                              <div className="font-mono text-xs text-white/60">
                                <span>Règlement : <strong>{order.paymentMethod === 'cash' ? 'Cash / MoMo à la réception' : 'Momo prépayé (Simulé)'}</strong></span>
                              </div>

                              <div className="flex items-center space-x-4">
                                <div className="font-mono text-xs text-right">
                                  <span className="text-white/40">Frais: {order.deliveryFee.toLocaleString()} F | </span>
                                  <span className="text-white/40">Sous-total: {order.subtotal.toLocaleString()} F</span>
                                  <p className="text-sm font-bold text-gold-300 mt-0.5">Total: {order.totalPrice.toLocaleString()} FCFA</p>
                                </div>

                                <button
                                  onClick={() => setEditingOrder(order)}
                                  className="bg-[#242424] hover:bg-[#333] text-gold-400 px-2.5 py-1.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors mr-2"
                                  title="Modifier la commande"
                                >
                                  <Edit3 size={11} fill="none" />
                                  <span>Modifier</span>
                                </button>

                                <button
                                  onClick={() => handlePrintReceipt(order)}
                                  className="bg-gold-500 hover:bg-gold-400 text-black px-2.5 py-1.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider flex items-center space-x-1 cursor-pointer transition-colors"
                                  title="Imprimer le ticket de cuisine / livraison"
                                >
                                  <Printer size={12} />
                                  <span>Imprimer Ticket</span>
                                </button>

                                <button
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="text-white/20 hover:text-red-400 p-2 rounded transition-colors"
                                  title="Archiver l'ordre"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SUB TAB: GALLERY EDITING */}
              {activeSubTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white">Gestion de la Galerie</h3>
                      <p className="text-white/50 text-xs sm:text-sm">Ajoutez, modifiez ou supprimez les visuels de l'établissement (salle, terrasse, plats, évènements).</p>
                    </div>
                    <button
                      id="btn-admin-add-photo"
                      onClick={() => setIsAddingPhoto(true)}
                      className="bg-gold-500 text-black font-semibold text-xs uppercase tracking-wider py-2.5 px-4 rounded hover:bg-gold-400 cursor-pointer flex items-center space-x-2"
                    >
                      <Plus size={14} />
                      <span>Ajouter une photo</span>
                    </button>
                  </div>

                  {/* Add photo modal */}
                  <AnimatePresence>
                    {isAddingPhoto && (
                      <motion.div
                        id="add-photo-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#181818] border border-white/10 rounded-xl p-6 mb-6"
                      >
                        <h4 className="font-serif text-base font-bold text-gold-400 mb-4 flex items-center space-x-2">
                          <Plus size={16} />
                          <span>Ajouter un nouveau visuel</span>
                        </h4>
                        
                        <form onSubmit={handleAddPhoto} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-mono text-white/50 mb-1">Catégorie de la photo</label>
                              <select
                                value={newPhoto.category}
                                onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value as any })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                              >
                                <option value="interior">Salle & Ambiance (Salle)</option>
                                <option value="exterior">Terrasse & Bar (Terrasse)</option>
                                <option value="dishes">Nos Assiettes (Mets)</option>
                                <option value="events">Réceptions & Événements</option>
                              </select>
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] uppercase font-mono text-white/50 mb-1">Description / Légende</label>
                              <input
                                type="text"
                                required
                                value={newPhoto.caption}
                                onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                                placeholder="Ex: Notre viande fondante braisée au charbon de bois..."
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-mono text-white/50 mb-1">Lien de l'image (URL HD Unsplash, CDN etc.)</label>
                            <input
                              type="text"
                              required
                              value={newPhoto.imageUrl}
                              onChange={(e) => setNewPhoto({ ...newPhoto, imageUrl: e.target.value })}
                              className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-[11px] text-white font-mono"
                              placeholder="https://images.unsplash.com/photo-..."
                            />
                            {newPhoto.imageUrl && (
                              <div className="mt-2 h-32 w-48 rounded overflow-hidden border border-white/10">
                                <img src={newPhoto.imageUrl} alt="Aperçu" className="w-full h-full object-referrer referrerPolicy='no-referrer'" referrerPolicy="no-referrer" />
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-3 pt-2">
                            <button
                              type="submit"
                              className="bg-gold-500 text-black font-semibold text-xs uppercase tracking-wider py-2 px-4 rounded hover:bg-gold-400 cursor-pointer"
                            >
                              Ajouter la photo
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsAddingPhoto(false)}
                              className="bg-[#242424] hover:bg-[#333] text-white font-semibold text-xs uppercase py-2 px-4 rounded cursor-pointer"
                            >
                              Annuler
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Edit photo modal */}
                  <AnimatePresence>
                    {editingPhoto && (
                      <motion.div
                        id="edit-photo-modal"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#181818] border border-gold-400/30 rounded-xl p-6 mb-6"
                      >
                        <h4 className="font-serif text-base font-bold text-gold-400 mb-4 flex items-center space-x-2">
                          <Edit3 size={16} fill="none" />
                          <span>Modifier la photo de la galerie</span>
                        </h4>
                        
                        <form onSubmit={handleUpdatePhoto} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-mono text-white/50 mb-1">Catégorie de la photo</label>
                              <select
                                value={editingPhoto.category}
                                onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value as any })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                              >
                                <option value="interior">Salle & Ambiance (Salle)</option>
                                <option value="exterior">Terrasse & Bar (Terrasse)</option>
                                <option value="dishes">Nos Assiettes (Mets)</option>
                                <option value="events">Réceptions & Événements</option>
                              </select>
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] uppercase font-mono text-white/50 mb-1">Description / Légende</label>
                              <input
                                type="text"
                                required
                                value={editingPhoto.caption}
                                onChange={(e) => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                                className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-xs text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-mono text-white/50 mb-1">Lien de l'image (URL HD)</label>
                            <input
                              type="text"
                              required
                              value={editingPhoto.imageUrl}
                              onChange={(e) => setEditingPhoto({ ...editingPhoto, imageUrl: e.target.value })}
                              className="w-full bg-[#121212] border border-white/10 rounded py-2 px-3 text-[11px] text-white font-mono"
                            />
                            {editingPhoto.imageUrl && (
                              <div className="mt-2 h-32 w-48 rounded overflow-hidden border border-white/10">
                                <img src={editingPhoto.imageUrl} alt="Aperçu" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-3 pt-2">
                            <button
                              type="submit"
                              className="bg-gold-500 text-black font-semibold text-xs uppercase tracking-wider py-2 px-4 rounded hover:bg-gold-400 cursor-pointer"
                            >
                              Enregistrer les modifications
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingPhoto(null)}
                              className="bg-[#242424] hover:bg-[#333] text-white font-semibold text-xs uppercase py-2 px-4 rounded cursor-pointer"
                            >
                              Annuler
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Photos Grid in admin panel */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryItems.map((photo) => (
                      <div 
                        key={photo.id}
                        className="bg-[#121212] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all flex flex-col justify-between"
                      >
                        <div className="relative h-44 bg-neutral-900">
                          <img 
                            src={photo.imageUrl} 
                            alt={photo.caption} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-3 left-3 bg-black/70 border border-white/10 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-mono text-gold-400">
                            {photo.category === 'interior' ? 'Salle' : photo.category === 'exterior' ? 'Terrasse' : photo.category === 'events' ? 'Évènement' : 'Mets'}
                          </span>
                        </div>
                        <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                          <p className="text-xs text-white/80 line-clamp-2 min-h-[2rem]">
                            {photo.caption}
                          </p>
                          <div className="flex items-center justify-between border-t border-white/5 pt-3">
                            <button
                              onClick={() => setEditingPhoto(photo)}
                              className="text-gold-400 hover:text-gold-300 font-mono text-[10px] uppercase font-bold tracking-wider flex items-center space-x-1 cursor-pointer"
                            >
                              <Edit3 size={12} fill="none" />
                              <span>Modifier</span>
                            </button>
                            <button
                              onClick={() => handleDeletePhoto(photo.id)}
                              className="text-white/40 hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                              title="Supprimer la photo"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* Custom Alert/Toast overlay */}
      <AnimatePresence>
        {toast.isOpen && (
          <motion.div
            id="toast-notification"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[100] max-w-sm w-full bg-[#161616] border border-gold-400/30 p-4 rounded-xl shadow-2xl flex items-start gap-3"
          >
            <div className={`p-1.5 rounded-lg ${toast.type === 'success' ? 'bg-gold-500/20 text-gold-400' : 'bg-red-500/20 text-red-400'}`}>
              <CheckCircle2 size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-white font-serif uppercase tracking-wider">
                {toast.type === 'success' ? 'Succès !' : 'Notification'}
              </h5>
              <p className="text-xs text-white/70 mt-0.5 leading-normal font-sans">
                {toast.message}
              </p>
            </div>
            <button 
              onClick={() => setToast(prev => ({ ...prev, isOpen: false }))}
              className="text-white/40 hover:text-white transition-colors p-0.5 rounded cursor-pointer"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Confirm Dialog Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[99] overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              id="confirm-modal-box"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#121212] border border-white/10 rounded-xl max-w-md w-full p-6 shadow-2xl relative"
            >
              <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2 mb-2">
                <ShieldAlert className={confirmModal.danger ? "text-red-500" : "text-gold-400"} size={20} />
                <span>{confirmModal.title}</span>
              </h4>
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-6">
                {confirmModal.message}
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="bg-[#242424] hover:bg-[#333] text-white hover:text-white/90 text-xs font-semibold uppercase tracking-wider py-2 px-4 rounded cursor-pointer transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    confirmModal.onConfirm();
                  }}
                  className={`text-xs font-mono font-bold uppercase tracking-wider py-2 px-4 rounded cursor-pointer transition-colors ${
                    confirmModal.danger 
                      ? 'bg-red-600 hover:bg-red-500 text-white' 
                      : 'bg-gold-500 hover:bg-gold-400 text-black'
                  }`}
                >
                  {confirmModal.confirmText || 'Confirmer'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
