export interface Product {
  id: number;
  productName: string;
  price: number;
  currency: string;
  imageUrl: string;
  storeName: string;
  storeUrl: string;
  category: string;
  location: string;
  description: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: 1,
    productName: "بذور بندورة حمراء",
    price: 0.75,
    currency: "JOD",
    imageUrl: "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=300",
    storeName: "HIPPOS Seeds Agr. LLC",
    storeUrl: "https://hipposseeds.com",
    category: "بذور",
    location: "عمان",
    description: "بذور بندورة عالية الجودة ومقاومة للأمراض",
    inStock: true,
    rating: 4.5,
    reviews: 127
  },
  {
    id: 2,
    productName: "سماد عضوي طبيعي",
    price: 15.50,
    currency: "JOD",
    imageUrl: "https://images.pexels.com/photos/4505456/pexels-photo-4505456.jpeg?auto=compress&cs=tinysrgb&w=300",
    storeName: "الزراعة الحديثة",
    storeUrl: "https://modern-agriculture.jo",
    category: "أسمدة",
    location: "الزرقاء",
    description: "سماد عضوي طبيعي 100% لتحسين نمو النباتات",
    inStock: true,
    rating: 4.8,
    reviews: 89
  },
  {
    id: 3,
    productName: "بذور خيار هجين",
    price: 1.25,
    currency: "JOD",
    imageUrl: "https://images.pexels.com/photos/2329440/pexels-photo-2329440.jpeg?auto=compress&cs=tinysrgb&w=300",
    storeName: "بذور الأردن",
    storeUrl: "https://jordan-seeds.com",
    category: "بذور",
    location: "إربد",
    description: "بذور خيار هجين عالية الإنتاجية",
    inStock: true,
    rating: 4.3,
    reviews: 156
  },
  {
    id: 4,
    productName: "مبيد حشري طبيعي",
    price: 8.75,
    currency: "JOD",
    imageUrl: "https://images.pexels.com/photos/4505442/pexels-photo-4505442.jpeg?auto=compress&cs=tinysrgb&w=300",
    storeName: "الحماية الزراعية",
    storeUrl: "https://agri-protection.jo",
    category: "مبيدات",
    location: "عمان",
    description: "مبيد حشري آمن وفعال للنباتات",
    inStock: false,
    rating: 4.6,
    reviews: 73
  },
  {
    id: 5,
    productName: "بذور باذنجان بلدي",
    price: 0.95,
    currency: "JOD",
    imageUrl: "https://images.pexels.com/photos/321551/pexels-photo-321551.jpeg?auto=compress&cs=tinysrgb&w=300",
    storeName: "HIPPOS Seeds Agr. LLC",
    storeUrl: "https://hipposseeds.com",
    category: "بذور",
    location: "عمان",
    description: "بذور باذنجان بلدي أصيلة وعالية الجودة",
    inStock: true,
    rating: 4.7,
    reviews: 94
  },
  {
    id: 6,
    productName: "شتلات زيتون نبالي",
    price: 25.00,
    currency: "JOD",
    imageUrl: "https://images.pexels.com/photos/4932184/pexels-photo-4932184.jpeg?auto=compress&cs=tinysrgb&w=300",
    storeName: "مشتل الأردن",
    storeUrl: "https://jordan-nursery.com",
    category: "شتلات",
    location: "جرش",
    description: "شتلات زيتون نبالي مطعمة وجاهزة للزراعة",
    inStock: true,
    rating: 4.9,
    reviews: 45
  },
  {
    id: 7,
    productName: "أدوات الري بالتنقيط",
    price: 45.00,
    currency: "JOD",
    imageUrl: "https://images.pexels.com/photos/4505459/pexels-photo-4505459.jpeg?auto=compress&cs=tinysrgb&w=300",
    storeName: "تقنيات الري",
    storeUrl: "https://irrigation-tech.jo",
    category: "أدوات",
    location: "عمان",
    description: "نظام ري بالتنقيط كامل للحدائق المنزلية",
    inStock: true,
    rating: 4.4,
    reviews: 112
  },
  {
    id: 8,
    productName: "بذور فلفل حار",
    price: 1.50,
    currency: "JOD",
    imageUrl: "https://images.pexels.com/photos/159528/pepper-vegetables-red-green-159528.jpeg?auto=compress&cs=tinysrgb&w=300",
    storeName: "بذور الأردن",
    storeUrl: "https://jordan-seeds.com",
    category: "بذور",
    location: "إربد",
    description: "بذور فلفل حار عالية الجودة ومقاومة للحرارة",
    inStock: true,
    rating: 4.2,
    reviews: 67
  },
  {
    id: 9,
    productName: "سماد NPK متوازن",
    price: 18.25,
    currency: "JOD",
    imageUrl: "https://images.pexels.com/photos/4505445/pexels-photo-4505445.jpeg?auto=compress&cs=tinysrgb&w=300",
    storeName: "الزراعة المتقدمة",
    storeUrl: "https://advanced-agri.jo",
    category: "أسمدة",
    location: "الزرقاء",
    description: "سماد NPK متوازن للنمو الأمثل للنباتات",
    inStock: true,
    rating: 4.6,
    reviews: 201
  },
  {
    id: 10,
    productName: "بذور جزر نانت",
    price: 0.85,
    currency: "JOD",
    imageUrl: "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=300",
    storeName: "HIPPOS Seeds Agr. LLC",
    storeUrl: "https://hipposseeds.com",
    category: "بذور",
    location: "عمان",
    description: "بذور جزر نانت حلوة ومقرمشة",
    inStock: true,
    rating: 4.4,
    reviews: 89
  },
  {
    id: 11,
    productName: "مضخة مياه زراعية",
    price: 125.00,
    currency: "JOD",
    imageUrl: "https://images.pexels.com/photos/4505438/pexels-photo-4505438.jpeg?auto=compress&cs=tinysrgb&w=300",
    storeName: "المعدات الزراعية",
    storeUrl: "https://agri-equipment.jo",
    category: "أدوات",
    location: "عمان",
    description: "مضخة مياه قوية وموثوقة للري الزراعي",
    inStock: true,
    rating: 4.7,
    reviews: 34
  },
  {
    id: 12,
    productName: "شتلات ليمون بلدي",
    price: 12.50,
    currency: "JOD",
    imageUrl: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=300",
    storeName: "مشتل الحمضيات",
    storeUrl: "https://citrus-nursery.jo",
    category: "شتلات",
    location: "الكرك",
    description: "شتلات ليمون بلدي أصيلة ومثمرة",
    inStock: true,
    rating: 4.8,
    reviews: 76
  },
  {
    id: 13,
    productName: "بذور خس أمريكي",
    price: 0.65,
    currency: "JOD",
    imageUrl: "https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300",
    storeName: "بذور الأردن",
    storeUrl: "https://jordan-seeds.com",
    category: "بذور",
    location: "إربد",
    description: "بذور خس أمريكي طازجة وعالية الإنبات",
    inStock: true,
    rating: 4.3,
    reviews: 143
  },
  {
    id: 14,
    productName: "مبيد فطري عضوي",
    price: 12.00,
    currency: "JOD",
    imageUrl: "https://images.pexels.com/photos/4505441/pexels-photo-4505441.jpeg?auto=compress&cs=tinysrgb&w=300",
    storeName: "الحماية الطبيعية",
    storeUrl: "https://natural-protection.jo",
    category: "مبيدات",
    location: "عمان",
    description: "مبيد فطري عضوي آمن للنباتات والبيئة",
    inStock: true,
    rating: 4.5,
    reviews: 91
  },
  {
    id: 15,
    productName: "بذور بقدونس مجعد",
    price: 0.45,
    currency: "JOD",
    imageUrl: "https://images.pexels.com/photos/4505531/pexels-photo-4505531.jpeg?auto=compress&cs=tinysrgb&w=300",
    storeName: "HIPPOS Seeds Agr. LLC",
    storeUrl: "https://hipposseeds.com",
    category: "بذور",
    location: "عمان",
    description: "بذور بقدونس مجعد عطرية ومفيدة",
    inStock: true,
    rating: 4.6,
    reviews: 58
  },
  {
    id: 16,
    productName: "شتلات تفاح أحمر",
    price: 22.00,
    currency: "JOD",
    imageUrl: "https://images.pexels.com/photos/209439/pexels-photo-209439.jpeg?auto=compress&cs=tinysrgb&w=300",
    storeName: "مشتل الثمار",
    storeUrl: "https://fruit-nursery.jo",
    category: "شتلات",
    location: "الطفيلة",
    description: "شتلات تفاح أحمر حلو ومقرمش",
    inStock: true,
    rating: 4.7,
    reviews: 82
  },
  {
    id: 17,
    productName: "سماد البوتاسيوم",
    price: 14.75,
    currency: "JOD",
    imageUrl: "https://images.pexels.com/photos/4505454/pexels-photo-4505454.jpeg?auto=compress&cs=tinysrgb&w=300",
    storeName: "الزراعة الحديثة",
    storeUrl: "https://modern-agriculture.jo",
    category: "أسمدة",
    location: "الزرقاء",
    description: "سماد البوتاسيوم لتحسين جودة الثمار",
    inStock: true,
    rating: 4.4,
    reviews: 67
  },
  {
    id: 18,
    productName: "بذور كوسا بيضاء",
    price: 1.15,
    currency: "JOD",
    imageUrl: "https://images.pexels.com/photos/128420/pexels-photo-128420.jpeg?auto=compress&cs=tinysrgb&w=300",
    storeName: "بذور الأردن",
    storeUrl: "https://jordan-seeds.com",
    category: "بذور",
    location: "إربد",
    description: "بذور كوسا بيضاء طرية وشهية",
    inStock: true,
    rating: 4.5,
    reviews: 104
  },
  {
    id: 19,
    productName: "أدوات التقليم الاحترافية",
    price: 35.50,
    currency: "JOD",
    imageUrl: "https://images.pexels.com/photos/4505437/pexels-photo-4505437.jpeg?auto=compress&cs=tinysrgb&w=300",
    storeName: "أدوات الحديقة",
    storeUrl: "https://garden-tools.jo",
    category: "أدوات",
    location: "عمان",
    description: "مجموعة أدوات التقليم الاحترافية عالية الجودة",
    inStock: true,
    rating: 4.8,
    reviews: 156
  },
  {
    id: 20,
    productName: "بذور فجل أحمر",
    price: 0.55,
    currency: "JOD",
    imageUrl: "https://images.pexels.com/photos/4505533/pexels-photo-4505533.jpeg?auto=compress&cs=tinysrgb&w=300",
    storeName: "HIPPOS Seeds Agr. LLC",
    storeUrl: "https://hipposseeds.com",
    category: "بذور",
    location: "عمان",
    description: "بذور فجل أحمر حارة ومقرمشة",
    inStock: true,
    rating: 4.2,
    reviews: 39
  }
];

export const categories = [
  "الكل",
  "بذور",
  "أسمدة",
  "مبيدات",
  "شتلات",
  "أدوات"
];

export const cities = [
  "الكل",
  "عمان",
  "الزرقاء",
  "إربد",
  "جرش",
  "الكرك",
  "الطفيلة"
];

export const suggestions = {
  "تفاح": ["تفاح أحمر", "تفاح أخضر", "شتلات تفاح"],
  "بندورة": ["بذور بندورة", "بندورة حمراء", "بندورة كرزية"],
  "خيار": ["بذور خيار", "خيار هجين", "خيار طويل"],
  "فلفل": ["فلفل حار", "فلفل حلو", "فلفل رومي"],
  "سماد": ["سماد عضوي", "سماد NPK", "سماد البوتاسيوم"],
  "بذور": ["بذور خضار", "بذور فواكه", "بذور أعشاب"],
  "شتلات": ["شتلات فواكه", "شتلات زيتون", "شتلات حمضيات"]
};