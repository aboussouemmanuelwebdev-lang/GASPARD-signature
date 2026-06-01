import { MenuItem, RestaurantConfig, Booking, ContactMessage, Promotion, GalleryItem, DailySpecial, Order, PromotionalBanner } from './types';

export const INITIAL_MENU: MenuItem[] = [
  // Entrées
  {
    id: 'entree-1',
    name: "Carpaccio de Filet de Bœuf",
    description: "Fines tranches de filet de bœuf de Kobé, câpres, parmesan affiné 24 mois, roquette sauvage et huile de truffe blanche.",
    price: 12500,
    category: 'entrées',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    isAvailable: true
  },
  {
    id: 'entree-2',
    name: "Calamars croustillants au piment d'Espelette",
    description: "Calamars frais frits à la perfection, mayonnaise légère maison au citron vert et herbes fraîches.",
    price: 9500,
    category: 'entrées',
    imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
    isAvailable: true
  },
  // Salades
  {
    id: 'salade-1',
    name: "Salade Burrata Dorée",
    description: "Burrata crémeuse de 150g, tomates anciennes multicolores, pesto de basilic frais à la pistache, tuile de parmesan maison.",
    price: 11000,
    category: 'salades',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=800&q=80',
    isAvailable: true
  },
  {
    id: 'salade-2',
    name: "Salade Gaspard Signature",
    description: "Mélange gourmand de jeunes pousses, suprêmes de poulet grillé au miel, avocat de Côte d'Ivoire, chèvre chaud au thym et amandes effilées.",
    price: 9800,
    category: 'salades',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true
  },
  // Pizzas
  {
    id: 'pizza-1',
    name: "Pizza Tartufo & Rucola",
    description: "Crème de truffe noire fraîche, mozzarella fior di latte, champignons sautés, jambon de Parme affiné, copeaux de parmesan et roquette.",
    price: 14500,
    category: 'pizzas',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    isAvailable: true
  },
  {
    id: 'pizza-2',
    name: "Pizza Chef Signature",
    description: "Sur notre pâte à longue fermentation : sauce tomate signature, émincé de filet de bœuf mariné, oignons caramélisés, gorgonzola et filet d'huile épicée.",
    price: 13000,
    category: 'pizzas',
    imageUrl: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80',
    isAvailable: true,
    isPromotion: true,
    promotionPrice: 11500
  },
  // Grillades
  {
    id: 'grill-1',
    name: "Filet de Boeuf façon Signature (300g)",
    description: "Filet tendre cuit au four à charbon de bois, sauce foie gras ou sauce trois poivres, mille-feuille de pommes de terre à la crème.",
    price: 18500,
    category: 'grillades',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    isAvailable: true
  },
  {
    id: 'grill-2',
    name: "Brochettes de Gambas Flambées",
    description: "Gambas géantes marinées à la citronnelle et gingembre, flambées sous vos yeux au rhum vieux de prestige, riz parfumé au jasmin.",
    price: 22000,
    category: 'grillades',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    isAvailable: true
  },
  // Burgers
  {
    id: 'burger-1',
    name: "Le Gaspard Royal Burger",
    description: "Bacon de bœuf croustillant, steak Angus haché double de 180g, cheddar mâture coulant, oignons croustillants, sauce barbecue à la truffe sur pain brioché.",
    price: 12500,
    category: 'burgers',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    isAvailable: true
  },
  // Desserts
  {
    id: 'dessert-1',
    name: "Moelleux Chocolat Coeur Coulant Pistache",
    description: "Un classique revisité : cœur coulant à la pâte de pistache d'Italie pure, servi avec sa boule de glace artisanale à la vanille de Madagascar.",
    price: 6500,
    category: 'desserts',
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    isAvailable: true
  },
  {
    id: 'dessert-2',
    name: "Mille-Feuille Signature",
    description: "Pâte feuilletée inversée croustillante, crème diplomate à la vanille bourbon Bourbon et caramel au beurre salé.",
    price: 5500,
    category: 'desserts',
    imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80',
    isAvailable: true
  },
  // Boissons
  {
    id: 'boisson-1',
    name: "Cocktail Éclipse d'Or",
    description: "Création exclusive du barman : Rhum de prestige, liqueur de passion, fruit de la passion frais, sirop de vanille maison et paillettes d'or comestibles.",
    price: 7500,
    category: 'boissons',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    isAvailable: true
  },
  {
    id: 'boisson-2',
    name: "Infusion Passion Hibiscus (Sans Alcool)",
    description: "Infusion glacée de fleurs d'hibiscus de nos terroirs, purée de papaye et maracuja vert pressé froid.",
    price: 4500,
    category: 'boissons',
    imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
    isAvailable: true
  }
];

