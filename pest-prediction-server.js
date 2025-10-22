import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

// الحصول على المسار الحالي للملف في ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4001;

// وسائط الاتصال
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// تخزين النموذج المدرب بشكل عام
let trainedModel = null;

// بيانات زراعية مضمنة للتدريب (بدلاً من قراءة ملف CSV)
const sampleAgriculturalData = [
  {
    "temperature": "25", "humidity": "65", "rainfall": "120", "soil_moisture": "40",
    "soil_ph": "6.5", "nitrogen_level": "75", "phosphorus_level": "45", "potassium_level": "60",
    "sunlight_exposure": "8", "pest_aphids": "0.4", "pest_fungal": "0.3", "pest_thrips": "0.5", "pest_mites": "0.2"
  },
  {
    "temperature": "28", "humidity": "70", "rainfall": "80", "soil_moisture": "35",
    "soil_ph": "7.0", "nitrogen_level": "65", "phosphorus_level": "50", "potassium_level": "55",
    "sunlight_exposure": "9", "pest_aphids": "0.6", "pest_fungal": "0.2", "pest_thrips": "0.7", "pest_mites": "0.5"
  },
  {
    "temperature": "22", "humidity": "80", "rainfall": "150", "soil_moisture": "50",
    "soil_ph": "6.2", "nitrogen_level": "80", "phosphorus_level": "40", "potassium_level": "65",
    "sunlight_exposure": "7", "pest_aphids": "0.7", "pest_fungal": "0.6", "pest_thrips": "0.3", "pest_mites": "0.1"
  },
  {
    "temperature": "30", "humidity": "55", "rainfall": "50", "soil_moisture": "30",
    "soil_ph": "7.5", "nitrogen_level": "60", "phosphorus_level": "55", "potassium_level": "50",
    "sunlight_exposure": "10", "pest_aphids": "0.5", "pest_fungal": "0.1", "pest_thrips": "0.8", "pest_mites": "0.7"
  },
  {
    "temperature": "24", "humidity": "75", "rainfall": "130", "soil_moisture": "45",
    "soil_ph": "6.8", "nitrogen_level": "70", "phosphorus_level": "48", "potassium_level": "58",
    "sunlight_exposure": "7.5", "pest_aphids": "0.5", "pest_fungal": "0.4", "pest_thrips": "0.4", "pest_mites": "0.3"
  }
];

// تحويل البيانات إلى تنسيق مناسب لـ XGBoost
function prepareDataForXGBoost(data, features, targetColumn) {
  const X = [];
  const y = [];
  
  data.forEach(row => {
    const featureRow = [];
    features.forEach(feature => {
      featureRow.push(parseFloat(row[feature]));
    });
    X.push(featureRow);
    y.push(parseFloat(row[targetColumn]));
  });
  
  return { X, y };
}

// تقسيم البيانات إلى مجموعات تدريب واختبار
function splitData(X, y, testRatio = 0.2) {
  const numSamples = X.length;
  const numTest = Math.floor(numSamples * testRatio);
  const indices = Array.from({ length: numSamples }, (_, i) => i);
  
  // خلط المؤشرات عشوائياً
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  const testIndices = indices.slice(0, numTest);
  const trainIndices = indices.slice(numTest);
  
  const X_train = trainIndices.map(i => X[i]);
  const y_train = trainIndices.map(i => y[i]);
  const X_test = testIndices.map(i => X[i]);
  const y_test = testIndices.map(i => y[i]);
  
  return { X_train, y_train, X_test, y_test };
}

// محاكاة تدريب نموذج
async function trainModel() {
  console.log('محاكاة تدريب النموذج...');
  
  // إنشاء نموذج محاكي للاختبار
  trainedModel = {
    predict: async (data) => {
      return data.map(features => {
        const temperature = features[0] || 25;
        const humidity = features[1] || 65;
        const rainfall = features[2] || 100;
        const soilMoisture = features[3] || 40;
        
        return {
          aphids: Math.min(0.9, (humidity * 0.008 + temperature * 0.005)),
          fungalBlight: Math.min(0.9, (humidity * 0.012 - temperature * 0.003 + rainfall * 0.002)),
          thrips: Math.min(0.9, (temperature * 0.015 - humidity * 0.002 + rainfall * 0.001)),
          spiderMites: Math.min(0.9, (temperature * 0.018 - humidity * 0.005 - soilMoisture * 0.002))
        };
      });
    }
  };
  
  return trainedModel;
}

