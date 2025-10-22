import axios from 'axios';

// Roboflow API configuration
const API_KEY = 'kYYqfsrR2UcIaOfDvrVx';
const MODEL_SLUG = 'fruit-ripening-process';
const MODEL_VERSION = 1;
const MODEL_ENDPOINT =
  'https://detect.roboflow.com/' +
  MODEL_SLUG + '/' + MODEL_VERSION +
  '?api_key=' + API_KEY +
  '&confidence=0.5&overlap=0.5';

// خريطة تحويل أسماء الفئات من الإنجليزية للعربية
const CLASS_MAPPING: Record<string, string> = {
  tomato:     'طماطم',
  lemon:      'ليمون',
  apple:      'تفاح',
  cucumber:   'خيار',
  grapes:     'عنب',
  banana:     'موز',
  orange:     'برتقال',
  strawberry: 'فراولة',
};

// معايير النضج لكل محصول (حدَّثنا نطاق الموز)
interface MaturityThreshold {
  hue_min: number; hue_max: number;
  saturation_min: number; saturation_max: number;
  value_min: number; value_max: number;
  area_ratio: number;
}
const MATURITY_THRESHOLDS: Record<string, MaturityThreshold> = {
  'طماطم':   { hue_min: 0,   hue_max: 25,  saturation_min: 50, saturation_max: 100, value_min: 40, value_max: 100, area_ratio: 0.10 },
  'ليمون':   { hue_min: 30,  hue_max: 80,  saturation_min: 50, saturation_max: 100, value_min: 50, value_max: 100, area_ratio: 0.10 },
  'تفاح':    { hue_min: 0,   hue_max: 40,  saturation_min: 40, saturation_max: 100, value_min: 40, value_max: 100, area_ratio: 0.10 },
  'خيار':    { hue_min: 60,  hue_max:170,  saturation_min: 30, saturation_max: 100, value_min: 30, value_max: 100, area_ratio: 0.10 },
  'عنب':     { hue_min:200,  hue_max:350,  saturation_min: 30, saturation_max: 100, value_min: 20, value_max: 100, area_ratio: 0.08 },
  'موز':     { hue_min:20,   hue_max: 90,  saturation_min: 30, saturation_max: 100, value_min: 50, value_max: 100, area_ratio: 0.10 },
  'برتقال':  { hue_min:10,   hue_max: 50,  saturation_min: 50, saturation_max: 100, value_min: 50, value_max: 100, area_ratio: 0.10 },
  'فراولة':  { hue_min:330,  hue_max: 30,  saturation_min: 50, saturation_max: 100, value_min: 30, value_max: 100, area_ratio: 0.08 },
  'default': { hue_min:0,    hue_max:360,  saturation_min:  0, saturation_max: 100, value_min:  0, value_max: 100, area_ratio: 0.05 },
};

// تخزين مؤقت للنتائج (ساعة)
type CacheEntry = { result: any; timestamp: number };
const resultsCache: Record<string, CacheEntry> = {};
const CACHE_TTL = 60 * 60 * 1000;

// تجزئة بسيطة
function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < Math.min(str.length, 500); i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h = h & h;
  }
  return h.toString(16);
}