export const INITIAL_CONFIG: RestaurantConfig = {
  address: "Angré 8ème Tranche, en face de la pharmacie de la 8ème Tranche, Cocody, Abidjan, Côte d'Ivoire",
  phone: "07 00 00 60 82",
  email: "hassanfissai1988@gmail.com",
  openingHours: [
    { day: "Lundi", hours: "08:00 - 03:00" },
    { day: "Mardi", hours: "08:00 - 03:00" },
    { day: "Mercredi", hours: "08:00 - 03:00" },
    { day: "Jeudi", hours: "08:00 - 03:00" },
    { day: "Vendredi", hours: "08:00 - 03:00" },
    { day: "Samedi", hours: "08:00 - 03:00" },
    { day: "Dimanche", hours: "08:00 - 03:00" }
  ],
  whatsappNumber: "+2250700006082",
  instagramUrl: "https://instagram.com/gaspardsignature",
  facebookUrl: "https://facebook.com/gaspardsignature",
  tiktokUrl: "https://www.tiktok.com/@gaspardsignature_"
};

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    title: "Dimanche En Famille",
    description: "Pour l'achat de 2 pizzas grandes tailles, la 3ème vous est offerte ! Valable uniquement pour les consommations sur place en famille.",
    validUntil: "Chaque Dimanche",
    isActive: true
  },
  {
    id: 'promo-2',
    title: "Afterwork Gastronomique",
    description: "Du mardi au jeudi soir de 17h à 19h, une sélection de nos cocktails signatures à -30% accompagnée d'une planche d'entrées offertes.",
    validUntil: "Fin du mois",
    isActive: true
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    caption: 'Notre salle principale aux touches dorées et design feutré'
  },
  {
    id: 'gal-2',
    category: 'interior',
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
    caption: 'Lumière chaleureuse pour vos dîners professionnels et familiaux'
  },
  {
    id: 'gal-3',
    category: 'exterior',
    imageUrl: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=1200&q=80',
    caption: 'Notre vaste terrasse arborée à la 8ème Tranche'
  },
  {
    id: 'gal-4',
    category: 'dishes',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    caption: 'Une viande fondante et parfaitement saisie au charbon'
  },
  {
    id: 'gal-5',
    category: 'dishes',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    caption: 'Pizzas cuites à ultra-haute température pour un croustillant unique'
  },
  {
    id: 'gal-6',
    category: 'events',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
    caption: 'Soirées dégustations privées et anniversaires haut de gamme'
  }
];

export const REVIEWS = [
  {
    id: 'rev-1',
    author: "Marc-Antoine Koffi",
    source: "Google Reviews",
    rating: 5,
    text: "Un endroit exceptionnel à l'Angré 8ème Tranche. Le filet de bœuf est d'une tendresse absolue et le service est digne d'un grand hôtel. Une adresse signature à recommander !",
    date: "Il y a 2 semaines"
  },
  {
    id: 'rev-2',
    author: "Awa Diarra",
    source: "Facebook Recommendation",
    rating: 5,
    text: "Les pizzas sont tout simplement les meilleures de Cocody. La pâte est légère, aérée et les garnitures de très grande qualité. Le cadre est tout à fait premium, parfait pour les repas de famille.",
    date: "Il y a 3 jours"
  },
  {
    id: 'rev-3',
    author: "Jean-Philippe Brou",
    source: "Google Reviews",
    rating: 5,
    text: "Une très belle surprise ! La déco noire et or est très soignée, la carte des vins est magnifique et le chef maîtrise parfaitement l'art des grillades au feu de bois.",
    date: "Il y a 1 mois"
  }
];

