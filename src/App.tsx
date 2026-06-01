import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import MenuSection from './components/MenuSection';
import GallerySection from './components/GallerySection';
import BookingForm from './components/BookingForm';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import AdminPanel from './components/AdminPanel';
import AIChatbot from './components/AIChatbot';

// New system component imports
import DailySpecials from './components/DailySpecials';
import CustomizationModal from './components/CustomizationModal';
import OrderCartModal from './components/OrderCartModal';
import TikTokFeed from './components/TikTokFeed';

import { 
  MenuItem, Booking, ContactMessage, Promotion, RestaurantConfig, GalleryItem,
  DailySpecial, Order, CustomizedCartItem, PromotionalBanner
} from './types';
import { 
  getStoredMenu, saveStoredMenu,
  getStoredConfig, saveStoredConfig,
  getStoredPromotions, saveStoredPromotions,
  getStoredGallery, saveStoredGallery,
  getStoredBookings, saveStoredBookings,
  getStoredMessages, saveStoredMessages,
  getStoredDailySpecials, saveStoredDailySpecials,
  getStoredOrders, saveStoredOrders,
  getStoredBanners, saveStoredBanners,
  REVIEWS
} from './data';

import { Award, Heart, MessageSquare, Star } from 'lucide-react';

let idCounter = 0;
const generateUniqueId = (prefix: string): string => {
  idCounter++;
  const rand = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `${prefix}-${Date.now()}-${idCounter}-${rand}`;
};