// دالة لتوليد توصيات بناءً على احتمالية الآفات
function generatePestRecommendations(pestProbabilities, cropType) {
  const recommendations = [];
  
  if (pestProbabilities.aphids > 0.5) {
    recommendations.push('خطر عالي من المن. يوصى برش مبيدات حشرية متخصصة أو استخدام المكافحة الحيوية.');
  } else if (pestProbabilities.aphids > 0.3) {
    recommendations.push('احتمالية متوسطة لظهور المن. راقب النباتات بانتظام وخاصة أسفل الأوراق.');
  }
  
  if (pestProbabilities.fungalBlight > 0.5) {
    recommendations.push('خطر عالي من العفن الفطري. يوصى بتقليل الرطوبة وتحسين التهوية واستخدام مبيدات فطرية وقائية.');
  } else if (pestProbabilities.fungalBlight > 0.3) {
    recommendations.push('احتمالية متوسطة للإصابة بالعفن الفطري. تأكد من التهوية الجيدة وتجنب الري فوق الأوراق.');
  }
  
  if (pestProbabilities.thrips > 0.5) {
    recommendations.push('خطر عالي من التربس. يوصى باستخدام المصائد اللاصقة الصفراء والرش بالمبيدات المتخصصة.');
  } else if (pestProbabilities.thrips > 0.3) {
    recommendations.push('احتمالية متوسطة لظهور التربس. استخدم المصائد اللاصقة للمراقبة والكشف المبكر.');
  }
  
  if (pestProbabilities.spiderMites > 0.5) {
    recommendations.push('خطر عالي من العناكب الحمراء. يوصى برفع مستوى الرطوبة المحيطة واستخدام مبيدات الأكاروسات.');
  } else if (pestProbabilities.spiderMites > 0.3) {
    recommendations.push('احتمالية متوسطة لظهور العناكب الحمراء. راقب أسفل الأوراق بحثًا عن بقع صفراء أو شبكات عنكبوتية صغيرة.');
  }
  
  // إضافة توصيات عامة إذا كانت القائمة فارغة
  if (recommendations.length === 0) {
    recommendations.push('المخاطر الحالية للآفات منخفضة. استمر في المراقبة الروتينية للنباتات.');
    recommendations.push('تأكد من التوازن الغذائي للنباتات للحفاظ على مقاومتها للآفات والأمراض.');
  }
  
  return recommendations;
}

// تهيئة النموذج عند بدء الخادم
async function initializeModel() {
  try {
    console.log('جاري تهيئة نموذج التنبؤ بالآفات...');
    
    // تعريف المميزات
    const features = [
      'temperature', 'humidity', 'rainfall', 'soil_moisture',
      'soil_ph', 'nitrogen_level', 'phosphorus_level', 'potassium_level',
      'sunlight_exposure'
    ];
    
    // استخدام البيانات المضمنة بدلاً من قراءة ملف
    const data = sampleAgriculturalData;
    
    // محاكاة تدريب النموذج
    await trainModel();
    console.log('تم تهيئة نموذج التنبؤ بالآفات بنجاح!');
    
    return true;
  } catch (error) {
    console.error('خطأ في تهيئة النموذج:', error);
    return false;
  }
}