// Helper functions for Local Storage Persistence
const deduplicateById = <T extends { id: string }>(arr: T[]): T[] => {
  if (!Array.isArray(arr)) return [];
  const map = new Map<string, T>();
  arr.forEach((item, idx) => {
    if (item) {
      let id = item.id;
      if (!id || typeof id !== 'string') {
        id = `dyn-id-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      }
      const copiedItem = { ...item, id };
      map.set(id, copiedItem as T);
    }
  });
  return Array.from(map.values());
};

export const getStoredMenu = (): MenuItem[] => {
  const data = localStorage.getItem('gaspard_menu');
  if (!data) {
    localStorage.setItem('gaspard_menu', JSON.stringify(INITIAL_MENU));
    return INITIAL_MENU;
  }
  try {
    return deduplicateById(JSON.parse(data));
  } catch {
    return INITIAL_MENU;
  }
};

export const saveStoredMenu = (menu: MenuItem[]) => {
  localStorage.setItem('gaspard_menu', JSON.stringify(deduplicateById(menu)));
};

export const getStoredConfig = (): RestaurantConfig => {
  const data = localStorage.getItem('gaspard_config');
  if (!data) {
    localStorage.setItem('gaspard_config', JSON.stringify(INITIAL_CONFIG));
    return INITIAL_CONFIG;
  }
  try {
    const parsed = JSON.parse(data);
    let updated = false;
    if (!parsed.tiktokUrl || parsed.tiktokUrl === "https://tiktok.com/@gaspardsignature") {
      parsed.tiktokUrl = "https://www.tiktok.com/@gaspardsignature_";
      updated = true;
    }
    // Migrate old opening hours (e.g. 3-day blocks or old times) to the true hours
    if (!parsed.openingHours || parsed.openingHours.length !== 7 || parsed.openingHours[0]?.hours?.includes("11:30") || parsed.openingHours[0]?.hours?.includes("11h30")) {
      parsed.openingHours = INITIAL_CONFIG.openingHours;
      updated = true;
    }
    // Migrate old email address
    if (!parsed.email || parsed.email === "contact@gaspard-signature.ci") {
      parsed.email = "hassanfissai1988@gmail.com";
      updated = true;
    }
    if (updated) {
      localStorage.setItem('gaspard_config', JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return INITIAL_CONFIG;
  }
};

export const saveStoredConfig = (config: RestaurantConfig) => {
  localStorage.setItem('gaspard_config', JSON.stringify(config));
};

export const getStoredPromotions = (): Promotion[] => {
  const data = localStorage.getItem('gaspard_promotions');
  if (!data) {
    localStorage.setItem('gaspard_promotions', JSON.stringify(INITIAL_PROMOTIONS));
    return INITIAL_PROMOTIONS;
  }
  try {
    return deduplicateById(JSON.parse(data));
  } catch {
    return INITIAL_PROMOTIONS;
  }
};

export const saveStoredPromotions = (promotions: Promotion[]) => {
  localStorage.setItem('gaspard_promotions', JSON.stringify(deduplicateById(promotions)));
};

export const INITIAL_BANNERS: PromotionalBanner[] = [
  {
    id: 'banner-1',
    text: "✨ Grand Opening Gaspard Signature ! Découvrez notre ardoise de suggestions fraîches et nos grillades d'exception. ✨",
    isActive: true,
    bgColor: "bg-gold-500 text-black"
  },
  {
    id: 'banner-2',
    text: "🛵 Livraison à Abidjan (Angré, Zone 4, Biétry...) avec des frais de service très bas. Commandez en ligne dès maintenant !",
    isActive: true,
    bgColor: "bg-neutral-900 border-b border-gold-400/20 text-gold-400"
  }
];

export const getStoredBanners = (): PromotionalBanner[] => {
  const data = localStorage.getItem('gaspard_banners');
  if (!data) {
    localStorage.setItem('gaspard_banners', JSON.stringify(INITIAL_BANNERS));
    return INITIAL_BANNERS;
  }
  try {
    return deduplicateById(JSON.parse(data));
  } catch {
    return INITIAL_BANNERS;
  }
};

export const saveStoredBanners = (banners: PromotionalBanner[]) => {
  localStorage.setItem('gaspard_banners', JSON.stringify(deduplicateById(banners)));
};

export const getStoredGallery = (): GalleryItem[] => {
  const data = localStorage.getItem('gaspard_gallery');
  if (!data) {
    localStorage.setItem('gaspard_gallery', JSON.stringify(INITIAL_GALLERY));
    return INITIAL_GALLERY;
  }
  try {
    return deduplicateById(JSON.parse(data));
  } catch {
    return INITIAL_GALLERY;
  }
};

export const saveStoredGallery = (gallery: GalleryItem[]) => {
  localStorage.setItem('gaspard_gallery', JSON.stringify(deduplicateById(gallery)));
};

export const getStoredBookings = (): Booking[] => {
  const data = localStorage.getItem('gaspard_bookings');
  if (!data) {
    const defaultBookings: Booking[] = [
      {
        id: 'book-1',
        firstName: 'Christian',
        lastName: 'Kouassi',
        phone: '07 05 12 34 56',
        email: 'c.kouassi@gmail.com',
        date: '2026-06-05',
        time: '20:00',
        guestsCount: 4,
        message: 'Table en bordure de terrasse s\'il vous plaît. Fiançailles.',
        status: 'confirmed',
        createdAt: new Date().toISOString()
      },
      {
        id: 'book-2',
        firstName: 'Sonia',
        lastName: 'Ehouman',
        phone: '05 02 88 11 22',
        email: 'sonia.e@yahoo.ci',
        date: '2026-06-06',
        time: '13:30',
        guestsCount: 2,
        message: 'Déjeuner d\'affaires rapide.',
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('gaspard_bookings', JSON.stringify(defaultBookings));
    return defaultBookings;
  }
  try {
    return deduplicateById(JSON.parse(data));
  } catch {
    return [];
  }
};

export const saveStoredBookings = (bookings: Booking[]) => {
  localStorage.setItem('gaspard_bookings', JSON.stringify(deduplicateById(bookings)));
};

export const getStoredMessages = (): ContactMessage[] => {
  const data = localStorage.getItem('gaspard_messages');
  if (!data) {
    const defaultMessages: ContactMessage[] = [
      {
        id: 'msg-1',
        name: 'Dominique Bamba',
        email: 'd.bamba@entreprise.ci',
        phone: '01 02 03 04 05',
        subject: 'Demande de devis événementiel corporate',
        message: 'Bonjour, nous souhaiterions privatiser la terrasse pour un cocktail dînatoire de 50 personnes le 18 Juin en fin d\'après-midi. Merci de nous recontacter pour les tarifs de buffet.',
        status: 'unread',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('gaspard_messages', JSON.stringify(defaultMessages));
    return defaultMessages;
  }
  try {
    return deduplicateById(JSON.parse(data));
  } catch {
    return [];
  }
};

export const saveStoredMessages = (messages: ContactMessage[]) => {
  localStorage.setItem('gaspard_messages', JSON.stringify(deduplicateById(messages)));
};

export const INITIAL_DAILY_SPECIALS: DailySpecial[] = [
  {
    id: 'special-1',
    name: "Carré d'Agneau en Croûte d'Herbes de Côte d'Ivoire",
    description: "Tendres filets d'agneau cuits à cœur au four à bois, croûte d'herbes aromatiques broyées, servi avec un alloco doré croustillant et asperges glacées.",
    price: 16500,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    badgeText: "Recommandation du Chef"
  },
  {
    id: 'special-2',
    name: "Capitaine Braisé Signature du Grand-Bassin (Entier)",
    description: "Splendide capitaine frais braisé délicatement à l'étouffée, sauce herbes aromatiques locales, oignons frais râpés et piment doux concassé, servi avec son attiéké au beurre.",
    price: 18500,
    imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    badgeText: "Marché du Jour"
  },
  {
    id: 'special-3',
    name: "Pizza Royale Saumon & Caviar de Moutarde",
    description: "Sauce crème fraîche infusée à l'aneth sauvage, mozzarella fior di latte râpée, tranches de saumon sauvage fumé, câpres géantes et gouttes de condiment de moutarde ancienne.",
    price: 15500,
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    badgeText: "Édition Limitée"
  }
];

export const getStoredDailySpecials = (): DailySpecial[] => {
  const data = localStorage.getItem('gaspard_daily_specials');
  if (!data) {
    localStorage.setItem('gaspard_daily_specials', JSON.stringify(INITIAL_DAILY_SPECIALS));
    return INITIAL_DAILY_SPECIALS;
  }
  try {
    return deduplicateById(JSON.parse(data));
  } catch {
    return INITIAL_DAILY_SPECIALS;
  }
};

export const saveStoredDailySpecials = (specials: DailySpecial[]) => {
  localStorage.setItem('gaspard_daily_specials', JSON.stringify(deduplicateById(specials)));
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-W8A9B2',
    clientName: 'Koffi Emmanuel',
    clientPhone: '07 48 55 99 22',
    clientEmail: 'emmanuel.koffi@gmail.com',
    serviceType: 'delivery',
    deliveryDistrict: 'Deux Plateaux',
    deliveryAddress: 'Avenue Jean Paul II, Résidence Palms',
    paymentMethod: 'momo_simulated',
    items: [
      {
        itemId: 'pizza-2',
        name: 'Pizza Chef Signature',
        price: 11500,
        quantity: 2,
        customInstructions: 'Pâte bien cuite, piment à part s\'il vous plaît.',
        optionsSummary: 'Épicé, Supplément fromage'
      }
    ],
    subtotal: 23000,
    deliveryFee: 2000,
    totalPrice: 25000,
    status: 'preparing',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 mins ago
  },
  {
    id: 'ORD-R1K4K9',
    clientName: 'Saran Traoré',
    clientPhone: '05 06 12 34 22',
    serviceType: 'pickup',
    pickupTime: '20:15',
    paymentMethod: 'cash',
    items: [
      {
        itemId: 'grill-1',
        name: 'Filet de Boeuf façon Signature (300g)',
        price: 18500,
        quantity: 1,
        customInstructions: 'Cuisson saignante.',
        optionsSummary: 'Saignant'
      },
      {
        itemId: 'boisson-2',
        name: 'Infusion Passion Hibiscus (Sans Alcool)',
        price: 4500,
        quantity: 2,
        customInstructions: 'Très glacé.',
        optionsSummary: ''
      }
    ],
    subtotal: 27500,
    deliveryFee: 0,
    totalPrice: 27500,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

export const getStoredOrders = (): Order[] => {
  const data = localStorage.getItem('gaspard_orders');
  if (!data) {
    localStorage.setItem('gaspard_orders', JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }
  try {
    return deduplicateById(JSON.parse(data));
  } catch {
    return INITIAL_ORDERS;
  }
};

export const saveStoredOrders = (orders: Order[]) => {
  localStorage.setItem('gaspard_orders', JSON.stringify(deduplicateById(orders)));
};