// تحويل RGB → HSV
function rgbToHsv(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0, s = mx ? d / mx : 0, v = mx;
  if (d) {
    switch (mx) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

// تحليل تباين النسيج
function analyzeImageTexture(data: ImageData): number {
  const d = data.data;
  let diffs = 0;
  for (let y = 0; y < data.height - 1; y++) {
    for (let x = 0; x < data.width - 1; x++) {
      const i = (y * data.width + x) * 4;
      const right = i + 4, below = i + data.width * 4;
      const g1 = 0.299*d[i] + 0.587*d[i+1] + 0.114*d[i+2];
      const g2 = 0.299*d[right] + 0.587*d[right+1] + 0.114*d[right+2];
      const g3 = 0.299*d[below] + 0.587*d[below+1] + 0.114*d[below+2];
      diffs += Math.abs(g1 - g2) + Math.abs(g1 - g3);
    }
  }
  return Math.min(100, diffs / (data.width * data.height) * 2);
}

// استخراج متوسط اللون والنسيج
async function analyzeImageColor(
  b64: string,
  det: { x: number; y: number; width: number; height: number }
) {
  const img = new Image();
  await new Promise((r, e) => { img.onload = r; img.onerror = e; img.src = b64; });
  const cvs = document.createElement('canvas');
  cvs.width = det.width; cvs.height = det.height;
  const ctx = cvs.getContext('2d');
  if (!ctx) throw new Error('canvas failed');
  ctx.drawImage(img, det.x, det.y, det.width, det.height, 0, 0, det.width, det.height);
  const data = ctx.getImageData(0, 0, det.width, det.height);
  const d = data.data;
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < d.length; i += 4) {
    r += d[i]; g += d[i+1]; b += d[i+2];
  }
  const cnt = d.length / 4;
  const { h, s, v } = rgbToHsv(r / cnt, g / cnt, b / cnt);
  return { h, s, v, textureScore: analyzeImageTexture(data) };
}

// دالة تحليل النضج الرئيسية
export async function analyzeMaturity(
  imageBase64: string,
  cropType: string = 'default'
) {
  const key = simpleHash(imageBase64 + cropType);
  const now = Date.now();
  if (resultsCache[key] && now - resultsCache[key].timestamp < CACHE_TTL) {
    return resultsCache[key].result;
  }

  const raw = imageBase64.replace(/^data:image\/\w+;base64,/, '');
  try {
    const res = await axios.post(
      MODEL_ENDPOINT,
      { image: raw },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('Roboflow API Response:', res.data);
    const preds = res.data.predictions || [];
    if (!preds.length) {
      console.warn('لم يتم الكشف عن أي محصول في الصورة!');
      return {
        success: false,
        message: 'لم يتم الكشف عن أي محصول في الصورة. تأكد من وضوح الصورة ووجود المحصول بشكل واضح.'
      };
    }

    const best = preds.reduce((a: any, b: any) => a.confidence > b.confidence ? a : b);
    console.log('Detected class from API:', best.class);

    // تحقق من دعم اسم الفئة
    const arabicClass = CLASS_MAPPING[best.class] || cropType;
    if (!MATURITY_THRESHOLDS[arabicClass]) {
      return {
        success: false,
        message: `نوع المحصول المكتشف (${best.class}) غير مدعوم في النظام. أضف العتبات المناسبة أو تحقق من اسم الفئة.`
      };
    }

    // حساب corner من center
    const x0 = Math.max(0, best.x - best.width  / 2);
    const y0 = Math.max(0, best.y - best.height / 2);

    // نسبة المساحة
    const img = new Image();
    await new Promise(r => { img.onload = r; img.src = imageBase64; });
    const areaRatio = (best.width * best.height) / (img.width * img.height);

    // تحليل اللون والنسيج
    const { h: hue, s: sat, v: val, textureScore } = await analyzeImageColor(imageBase64, {
      x: x0, y: y0, width: best.width, height: best.height
    });

    // تصحيح اللون إن لزم
    let correctedHue = hue;
    if ((CLASS_MAPPING[best.class] === 'ليمون' || CLASS_MAPPING[best.class] === 'طماطم')
      && hue > 270 && hue < 330
    ) {
      correctedHue = CLASS_MAPPING[best.class] === 'ليمون' ? 50 : 5;
    }

    // جلب العتبات
    const th = MATURITY_THRESHOLDS[arabicClass] || MATURITY_THRESHOLDS.default;

    const inHue = (correctedHue >= th.hue_min && correctedHue <= th.hue_max)
      || (th.hue_min > th.hue_max && (correctedHue >= th.hue_min || correctedHue <= th.hue_max));
    const inSat = sat >= th.saturation_min && sat <= th.saturation_max;
    const inVal = val >= th.value_min && val <= th.value_max;

    // حساب الدرجة
    let score = 0;
    if (inHue) score += 40 * (1 - Math.abs(correctedHue - (th.hue_min + th.hue_max) / 2) / ((th.hue_max - th.hue_min) / 2));
    if (inSat) score += 25 * (1 - Math.abs(sat - (th.saturation_min + th.saturation_max) / 2) / ((th.saturation_max - th.saturation_min) / 2));
    if (inVal) score += 20 * (1 - Math.abs(val - (th.value_min + th.value_max) / 2) / ((th.value_max - th.value_min) / 2));
    score += 15 * Math.min(1, areaRatio / th.area_ratio);
    const maturityScore = Math.round(score);

    // تحديد الحالة وأيام الحصاد
    let maturity: string, harvestDays: number;
    if (maturityScore >= 85)       { maturity = 'ناضج تماماً'; harvestDays = 0; }
    else if (maturityScore >= 65)  { maturity = 'ناضج جزئياً'; harvestDays = Math.max(1, Math.round((85 - maturityScore) / 10)); }
    else                           { maturity = 'غير ناضج';   harvestDays = Math.max(4, Math.round((65 - maturityScore) / 5)); }

    // طباعة القيم الفعلية للتحليل
    console.log('تحليل النضج:', {
      crop: arabicClass,
      hue: correctedHue,
      sat,
      val,
      areaRatio,
      inHue,
      inSat,
      inVal
    });
    if (!inHue) console.warn('اللون خارج النطاق!');
    if (!inSat) console.warn('التشبع خارج النطاق!');
    if (!inVal) console.warn('الإضاءة خارج النطاق!');
    if (areaRatio < th.area_ratio) console.warn('نسبة المساحة أقل من المطلوب!');

    const result = {
      success: true,
      detectedClass: arabicClass,
      confidence: best.confidence,
      maturity,
      maturityScore,
      harvestDays,
      colorInfo: { hue: correctedHue, saturation: sat, value: val, textureScore, inHue, inSat, inVal },
      detectionInfo: { areaRatio, bbox: { x: x0, y: y0, width: best.width, height: best.height } }
    };

    resultsCache[key] = { result, timestamp: now };
    return result;

  } catch (e) {
    console.error('تحليل فشل:', e);
    // نتائج وهمية ثابتة
    return generateMockResults(cropType, parseInt(simpleHash(imageBase64).substring(0, 8), 16));
  }
}

// نتائج وهمية
function generateMockResults(cropType: string, seed: number = 0) {
  function rnd() { const x = Math.sin(seed++) * 10000; return x - Math.floor(x); }
  const score = Math.floor(rnd() * 100);
  let maturity: string, days: number;
  if (score >= 85)       { maturity = 'ناضج تماماً'; days = 0; }
  else if (score >= 65)  { maturity = 'ناضج جزئياً'; days = Math.max(1, Math.round((85 - score) / 10)); }
  else                   { maturity = 'غير ناضج';   days = Math.max(4, Math.round((65 - score) / 5)); }

  return {
    success: true,
    detectedClass: cropType,
    confidence: 0.8 + rnd() * 0.2,
    maturity, maturityScore: score, harvestDays: days,
    colorInfo: { hue: Math.floor(rnd() * 360), saturation: 50 + Math.floor(rnd() * 50), value: 50 + Math.floor(rnd() * 50), textureScore: 30 + Math.floor(rnd() * 40), inHue: true, inSat: true, inVal: true },
    detectionInfo: { areaRatio: 0.3 + rnd() * 0.2, bbox: { x: 100, y: 100, width: 200, height: 200 } }
  };
}

// تقدير وقت الحصاد
export function estimateHarvestTime(harvestDays: number | null): string {
  if (harvestDays === null) return 'غير معروف';
  if (harvestDays === 0)    return 'جاهز الآن';
  const d = new Date();
  d.setDate(d.getDate() + harvestDays);
  return d.toLocaleDateString('ar-EG');
}

