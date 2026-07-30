export type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export type DishVariant = {
  id: string;
  name: string;
  price: number;
};

export type Dish = {
  id: string;

  name: string;

  categories: string[];

  description: string;

  image: string;

  variants: DishVariant[];

  featured?: boolean;

  available: boolean;

  soldOut?: boolean;

  tag?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
};

export const categories: Category[] = [
  {
    id: "breakfast",
    name: "Breakfast",
    description: "Slow mornings, warm plates",
    image:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "lunch",
    name: "Lunch",
    description: "Midday comfort, home-cooked",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "dinner",
    name: "Dinner",
    description: "Gather around the table",
    image:
      "https://images.unsplash.com/photo-1547573854-74d2a71d0826?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "desserts",
    name: "Desserts",
    description: "A sweet ending, always",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
  },
];

export const dishes: Dish[] = [
  {
    id: "channay",
    name: "Home Style Channay",
    categories: ["breakfast"],

    description:
      "Fresh homemade channay cooked with traditional spices and served hot.",

    image: "/images/dishes/channay.jpg",

    variants: [
      {
        id: "half",
        name: "Half Plate",
        price: 150,
      },
      {
        id: "full",
        name: "Full Plate",
        price: 250,
      },
    ],

    featured: true,

    available: true,

    tag: "Best Seller",
  },
  {
    id: "sada-paratha",
    name: "Sada Paratha",
    categories: ["breakfast"],

    description: "Fresh homemade paratha prepared daily with pure ingredients.",

    image: "/images/dishes/sada-paratha.jpg",

    variants: [
      {
        id: "regular",
        name: "Regular",
        price: 80,
      },
    ],

    featured: false,

    available: true,
  },
  {
    id: "Aloo-paratha",
    name: "Aloo Paratha",
    categories: ["breakfast"],

    description: "Fresh homemade paratha prepared daily with pure ingredients.",

    image: "/images/dishes/aloo-paratha.jpg",

    variants: [
      {
        id: "regular",
        name: "Regular",
        price: 150,
      },
    ],

    featured: false,

    available: true,
  },
  {
    id: "chiken-karahi",
    name: "Home Style Chicken Karahi",
    categories: ["lunch"],

    description:
      "Tender chicken cooked in a rich tomato gravy with freshly ground traditional spices.",

    image: "/images/dishes/chicken-karahi.jpg",

    variants: [
      {
        id: "half",
        name: "Half Plate",
        price: 150,
      },
      {
        id: "full",
        name: "Full Plate",
        price: 250,
      },
    ],

    featured: true,

    available: true,

    tag: "Best Seller",
  },
  {
    id: "dal-mash",
    name: "Home Style dal-mash",
    categories: ["lunch"],

    description:
      "Slow-cooked white lentils with a creamy texture and authentic homemade flavor.",

    image: "/images/dishes/dal-mash.jpg",

    variants: [
      {
        id: "half",
        name: "Half Plate",
        price: 150,
      },
      {
        id: "full",
        name: "Full Plate",
        price: 200,
      },
    ],

    featured: true,

    available: true,

    tag: "Best Seller",
  },
  {
    id: "Ladyfinger (Bhindi)",
    name: "Home Style Ladyfinger",
    categories: ["lunch"],

    description:
      "Fresh ladyfinger cooked with onions, tomatoes, and aromatic homemade spices.",

    image: "/images/dishes/ladyfinger.jpg",

    variants: [
      {
        id: "half",
        name: "Half Plate",
        price: 150,
      },
      {
        id: "full",
        name: "Full Plate",
        price: 200,
      },
    ],

    featured: true,

    available: true,

  },
  {
    id: "Aloo Chicken",
    name: "Aloo Chicken",
    categories: ["dinner"],

    description: "Homemade chicken and potatoes cooked together in a flavorful traditional curry.",

    image: "/images/dishes/aloo-chicken.jpg",

    variants: [
      {
        id: "half",
        name: "Half Plate",
        price: 150,
      },
      {
        id: "full",
        name: "Full Plate",
        price: 200,
      },
    ],

    featured: false,

    available: true,
  },
  {
    id: "aloo-qeema",
    name: "Qeema",
    categories: ["dinner"],

    description: "Minced beef/chicken cooked with potatoes and traditional Pakistani spices.",

    image: "/images/dishes/aloo-qeema.jpg",

    variants: [
      {
        id: "half",
        name: "Half Plate",
        price: 150,
      },
      {
        id: "full",
        name: "Full Plate",
        price: 200,
      },
    ],

    featured: true,

    available: true,
  },
  {
    id: "qadoo-chicken",
    name: "qadoo-chicken",
    categories: ["dinner"],

    description: "Soft pumpkin cooked with tender chicken in a mildly spiced homemade curry.",

    image: "/images/dishes/qadoo-chicken.jpg",

    variants: [
      {
        id: "half",
        name: "Half Plate",
        price: 150,
      },
      {
        id: "full",
        name: "Full Plate",
        price: 200,
      },
    ],

    featured: false,

    available: true,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Ayesha R.",
    location: "Bahawalpur",
    quote:
      "Every order tastes like it came from my own kitchen, only I didn't have to cook it. The biryani is exactly like my mother makes.",
    rating: 5,
  },
  {
    id: "2",
    name: "Bilal K.",
    location: "Bahawalpur",
    quote:
      "Fast delivery, warm food, and packaging that actually keeps the karahi hot. This is the closest thing to a home-cooked dinner on a busy night.",
    rating: 5,
  },
  {
    id: "3",
    name: "Sana M.",
    location: "Bahawalpur",
    quote:
      "I order the daal mash every week for my kids. Simple, honest food without any of the usual restaurant heaviness.",
    rating: 4,
  },
];
// =============================
// Restaurant Information
// =============================

export type RestaurantInfo = {
  name: string;
  tagline: string;
  description: string;

  phone: string;
  whatsapp: string;
  email: string;

  address: string;
  city: string;

  businessHours: {
    days: string;

    breakfast: {
      open: string;
      close: string;
    };

    lunch: {
      open: string;
      close: string;
    };

    dinner: {
      open: string;
      close: string;
    };
  };

  social: {
    facebook: string;
    instagram: string;
    tiktok: string;
  };
};

export const restaurantInfo: RestaurantInfo = {
  name: "Home Made Food",

  tagline: "Fresh Homemade Meals Delivered Daily",

  description:
    "Fresh homemade Pakistani food prepared with quality ingredients and delivered across Bahawalpur.",

  phone: "+92 300 1234567",

  whatsapp: "+923001234567",

  email: "hello@homemadefood.pk",

  address: "Model Town",

  city: "Bahawalpur",

  businessHours: {
    days: "Monday - Sunday",

    breakfast: {
      open: "5:00 AM",
      close: "10:00 AM",
    },

    lunch: {
      open: "12:00 PM",
      close: "3:00 PM",
    },

    dinner: {
      open: "6:00 PM",
      close: "8:00 PM",
    },
  },

  social: {
    facebook: "#",
    instagram: "#",
    tiktok: "#",
  },
};