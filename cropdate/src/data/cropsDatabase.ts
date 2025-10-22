import { CropData } from '../types/crop';

export const cropsDatabase: CropData[] = [
  {
    id: 'wheat',
    name: 'Wheat',
    nameAr: 'قمح',
    description: 'حبوب أساسية عالمية ومصدر غذائي رئيسي',
    averageGrowthDays: 120,
    harvestSeason: 'أواخر الربيع إلى بداية الصيف',
    optimalConditions: ['مناخ بارد ورطب', 'تربة جيدة التصريف', 'شمس كاملة'],
    imageUrl: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg'
  },
  {
    id: 'barley',
    name: 'Barley',
    nameAr: 'شعير',
    description: 'حبوب متعددة الاستخدامات بنكهة غنية تشبه الجوز',
    averageGrowthDays: 90,
    harvestSeason: 'الصيف',
    optimalConditions: ['مناخ بارد', 'تربة جيدة التصريف', 'ري معتدل'],
    imageUrl: 'https://images.pexels.com/photos/533346/pexels-photo-533346.jpeg'
  },
  {
    id: 'corn',
    name: 'Corn',
    nameAr: 'ذرة',
    description: 'نبات حبوب كبير تم تدجينه من قبل الشعوب الأصلية',
    averageGrowthDays: 100,
    harvestSeason: 'أواخر الصيف إلى الخريف',
    optimalConditions: ['مناخ دافئ', 'تربة غنية', 'ري منتظم'],
    imageUrl: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg'
  },
  {
    id: 'sesame',
    name: 'Sesame',
    nameAr: 'سمسم',
    description: 'محصول بذور زيتية معروف بنكهته الجوزية ومحتواه العالي من الزيت',
    averageGrowthDays: 110,
    harvestSeason: 'أواخر الصيف',
    optimalConditions: ['مناخ حار', 'تربة جيدة التصريف', 'رطوبة منخفضة'],
    imageUrl: 'https://images.pexels.com/photos/4198018/pexels-photo-4198018.jpeg'
  },
  {
    id: 'olive',
    name: 'Olive',
    nameAr: 'زيتون',
    description: 'ثمرة بيضاوية صغيرة بنواة صلبة ولب مر',
    averageGrowthDays: 180,
    harvestSeason: 'الخريف إلى الشتاء',
    optimalConditions: ['مناخ متوسطي', 'تربة جيدة التصريف', 'شمس كاملة'],
    imageUrl: 'https://images.pexels.com/photos/1002543/pexels-photo-1002543.jpeg'
  },
  {
    id: 'date-palm',
    name: 'Date Palm',
    nameAr: 'نخيل التمر',
    description: 'ثمرة حلوة من شجرة نخيل التمر، عنصر أساسي في المطبخ الشرق أوسطي',
    averageGrowthDays: 200,
    harvestSeason: 'الخريف',
    optimalConditions: ['مناخ حار وجاف', 'تربة رملية', 'مصدر مياه عميق'],
    imageUrl: 'https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg'
  },
  {
    id: 'chickpea',
    name: 'Chickpea',
    nameAr: 'حمص',
    description: 'بقولية غنية بالبروتين والألياف، تُعرف أيضاً بالحمص الشامي',
    averageGrowthDays: 95,
    harvestSeason: 'أواخر الربيع إلى بداية الصيف',
    optimalConditions: ['مناخ بارد', 'تربة جيدة التصريف', 'ري معتدل'],
    imageUrl: 'https://images.pexels.com/photos/4198017/pexels-photo-4198017.jpeg'
  },
  {
    id: 'tomato',
    name: 'Tomato',
    nameAr: 'طماطم',
    description: 'ثمرة حمراء أو صفراء بلب عصيري',
    averageGrowthDays: 80,
    harvestSeason: 'الصيف إلى الخريف',
    optimalConditions: ['مناخ دافئ', 'تربة جيدة التصريف', 'شمس كاملة'],
    imageUrl: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg'
  },
  {
    id: 'onion',
    name: 'Onion',
    nameAr: 'بصل',
    description: 'خضار بصلية بنكهة ورائحة قوية',
    averageGrowthDays: 120,
    harvestSeason: 'الصيف',
    optimalConditions: ['مناخ بارد', 'تربة غنية', 'ري منتظم'],
    imageUrl: 'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg'
  },
  {
    id: 'potato',
    name: 'Potato',
    nameAr: 'بطاطس',
    description: 'درنة نباتية نشوية وهي من أهم المحاصيل الغذائية',
    averageGrowthDays: 90,
    harvestSeason: 'أواخر الصيف إلى الخريف',
    optimalConditions: ['مناخ بارد', 'تربة رخوة', 'ري منتظم'],
    imageUrl: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg'
  },
  {
    id: 'cotton',
    name: 'Cotton',
    nameAr: 'قطن',
    description: 'ألياف ناعمة ورقيقة تنمو في جراب حول البذور',
    averageGrowthDays: 160,
    harvestSeason: 'الخريف',
    optimalConditions: ['مناخ حار', 'تربة جيدة التصريف', 'موسم نمو طويل'],
    imageUrl: 'https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg'
  },
  {
    id: 'maize',
    name: 'Maize',
    nameAr: 'ذرة صفراء',
    description: 'نبات حبوب كبير، يُعرف أيضاً بالذرة في أمريكا الشمالية',
    averageGrowthDays: 105,
    harvestSeason: 'أواخر الصيف إلى الخريف',
    optimalConditions: ['مناخ دافئ', 'تربة غنية', 'هطول أمطار كافي'],
    imageUrl: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg'
  },
  {
    id: 'citrus',
    name: 'Citrus',
    nameAr: 'حمضيات',
    description: 'مجموعة من الأشجار والشجيرات المزهرة في عائلة السذابية',
    averageGrowthDays: 240,
    harvestSeason: 'الشتاء إلى الربيع',
    optimalConditions: ['مناخ شبه استوائي', 'تربة جيدة التصريف', 'شمس كاملة'],
    imageUrl: 'https://images.pexels.com/photos/327098/pexels-photo-327098.jpeg'
  },
  {
    id: 'peanut',
    name: 'Peanut',
    nameAr: 'فول سوداني',
    description: 'محصول بقولي يُزرع بشكل أساسي لبذوره الصالحة للأكل',
    averageGrowthDays: 130,
    harvestSeason: 'الخريف',
    optimalConditions: ['مناخ دافئ', 'تربة رملية', 'هطول أمطار معتدل'],
    imageUrl: 'https://images.pexels.com/photos/4198018/pexels-photo-4198018.jpeg'
  },
  {
    id: 'fava-bean',
    name: 'Fava Bean',
    nameAr: 'فول',
    description: 'نوع من النباتات المزهرة في عائلة البازلاء والفاصولياء',
    averageGrowthDays: 85,
    harvestSeason: 'أواخر الربيع',
    optimalConditions: ['مناخ بارد', 'تربة غنية', 'ري معتدل'],
    imageUrl: 'https://images.pexels.com/photos/4198017/pexels-photo-4198017.jpeg'
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    nameAr: 'خيار',
    description: 'نبات كرمة زاحف واسع الانتشار في عائلة القرعيات',
    averageGrowthDays: 60,
    harvestSeason: 'الصيف',
    optimalConditions: ['مناخ دافئ', 'تربة غنية', 'ري منتظم'],
    imageUrl: 'https://images.pexels.com/photos/2329440/pexels-photo-2329440.jpeg'
  },
  {
    id: 'eggplant',
    name: 'Eggplant',
    nameAr: 'باذنجان',
    description: 'نوع نباتي في عائلة الباذنجانيات يُزرع لثماره الصالحة للأكل',
    averageGrowthDays: 85,
    harvestSeason: 'الصيف إلى الخريف',
    optimalConditions: ['مناخ دافئ', 'تربة جيدة التصريف', 'شمس كاملة'],
    imageUrl: 'https://images.pexels.com/photos/321551/pexels-photo-321551.jpeg'
  },
  {
    id: 'sweet-pepper',
    name: 'Sweet Pepper',
    nameAr: 'فلفل حلو',
    description: 'مجموعة زراعية من نوع الفليفلة الحولية',
    averageGrowthDays: 75,
    harvestSeason: 'الصيف إلى الخريف',
    optimalConditions: ['مناخ دافئ', 'تربة غنية', 'ري منتظم'],
    imageUrl: 'https://images.pexels.com/photos/594137/pexels-photo-594137.jpeg'
  },
  {
    id: 'grapes',
    name: 'Grapes',
    nameAr: 'عنب',
    description: 'ثمرة توتية، نباتياً توت، من الكروم الخشبية المتساقطة الأوراق',
    averageGrowthDays: 150,
    harvestSeason: 'أواخر الصيف إلى الخريف',
    optimalConditions: ['مناخ متوسطي', 'تربة جيدة التصريف', 'شمس كاملة'],
    imageUrl: 'https://images.pexels.com/photos/39351/grapes-purple-fruit-vineyard-39351.jpeg'
  },
  {
    id: 'orange',
    name: 'Orange',
    nameAr: 'برتقال',
    description: 'ثمرة حمضية بقشرة صلبة ذات لون أحمر مصفر زاهي',
    averageGrowthDays: 240,
    harvestSeason: 'الشتاء إلى الربيع',
    optimalConditions: ['مناخ شبه استوائي', 'تربة جيدة التصريف', 'شمس كاملة'],
    imageUrl: 'https://images.pexels.com/photos/327098/pexels-photo-327098.jpeg'
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    nameAr: 'بطيخ',
    description: 'نوع نباتي مزهر من عائلة القرعيات',
    averageGrowthDays: 90,
    harvestSeason: 'الصيف',
    optimalConditions: ['مناخ حار', 'تربة رملية', 'مياه وفيرة'],
    imageUrl: 'https://images.pexels.com/photos/1313267/pexels-photo-1313267.jpeg'
  },
  {
    id: 'zucchini',
    name: 'Zucchini',
    nameAr: 'كوسة',
    description: 'قرع صيفي، نبات عشبي كرمي تُحصد ثماره عندما تكون غير ناضجة',
    averageGrowthDays: 55,
    harvestSeason: 'الصيف',
    optimalConditions: ['مناخ دافئ', 'تربة غنية', 'ري منتظم'],
    imageUrl: 'https://images.pexels.com/photos/128536/pexels-photo-128536.jpeg'
  },
  {
    id: 'alfalfa',
    name: 'Alfalfa',
    nameAr: 'برسيم حجازي',
    description: 'نبات مزهر معمر في عائلة البقوليات يُزرع كعلف',
    averageGrowthDays: 60,
    harvestSeason: 'حصادات متعددة في السنة',
    optimalConditions: ['مناخ معتدل', 'تربة جيدة التصريف', 'جذور عميقة'],
    imageUrl: 'https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg'
  },
  {
    id: 'apple',
    name: 'Apple',
    nameAr: 'تفاح',
    description: 'ثمرة حلوة صالحة للأكل تنتجها شجرة التفاح',
    averageGrowthDays: 150,
    harvestSeason: 'الخريف',
    optimalConditions: ['مناخ معتدل', 'تربة جيدة التصريف', 'شمس كاملة'],
    imageUrl: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg'
  },
  {
    id: 'apricot',
    name: 'Apricot',
    nameAr: 'مشمش',
    description: 'ثمرة، أو الشجرة التي تحمل الثمرة، من عدة أنواع في جنس البرقوق',
    averageGrowthDays: 120,
    harvestSeason: 'بداية الصيف',
    optimalConditions: ['مناخ متوسطي', 'تربة جيدة التصريف', 'شمس كاملة'],
    imageUrl: 'https://images.pexels.com/photos/1263986/pexels-photo-1263986.jpeg'
  },
  {
    id: 'peach',
    name: 'Peach',
    nameAr: 'خوخ',
    description: 'شجرة متساقطة الأوراق موطنها منطقة شمال غرب الصين',
    averageGrowthDays: 130,
    harvestSeason: 'الصيف',
    optimalConditions: ['مناخ معتدل', 'تربة جيدة التصريف', 'شمس كاملة'],
    imageUrl: 'https://images.pexels.com/photos/209439/pexels-photo-209439.jpeg'
  },
  {
    id: 'pomegranate',
    name: 'Pomegranate',
    nameAr: 'رمان',
    description: 'شجيرة متساقطة الأوراق تحمل الثمار في عائلة الحناء',
    averageGrowthDays: 180,
    harvestSeason: 'الخريف',
    optimalConditions: ['مناخ متوسطي', 'تربة جيدة التصريف', 'شمس كاملة'],
    imageUrl: 'https://images.pexels.com/photos/1263986/pexels-photo-1263986.jpeg'
  },
  {
    id: 'lemon',
    name: 'Lemon',
    nameAr: 'ليمون',
    description: 'نوع من الأشجار الصغيرة دائمة الخضرة في عائلة النباتات المزهرة السذابية',
    averageGrowthDays: 210,
    harvestSeason: 'الشتاء إلى الربيع',
    optimalConditions: ['مناخ شبه استوائي', 'تربة جيدة التصريف', 'شمس كاملة'],
    imageUrl: 'https://images.pexels.com/photos/1414130/pexels-photo-1414130.jpeg'
  },
  {
    id: 'celery',
    name: 'Celery',
    nameAr: 'كرفس',
    description: 'نبات مستنقعي في عائلة الخيمية تم زراعته كخضار',
    averageGrowthDays: 85,
    harvestSeason: 'الخريف إلى الشتاء',
    optimalConditions: ['مناخ بارد', 'تربة غنية', 'رطوبة ثابتة'],
    imageUrl: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg'
  },
  {
    id: 'mint',
    name: 'Mint',
    nameAr: 'نعناع',
    description: 'جنس من النباتات في عائلة الشفوية',
    averageGrowthDays: 45,
    harvestSeason: 'الربيع إلى الخريف',
    optimalConditions: ['ظل جزئي', 'تربة رطبة', 'مناخ بارد'],
    imageUrl: 'https://images.pexels.com/photos/1414130/pexels-photo-1414130.jpeg'
  },
  {
    id: 'basil',
    name: 'Basil',
    nameAr: 'ريحان',
    description: 'عشبة طبخ من عائلة الشفوية',
    averageGrowthDays: 60,
    harvestSeason: 'الصيف',
    optimalConditions: ['مناخ دافئ', 'تربة جيدة التصريف', 'شمس كاملة'],
    imageUrl: 'https://images.pexels.com/photos/4198018/pexels-photo-4198018.jpeg'
  },
  {
    id: 'radish',
    name: 'Radish',
    nameAr: 'فجل',
    description: 'خضار جذرية صالحة للأكل من عائلة الكرنبية',
    averageGrowthDays: 30,
    harvestSeason: 'الربيع والخريف',
    optimalConditions: ['مناخ بارد', 'تربة رخوة', 'ري منتظم'],
    imageUrl: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg'
  },
  {
    id: 'sorghum',
    name: 'Sorghum',
    nameAr: 'ذرة رفيعة',
    description: 'جنس من النباتات المزهرة في عائلة النجيليات',
    averageGrowthDays: 110,
    harvestSeason: 'الخريف',
    optimalConditions: ['مناخ حار', 'تربة جيدة التصريف', 'مقاوم للجفاف'],
    imageUrl: 'https://images.pexels.com/photos/4022092/pexels-photo-4022092.jpeg'
  }
];