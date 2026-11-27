export function assetUrl(relativePath) {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = relativePath.replace(/^\/+/, '');
  return `${cleanBase}${cleanPath}`;
}

export const ENQUIRY_API_ENDPOINT =
  import.meta.env.VITE_ENQUIRY_API_URL?.trim() || '/api/enquiry';

export const BOUTIQUE_CONFIG = {
  name: import.meta.env.VITE_BOUTIQUE_NAME || 'SuiSaaj',
  tagline: import.meta.env.VITE_BOUTIQUE_TAGLINE || 'Ladies Boutique & Bespoke Tailoring',
  phoneDisplay: import.meta.env.VITE_PHONE_DISPLAY || '+91 98765 43210',
  phoneRaw: import.meta.env.VITE_PHONE_RAW || '+919876543210',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210',
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/suisaajboutique/',
  address:
    import.meta.env.VITE_BOUTIQUE_ADDRESS ||
    '24 Roseview Lane, Hauz Khas Enclave, New Delhi 110016',
  hours: 'Tue – Sun: 10:30 AM – 8:00 PM (Mon Closed)',
  mapsEmbedUrl:
    import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL ||
    'https://www.google.com/maps?q=Hauz+Khas+New+Delhi&output=embed',
  mapsLink:
    import.meta.env.VITE_GOOGLE_MAPS_LINK ||
    'https://maps.google.com/?q=Hauz+Khas+New+Delhi',
};

export const SERVICES = [
  {
    id: 'blouse-stitching',
    title: 'Blouse Stitching',
    badge: 'Signature Fit',
    description:
      'Padded, princess-cut, backless, and hand-embroidered saree blouses tailored for zero-gap comfort and graceful silhouettes.',
    icon: 'Scissors',
  },
  {
    id: 'suit-stitching',
    title: 'Suit Stitching',
    badge: 'Ethnic Elegance',
    description:
      'Anarkalis, straight-cut salwar suits, shararas, and churidars stitched with neat finishing, lining, and custom neckline detailing.',
    icon: 'Sparkles',
  },
  {
    id: 'kurti-stitching',
    title: 'Kurti Stitching',
    badge: 'Everyday & Festive',
    description:
      'Breezy daily-wear and festive kurtis with chikankari lace, potli buttons, pintucks, and flattering tailored cuts.',
    icon: 'Feather',
  },
  {
    id: 'bridal-wear',
    title: 'Bridal Wear',
    badge: 'Couture Studio',
    description:
      'Dream bridal lehengas, zardozi cholis, and reception ensembles crafted with multi-trial precision for your big day.',
    icon: 'Crown',
  },
  {
    id: 'party-wear',
    title: 'Party Wear',
    badge: 'Evening Glamour',
    description:
      'Draped Indo-western gowns, cape sets, and cocktail sarees designed to make every celebration unforgettable.',
    icon: 'Gem',
  },
  {
    id: 'dress-designing',
    title: 'Dress Designing',
    badge: 'Concept to Stitch',
    description:
      'Turn your Pinterest moodboard or fabric into a one-of-a-kind outfit with personalized sketching, trims, and styling guidance.',
    icon: 'Palette',
  },
  {
    id: 'alteration-services',
    title: 'Alteration Services',
    badge: 'Quick Turnaround',
    description:
      'Expert resizing, saree fall-pico, sleeve adjustments, and heirloom outfit restyling handled with meticulous care.',
    icon: 'Ruler',
  },
  {
    id: 'custom-tailoring',
    title: 'Custom Tailoring',
    badge: 'Made for You',
    description:
      'Individual body-measurement pattern drafting for all women’s ethnic and fusion wear—no standard size compromises.',
    icon: 'HeartHandshake',
  },
];

export const BUDGET_RANGES = [
  'Under ₹1,500',
  '₹1,500 – ₹3,500',
  '₹3,500 – ₹8,000',
  '₹8,000 – ₹20,000',
  '₹20,000+',
];

/**
 * Easy-to-replace gallery showcase items.
 * Simply update `image` paths inside `/public/images/` to swap photos later.
 */
export const GALLERY_ITEMS = [
  {
    id: 'blouse-couture',
    title: 'Rose-Gold Zari Sweetheart Blouse',
    category: 'Blouses',
    service: 'Blouse Stitching',
    image: assetUrl('images/gallery-blouse.jpg'),
    caption: 'Dusty blush raw silk with handworked cutdana & pearl scalloped edging',
  },
  {
    id: 'ivory-anarkali',
    title: 'Champagne Ivory Anarkali Suit',
    category: 'Suits & Kurtis',
    service: 'Suit Stitching',
    image: assetUrl('images/gallery-suit.jpg'),
    caption: 'Floor-length flared Anarkali with gotta patti & blush organza dupatta',
  },
  {
    id: 'blush-kurti',
    title: 'Chanderi Silk Festive Kurti',
    category: 'Suits & Kurtis',
    service: 'Kurti Stitching',
    image: assetUrl('images/gallery-kurti.jpg'),
    caption: 'Tailored pastel blush kurti finished with delicate lace and mirror accents',
  },
  {
    id: 'bridal-lehenga',
    title: 'Blush Zardozi Bridal Lehenga',
    category: 'Bridal & Party',
    service: 'Bridal Wear',
    image: assetUrl('images/gallery-bridal.jpg'),
    caption: 'Hand-crafted antique rose-gold bridal ensemble with sculpted choli fit',
  },
  {
    id: 'indo-western-gown',
    title: 'Draped Cape Party Gown',
    category: 'Bridal & Party',
    service: 'Party Wear',
    image: assetUrl('images/gallery-party.jpg'),
    caption: 'Flowing mauve-blush georgette gown with embellished sheer cape sleeves',
  },
  {
    id: 'custom-design-atelier',
    title: 'Bespoke Sketch & Drape Studio',
    category: 'Custom Design',
    service: 'Dress Designing',
    image: assetUrl('images/gallery-custom.jpg'),
    caption: 'Custom silhouette sketching, silk swatches, and precision bodice draping',
  },
];

export const WHY_CHOOSE_US = [
  {
    title: 'Affordable Pricing',
    description:
      'Transparent, honest stitching rates with clear estimates upfront—luxury boutique finishing without inflated price tags.',
    icon: 'BadgeIndianRupee',
  },
  {
    title: 'Perfect Fitting',
    description:
      'Custom measurement patterns and complimentary trial adjustments ensure every neckline, shoulder, and hem sits effortlessly.',
    icon: 'Ruler',
  },
  {
    title: 'Custom Designs',
    description:
      'Collaborate directly with our designer to choose necklines, sleeves, tassels, and embroidery tailored to your taste.',
    icon: 'Sparkles',
  },
  {
    title: 'Quality Stitching',
    description:
      'Interlocked seams, breathable cotton linings, neat piping, and reinforced closures built for lasting comfort.',
    icon: 'ShieldCheck',
  },
  {
    title: 'On-Time Delivery',
    description:
      'Committed turnaround schedules for everyday wear, weddings, and festive occasions so your outfit is ready when you need it.',
    icon: 'Clock',
  },
  {
    title: 'Personal Attention',
    description:
      'Warm one-on-one consultations where we listen to your style, fabric, and comfort preferences before cutting a single seam.',
    icon: 'Heart',
  },
];
