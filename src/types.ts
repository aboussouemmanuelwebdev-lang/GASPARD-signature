export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'entrées' | 'salades' | 'pizzas' | 'grillades' | 'burgers' | 'desserts' | 'boissons';
  imageUrl: string;
  isPromotion?: boolean;
  promotionPrice?: number;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guestsCount: number;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  validUntil: string;
  isActive: boolean;
}

export interface OpeningHour {
  day: string;
  hours: string;
}

export interface RestaurantConfig {
  address: string;
  phone: string;
  email: string;
  openingHours: OpeningHour[];
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
}

export interface GalleryItem {
  id: string;
  category: 'interior' | 'exterior' | 'events' | 'dishes';
  imageUrl: string;
  caption: string;
}

export interface DailySpecial {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  badgeText?: string; // e.g., "Suggestion du Chef", "Spécialité Ivoirienne"
}

export interface CustomizedCartItem {
  cartId: string; // unique ID in the cart (to handle identical food with different customizations)
  item: MenuItem | DailySpecial;
  quantity: number;
  customInstructions: string;
  options: {
    spiceLevel?: 'doux' | 'moyen' | 'épicé' | 'piment_doublé';
    cookingDegree?: 'bleu' | 'saignant' | 'à point' | 'bien cuit';
    extraCheese?: boolean;
    choppedOnions?: boolean;
  };
}

export interface Order {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceType: 'pickup' | 'delivery'; // Pickup vs Delivery
  deliveryDistrict?: string; // Angré, Rivera, Zone 4, Biétry, Deux-Plateaux, etc.
  deliveryAddress?: string;
  pickupTime?: string;
  paymentMethod: 'cash' | 'momo_simulated';
  items: {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
    customInstructions: string;
    optionsSummary: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  totalPrice: number;
  status: 'pending' | 'preparing' | 'out_for_delivery' | 'ready_for_pickup' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface PromotionalBanner {
  id: string;
  text: string;
  isActive: boolean;
  bgColor?: string;
}