export default function App() {
  // Centralized State Managers
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [config, setConfig] = useState<RestaurantConfig | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  
  // New States for Interactive Orders & Specials
  const [dailySpecials, setDailySpecials] = useState<DailySpecial[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CustomizedCartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | DailySpecial | null>(null);
  const [banners, setBanners] = useState<PromotionalBanner[]>([]);
  
  // Navigation & Modal triggers
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Load from Local Storage on initial render
  useEffect(() => {
    setMenuItems(getStoredMenu());
    setBookings(getStoredBookings());
    setMessages(getStoredMessages());
    setPromotions(getStoredPromotions());
    setConfig(getStoredConfig());
    setGalleryItems(getStoredGallery());
    setDailySpecials(getStoredDailySpecials());
    setOrders(getStoredOrders());
    setBanners(getStoredBanners());

    const savedCart = localStorage.getItem('gaspard_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          const processed: CustomizedCartItem[] = [];
          const seenIds = new Set<string>();
          parsed.forEach((c, idx) => {
            if (c && c.item) {
              let cartId = c.cartId;
              if (!cartId || seenIds.has(cartId)) {
                cartId = `item-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`;
              }
              seenIds.add(cartId);
              processed.push({
                ...c,
                cartId
              });
            }
          });
          setCart(processed);
          localStorage.setItem('gaspard_cart', JSON.stringify(processed));
        }
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Sync state helpers to update React state & persist in local storage
  const handleUpdateMenuItems = (items: MenuItem[]) => {
    setMenuItems(items);
    saveStoredMenu(items);
  };

  const handleUpdateBookings = (updatedBookings: Booking[]) => {
    setBookings(updatedBookings);
    saveStoredBookings(updatedBookings);
  };

  const handleUpdateMessages = (updatedMessages: ContactMessage[]) => {
    setMessages(updatedMessages);
    saveStoredMessages(updatedMessages);
  };

  const handleUpdatePromotions = (updatedPromos: Promotion[]) => {
    setPromotions(updatedPromos);
    saveStoredPromotions(updatedPromos);
  };

  const handleUpdateConfig = (cfg: RestaurantConfig) => {
    setConfig(cfg);
    saveStoredConfig(cfg);
  };

  // State syncers for Daily Specials, Orders and Shopping Cart
  const handleUpdateDailySpecials = (specials: DailySpecial[]) => {
    setDailySpecials(specials);
    saveStoredDailySpecials(specials);
  };

  const handleUpdateOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    saveStoredOrders(newOrders);
  };

  const handleUpdateBanners = (updatedBanners: PromotionalBanner[]) => {
    setBanners(updatedBanners);
    saveStoredBanners(updatedBanners);
  };

  const handleUpdateGallery = (updatedGallery: GalleryItem[]) => {
    setGalleryItems(updatedGallery);
    saveStoredGallery(updatedGallery);
  };

  const handleAddToCart = (customCartItem: Omit<CustomizedCartItem, 'cartId'>) => {
    const newCartItem: CustomizedCartItem = {
      cartId: generateUniqueId('item'),
      ...customCartItem
    };
    const updated = [...cart, newCartItem];
    setCart(updated);
    localStorage.setItem('gaspard_cart', JSON.stringify(updated));
  };

  const handleRemoveFromCart = (cartId: string) => {
    const updated = cart.filter(c => c.cartId !== cartId);
    setCart(updated);
    localStorage.setItem('gaspard_cart', JSON.stringify(updated));
  };

  const handleUpdateCartQuantity = (cartId: string, quantity: number) => {
    const updated = cart.map(c => {
      if (c.cartId === cartId) {
        return { ...c, quantity };
      }
      return c;
    });
    setCart(updated);
    localStorage.setItem('gaspard_cart', JSON.stringify(updated));
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem('gaspard_cart');
  };

  const handleAddNewOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      id: generateUniqueId('ORD'),
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    saveStoredOrders(updated);
  };

  // Add a booking from the customer form
  const handleAddBooking = (formData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const newBooking: Booking = {
      id: generateUniqueId('book'),
      ...formData,
      status: 'pending', // default pending review by admin
      createdAt: new Date().toISOString()
    };
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    saveStoredBookings(updated);
  };

  // Add a message from the contact form
  const handleAddMessage = (formData: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    const newMessage: ContactMessage = {
      id: generateUniqueId('msg'),
      ...formData,
      status: 'unread',
      createdAt: new Date().toISOString()
    };
    const updated = [newMessage, ...messages];
    setMessages(updated);
    saveStoredMessages(updated);
  };

  // Handle programmatic scrolling from links/ctas
  const handleScrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of sticky navigation
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Active section tracking on scroll
  useEffect(() => {
    const handleScrollDetect = () => {
      const scrollPosition = window.scrollY + 200; // Trigger offset
      const sections = ['home', 'about', 'menu', 'gallery', 'contact', 'booking'];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollDetect);
    return () => window.removeEventListener('scroll', handleScrollDetect);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] selection:bg-gold-500 selection:text-black">
      
      {/* Upper sticky header menu */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAdmin={() => setIsAdminOpen(true)} 
        cartCount={cart.reduce((acc, curr) => acc + curr.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        banners={banners}
      />

      {/* Main Sections flow */}
      <main>
        {/* Landings & Call to Actions */}
        <Hero onScrollToSection={handleScrollToSection} />

        {/* Storytelling Brand segments */}
        <About />

        {/* Daily specials Ardoise section */}
        <DailySpecials specials={dailySpecials} onSelectSpecial={(special) => setCustomizingItem(special)} />

        {/* Dynamic Interactive Dishes Selector */}
        <MenuSection menuItems={menuItems} onSelectItem={(item) => setCustomizingItem(item)} />

        {/* Testimonials highlight center - Localized Abidjan reviews */}
        <section className="py-20 bg-gradient-to-r from-gold-950/20 via-neutral-950 to-gold-950/10 border-y border-gold-500/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-gold-400 font-mono text-xs uppercase tracking-[0.3em] mb-2 block">
                Avis de nos convives
              </span>
              <h2 className="font-serif text-3xl font-bold text-white">L'expérience vécue à Angré</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {REVIEWS.map((rev) => (
                <div 
                  key={rev.id} 
                  id={`review-${rev.id}`}
                  className="bg-[#121111]/90 rounded-xl p-6 border border-white/5 flex flex-col justify-between hover:border-gold-400/10 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={`${rev.id}-star-${i}`} size={14} className="fill-gold-400 text-gold-400" />
                      ))}
                    </div>
                    <p className="text-white/80 leading-relaxed text-xs sm:text-sm italic">
                      &ldquo;{rev.text}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5 text-xs">
                    <span className="font-serif font-bold text-white">{rev.author}</span>
                    <span className="text-white/30 font-mono">{rev.source}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center text-xs text-white/40 font-mono">
              ★ Score moyen de <strong className="text-gold-300">4.9 / 5</strong> sur plus de 320 commentaires certifiés.
            </div>
          </div>
        </section>

        {/* Dynamic Live TikTok Feed preview */}
        <TikTokFeed />

        {/* Visual Lightboxes */}
        <GallerySection galleryItems={galleryItems} />

        {/* Booking Form receipt */}
        <BookingForm onAddBooking={handleAddBooking} />

        {/* Google Map coordinates & dynamic inbox form */}
        <ContactSection config={config} onAddMessage={handleAddMessage} />
      </main>

      {/* Dynamic footer */}
      <Footer 
        config={config}
        onScrollToSection={handleScrollToSection} 
        onOpenAdmin={() => setIsAdminOpen(true)} 
      />

      {/* Voice Call / Chat launchers */}
      <FloatingActions />

      {/* AI Virtual Concierge */}
      <AIChatbot onAddBooking={handleAddBooking} onAddMessage={handleAddMessage} />

      {/* Hidden Secure Admin Panel Modal (WordPress-like Custom CMS) */}
      {config && (
        <AdminPanel
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          menuItems={menuItems}
          setMenuItems={handleUpdateMenuItems}
          bookings={bookings}
          setBookings={handleUpdateBookings}
          messages={messages}
          setMessages={handleUpdateMessages}
          promotions={promotions}
          setPromotions={handleUpdatePromotions}
          config={config}
          setConfig={handleUpdateConfig}
          dailySpecials={dailySpecials}
          setDailySpecials={handleUpdateDailySpecials}
          orders={orders}
          setOrders={handleUpdateOrders}
          banners={banners}
          setBanners={handleUpdateBanners}
          galleryItems={galleryItems}
          setGalleryItems={handleUpdateGallery}
        />
      )}

      {/* Floating Interactive Shopping Overlays */}
      {customizingItem && (
        <CustomizationModal
          item={customizingItem}
          isOpen={!!customizingItem}
          onClose={() => setCustomizingItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {isCartOpen && (
        <OrderCartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveFromCart={handleRemoveFromCart}
          onPlaceOrder={handleAddNewOrder}
          onClearCart={handleClearCart}
        />
      )}

    </div>
  );
}