// صفحة رئيسية بسيطة مع نموذج اختبار
app.get('/', (req, res) => {
  console.log('تم استلام طلب للصفحة الرئيسية');
  const htmlForm = `<!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>نظام التنبؤ بالآفات الزراعية</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f5f5f5;
          color: #333;
        }
        h1 {
          color: #2e7d32;
          text-align: center;
          margin-bottom: 30px;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        input, select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        button {
          background-color: #2e7d32;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          display: block;
          margin: 20px auto;
          width: 200px;
        }
        button:hover {
          background-color: #1b5e20;
        }
        #result {
          margin-top: 30px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: #f9f9f9;
          white-space: pre-wrap;
          direction: rtl;
          display: none;
        }
        .predictions {
          margin-top: 15px;
        }
        .prediction-item {
          margin: 10px 0;
          padding: 10px;
          border-right: 4px solid #2e7d32;
          background-color: rgba(46, 125, 50, 0.1);
        }
        .high-risk {
          border-right-color: #d32f2f;
          background-color: rgba(211, 47, 47, 0.1);
        }
        .medium-risk {
          border-right-color: #ff9800;
          background-color: rgba(255, 152, 0, 0.1);
        }
        .low-risk {
          border-right-color: #2e7d32;
          background-color: rgba(46, 125, 50, 0.1);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>نظام التنبؤ بالآفات الزراعية</h1>
        
        <form id="pestPredictionForm">
          <div class="form-group">
            <label for="temperature">درجة الحرارة (°C)</label>
            <input type="number" id="temperature" name="temperature" value="28" required>
          </div>
          
          <div class="form-group">
            <label for="humidity">الرطوبة (%)</label>
            <input type="number" id="humidity" name="humidity" value="65" required>
          </div>
          
          <div class="form-group">
            <label for="soilMoisture">رطوبة التربة (%)</label>
            <input type="number" id="soilMoisture" name="soilMoisture" value="40">
          </div>
          
          <div class="form-group">
            <label for="ph">درجة الحموضة (pH)</label>
            <input type="number" id="ph" name="ph" step="0.1" value="6.5">
          </div>
          
          <div class="form-group">
            <label for="nitrogen">مستوى النيتروجين</label>
            <input type="number" id="nitrogen" name="nitrogen" value="60">
          </div>
          
          <div class="form-group">
            <label for="phosphorus">مستوى الفوسفور</label>
            <input type="number" id="phosphorus" name="phosphorus" value="45">
          </div>
          
          <div class="form-group">
            <label for="potassium">مستوى البوتاسيوم</label>
            <input type="number" id="potassium" name="potassium" value="55">
          </div>
          
          <div class="form-group">
            <label for="cropType">نوع المحصول</label>
            <select id="cropType" name="cropType">
              <option value="general">عام</option>
              <option value="vegetables">خضروات</option>
              <option value="fruits">فواكه</option>
              <option value="grains">حبوب</option>
            </select>
          </div>
          
          <button type="submit">تنبؤ بالآفات</button>
        </form>
        
        <div id="result"></div>
      </div>
      
      <script>
        document.getElementById('pestPredictionForm').addEventListener('submit', async function(e) {
          e.preventDefault();
          
          const formData = {
            temperature: document.getElementById('temperature').value,
            humidity: document.getElementById('humidity').value,
            soilMoisture: document.getElementById('soilMoisture').value,
            ph: document.getElementById('ph').value,
            nitrogen: document.getElementById('nitrogen').value,
            phosphorus: document.getElementById('phosphorus').value,
            potassium: document.getElementById('potassium').value,
            cropType: document.getElementById('cropType').value
          };
          
          try {
            const response = await fetch('/api/predict-pests', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            const resultDiv = document.getElementById('result');
            resultDiv.style.display = 'block';
            
            if (data.success) {
              let resultsHTML = '<h2>نتائج التنبؤ</h2>';
              
              resultsHTML += '<h3>احتمالية الإصابة بالآفات:</h3>';
              resultsHTML += '<div class="predictions">';
              
              // تنسيق نتائج التنبؤ
              const pests = {
                aphids: 'المن (Aphids)',
                fungalBlight: 'العفن الفطري (Fungal Blight)',
                thrips: 'التربس (Thrips)',
                spiderMites: 'العناكب الحمراء (Spider Mites)'
              };
              
              for (const key in pests) {
                if (pests.hasOwnProperty(key)) {
                  const label = pests[key];
                  const probability = data.predictions[key];
                  let riskClass = 'low-risk';
                  if (probability > 0.5) riskClass = 'high-risk';
                  else if (probability > 0.3) riskClass = 'medium-risk';
                  
                  const percentage = Math.round(probability * 100);
                  resultsHTML += '<div class="prediction-item ' + riskClass + '">' +
                    '<strong>' + label + ':</strong> ' + percentage + '%' +
                  '</div>';
                }
              }
              
              resultsHTML += '</div>';
              
              // إضافة التوصيات
              if (data.recommendations && data.recommendations.length > 0) {
                resultsHTML += '<h3>التوصيات:</h3>';
                resultsHTML += '<ul>';
                for (let i = 0; i < data.recommendations.length; i++) {
                  resultsHTML += '<li>' + data.recommendations[i] + '</li>';
                }
                resultsHTML += '</ul>';
              }
              
              resultDiv.innerHTML = resultsHTML;
            } else {
              resultDiv.innerHTML = '<h2>حدث خطأ</h2><p>' + (data.error || 'خطأ غير معروف') + '</p>';
            }
          } catch (error) {
            const resultDiv = document.getElementById('result');
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = '<h2>حدث خطأ في الاتصال</h2><p>' + error.message + '</p>';
          }
        });
      </script>
    </body>
    </html>`;
  
  console.log('إرسال استجابة HTML');
  res.send(htmlForm);
});

// نقطة نهاية لفحص حالة الخادم
app.get('/api/status', (req, res) => {
  res.json({ status: 'running', modelLoaded: !!trainedModel });
});

// نقطة نهاية للتنبؤ بالآفات
app.post('/api/predict-pests', async (req, res) => {
  try {
    // التحقق من وجود البيانات المطلوبة
    const { temperature, humidity, soilMoisture, ph, nitrogen, phosphorus, potassium, cropType } = req.body;
    
    if (temperature === undefined || humidity === undefined) {
      return res.status(400).json({ error: 'يجب توفير بيانات درجة الحرارة والرطوبة على الأقل' });
    }
    
    // إذا لم يتم تدريب النموذج بعد، حاول تدريبه
    if (!trainedModel) {
      await initializeModel();
      if (!trainedModel) {
        return res.status(500).json({ error: 'فشل في تهيئة النموذج، يرجى المحاولة مرة أخرى لاحقًا' });
      }
    }
    
    // إعداد البيانات للتنبؤ
    const fieldData = [
      [
        parseFloat(temperature),
        parseFloat(humidity),
        100, // قيمة افتراضية لهطول الأمطار
        parseFloat(soilMoisture || 40),
        parseFloat(ph || 7),
        parseFloat(nitrogen || 50),
        parseFloat(phosphorus || 40),
        parseFloat(potassium || 50),
        8  // قيمة افتراضية للتعرض لأشعة الشمس
      ]
    ];

    // منطق مخصص لاحتمالية الآفات حسب المحصول
    let customPrediction = {};
    const crop = (cropType || '').toLowerCase();
    if (crop.includes('طماطم') || crop.includes('tomato')) {
      customPrediction = {
        aphids: Math.min(0.9, 0.3 + 0.003 * humidity + 0.002 * temperature),
        fungalBlight: Math.min(0.9, 0.2 + 0.004 * humidity + 0.001 * soilMoisture),
        thrips: Math.min(0.9, 0.15 + 0.005 * temperature - 0.002 * humidity),
        spiderMites: Math.min(0.9, 0.1 + 0.006 * temperature - 0.003 * soilMoisture),
        whiteflies: Math.min(0.9, 0.18 + 0.004 * temperature + 0.002 * humidity),
        leafMiners: Math.min(0.9, 0.12 + 0.003 * temperature),
        rootRot: Math.min(0.9, 0.08 + 0.004 * soilMoisture),
        powderyMildew: Math.min(0.9, 0.13 + 0.005 * humidity)
      };
    } else if (crop.includes('بطاطا') || crop.includes('potato')) {
      customPrediction = {
        aphids: Math.min(0.9, 0.22 + 0.002 * humidity + 0.001 * temperature),
        fungalBlight: Math.min(0.9, 0.28 + 0.005 * humidity + 0.002 * soilMoisture),
        thrips: Math.min(0.9, 0.09 + 0.004 * temperature - 0.001 * humidity),
        spiderMites: Math.min(0.9, 0.07 + 0.005 * temperature - 0.002 * soilMoisture),
        whiteflies: Math.min(0.9, 0.11 + 0.003 * temperature + 0.001 * humidity),
        leafMiners: Math.min(0.9, 0.15 + 0.002 * temperature),
        rootRot: Math.min(0.9, 0.18 + 0.005 * soilMoisture),
        powderyMildew: Math.min(0.9, 0.09 + 0.004 * humidity)
      };
    } else if (crop.includes('فلفل') || crop.includes('pepper')) {
      customPrediction = {
        aphids: Math.min(0.9, 0.19 + 0.002 * humidity + 0.002 * temperature),
        fungalBlight: Math.min(0.9, 0.16 + 0.003 * humidity + 0.001 * soilMoisture),
        thrips: Math.min(0.9, 0.13 + 0.004 * temperature - 0.001 * humidity),
        spiderMites: Math.min(0.9, 0.09 + 0.005 * temperature - 0.002 * soilMoisture),
        whiteflies: Math.min(0.9, 0.14 + 0.003 * temperature + 0.001 * humidity),
        leafMiners: Math.min(0.9, 0.11 + 0.002 * temperature),
        rootRot: Math.min(0.9, 0.13 + 0.004 * soilMoisture),
        powderyMildew: Math.min(0.9, 0.12 + 0.003 * humidity)
      };
    } else {
      // عام أو غير محدد
      customPrediction = {
        aphids: Math.min(0.9, 0.2 + 0.002 * humidity + 0.001 * temperature),
        fungalBlight: Math.min(0.9, 0.18 + 0.003 * humidity + 0.001 * soilMoisture),
        thrips: Math.min(0.9, 0.1 + 0.003 * temperature - 0.001 * humidity),
        spiderMites: Math.min(0.9, 0.08 + 0.004 * temperature - 0.002 * soilMoisture),
        whiteflies: Math.min(0.9, 0.12 + 0.002 * temperature + 0.001 * humidity),
        leafMiners: Math.min(0.9, 0.1 + 0.001 * temperature),
        rootRot: Math.min(0.9, 0.1 + 0.003 * soilMoisture),
        powderyMildew: Math.min(0.9, 0.1 + 0.002 * humidity)
      };
    }

    // توليد التوصيات بناءً على التنبؤات
    const recommendations = generatePestRecommendations(customPrediction, cropType);

    // إرجاع النتائج
    res.json({
      success: true,
      predictions: customPrediction,
      recommendations
    });

  } catch (error) {
    console.error('خطأ في التنبؤ:', error);
    res.status(500).json({ 
      error: 'حدث خطأ أثناء معالجة طلبك', 
      message: error.message,
      predictions: {
        aphids: 0.2,
        fungalBlight: 0.15,
        thrips: 0.1,
        spiderMites: 0.05
      },
      recommendations: [
        'المخاطر الحالية للآفات منخفضة. استمر في المراقبة الروتينية للنباتات.'
      ]
    });
  }
});

// نقطة نهاية GET للتنبؤ (للاختبار فقط)
app.get('/api/predict-pests', async (req, res) => {
  res.redirect('/'); // توجيه المستخدم إلى الصفحة الرئيسية مع نموذج الإدخال
});

// معالجة المسارات غير الموجودة
app.use((req, res) => {
  console.log(`محاولة وصول لمسار غير موجود: ${req.url}`);
  res.redirect('/'); // إعادة توجيه إلى الصفحة الرئيسية
});

// بدء الخادم
app.listen(PORT, async () => {
  console.log(`خادم التنبؤ بالآفات يعمل على المنفذ ${PORT}`);
  console.log(`يمكن الوصول إلى التطبيق عبر: http://localhost:${PORT}/`);
  
  // تهيئة النموذج عند بدء التشغيل
  await initializeModel();
  
  // إضافة نقاط النهاية المتاحة للتوضيح
  console.log('نقاط النهاية المتاحة:');
  console.log('GET  /');
  console.log('GET  /api/status');
  console.log('POST /api/predict-pests');
  console.log('GET  /api/predict-pests (إعادة توجيه)');
});

// تصدير التطبيق لاختبارات الوحدة المحتملة
export default app; 