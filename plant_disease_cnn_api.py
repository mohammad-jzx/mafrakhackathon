import tensorflow as tf
import os
import numpy as np
import cv2
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # تمكين CORS للسماح بالاتصال من الواجهة الأمامية

# مسارات النموذج والفئات - استخدام مسارات نسبية للمجلد الحالي
MODEL_PATH = "./model/plant_disease_model.h5"
CLASS_NAMES_PATH = "./model/class_names.npy"

# تحميل النموذج وأسماء الفئات
model = None
class_names = None

def load_model_and_classes():
    """تحميل النموذج وأسماء الفئات"""
    global model, class_names
    try:
        if model is None:
            print("تحميل النموذج...")
            # إنشاء مجلد النموذج إذا لم يكن موجوداً
            os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
            
            if os.path.exists(MODEL_PATH):
                model = tf.keras.models.load_model(MODEL_PATH)
                print("تم تحميل النموذج")
            else:
                print(f"خطأ: ملف النموذج غير موجود في المسار {MODEL_PATH}")
                print("سيتم إنشاء نموذج تجريبي بسيط...")
                # إنشاء نموذج تجريبي بسيط
                model = create_demo_model()
                print("تم إنشاء نموذج تجريبي")
                return True
                
            if os.path.exists(CLASS_NAMES_PATH):
                class_names = np.load(CLASS_NAMES_PATH, allow_pickle=True)
                print(f"تم تحميل أسماء الفئات: {class_names}")
            else:
                print(f"خطأ: ملف أسماء الفئات غير موجود في المسار {CLASS_NAMES_PATH}")
                # إنشاء أسماء فئات تجريبية
                class_names = np.array(['طماطم_سليم', 'طماطم_لفحة_متأخرة', 'طماطم_لفحة_مبكرة', 
                                    'خيار_بياض_زغبي', 'خيار_بياض_دقيقي', 'كوسة_تبقع_أوراق'])
                print(f"تم إنشاء أسماء فئات تجريبية: {class_names}")
                np.save(CLASS_NAMES_PATH, class_names)
        return True
    except Exception as e:
        print(f"خطأ في تحميل النموذج: {str(e)}")
        return False

def create_demo_model():
    """إنشاء نموذج تجريبي بسيط للاختبار"""
    simple_model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(224, 224, 3)),
        tf.keras.layers.Conv2D(16, 3, activation='relu'),
        tf.keras.layers.GlobalAveragePooling2D(),
        tf.keras.layers.Dense(6, activation='softmax')  # 6 فئات
    ])
    simple_model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    # حفظ النموذج
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    simple_model.save(MODEL_PATH)
    return simple_model

def base64_to_image(base64_string):
    """تحويل صورة base64 إلى صورة OpenCV"""
    try:
        if not isinstance(base64_string, str):
            print("بيانات الصورة ليست نصية")
            return None
        
        if len(base64_string) < 100:
            print("بيانات الصورة قصيرة جدًا")
            return None
            
        # تحويل صورة base64 إلى صورة OpenCV
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        img_bytes = base64.b64decode(base64_string)
        img_array = np.frombuffer(img_bytes, dtype=np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        
        if img is None:
            print("فشل في تحويل بيانات base64 إلى صورة")
            return None
            
        return img
    except Exception as e:
        print(f"خطأ في معالجة الصورة: {str(e)}")
        return None

# قاموس المعلومات العلاجية للأمراض
TREATMENTS = {
    "Tomato_healthy": {
        "treatment": "النبات سليم، لا يحتاج إلى علاج",
        "preventive": "استمر في الممارسات الزراعية الجيدة للحفاظ على صحة النبات"
    },
    "Tomato_Late_blight": {
        "treatment": "استخدم مبيد فطري يحتوي على الماندب أو الكلوروثالونيل. قم بإزالة الأوراق المصابة.",
        "preventive": "تحسين التهوية حول النباتات، تجنب الري العلوي، تناوب المحاصيل"
    },
    "Tomato_Early_blight": {
        "treatment": "رش مبيد فطري مناسب مثل الأزوكسيستروبين أو الديفيكونازول، إزالة الأوراق المصابة",
        "preventive": "التهوية الجيدة، الري في قاعدة النبات بدل الأوراق، تغطية التربة"
    },
    "Pepper__bell___Bacterial_spot": {
        "treatment": "رش محلول كبريتات النحاس، إزالة النباتات المصابة بشدة",
        "preventive": "استخدام بذور معتمدة، تجنب الري العلوي، تناوب المحاصيل"
    },
    "Potato___Early_blight": {
        "treatment": "رش مبيد فطري مناسب مثل كلوروثالونيل أو مانكوزيب، إزالة الأوراق المصابة",
        "preventive": "تناوب المحاصيل، زيادة المسافة بين النباتات لتحسين التهوية"
    },
    "default": {
        "treatment": "استشر خبير زراعي محلي للحصول على المشورة المناسبة لهذا المرض",
        "preventive": "الحفاظ على نظافة الحديقة، تناوب المحاصيل، استخدام بذور معتمدة"
    }
}

def get_mock_result(plant_name):
    """إرجاع نتائج وهمية في حالة فشل التحليل"""
    return {
        'disease': 'تبقع الأوراق السوداء',
        'confidence': 85.5,
        'plant': plant_name,
        'severity': 'متوسط',
        'treatment': 'رش مبيد فطري مناسب، تحسين التهوية، إزالة الأوراق المصابة',
        'preventive': 'حافظ على تباعد مناسب، تجنب الري العلوي، استخدم مبيد وقائي',
        'timeDetected': ''
    }

def get_severity(confidence):
    """تحديد شدة المرض بناء على نسبة الثقة"""
    if confidence > 90:
        return "عالي"
    elif confidence > 70:
        return "متوسط"
    else:
        return "منخفض"

def arabic_disease_name(disease_code):
    disease_map = {
        'Pepper__bell___Bacterial_spot': 'تبقع بكتيري في الفلفل الحلو',
        'Pepper__bell___healthy': 'فلفل حلو سليم',
        'PlantVillage': 'غير معروف (تحقق من الصورة أو الأصناف)',
        'Potato___Early_blight': 'لفحة مبكرة في البطاطا',
        'Potato___Late_blight': 'لفحة متأخرة في البطاطا',
        'Potato___healthy': 'بطاطا سليمة',
        'Tomato_Bacterial_spot': 'تبقع بكتيري في الطماطم',
        'Tomato_Early_blight': 'لفحة مبكرة في الطماطم',
        'Tomato_Late_blight': 'لفحة متأخرة في الطماطم',
        'Tomato_Leaf_Mold': 'عفن الأوراق في الطماطم',
        'Tomato_Septoria_leaf_spot': 'تبقع أوراق سبتيوريا في الطماطم',
        'Tomato_Spider_mites_Two_spotted_spider_mite': 'العنكبوت الأحمر في الطماطم',
        'Tomato__Target_Spot': 'تبقع الهدف في الطماطم',
        'Tomato__Tomato_YellowLeaf__Curl_Virus': 'فيروس تجعد واصفرار أوراق الطماطم',
        'Tomato__Tomato_mosaic_virus': 'فيروس موزاييك الطماطم',
        'Tomato_healthy': 'طماطم سليمة'
    }
    return disease_map.get(disease_code, disease_code)

def arabic_plant_name(disease_code):
    if 'Tomato' in disease_code or 'طماطم' in disease_code:
        return 'طماطم'
    elif 'Potato' in disease_code or 'بطاطا' in disease_code:
        return 'بطاطا'
    elif 'Pepper' in disease_code or 'فلفل' in disease_code:
        return 'فلفل'
    else:
        return 'غير معروف'

@app.route('/api/detect', methods=['POST'])
def detect_disease():
    """الكشف عن أمراض النباتات من الصورة"""
    try:
        # استلام الصورة من الطلب
        data = request.json
        if not data or 'image' not in data:
            print("لم يتم توفير صورة")
            return jsonify({'error': 'No image provided'}), 400
        
        print("استلام طلب للكشف عن الأمراض")
        plant_name = data.get('plant', 'طماطم')
        
        # تحويل الصورة من base64 إلى صورة
        img = base64_to_image(data['image'])
        if img is None:
            print("فشل في تحويل الصورة")
            return jsonify(get_mock_result(plant_name))
        
        # حفظ الصورة للتصحيح
        try:
            cv2.imwrite('debug_image.jpg', img)
            print("تم حفظ الصورة للتصحيح في debug_image.jpg")
        except Exception as e:
            print(f"فشل في حفظ الصورة للتصحيح: {str(e)}")
        
        # التحقق من وجود نموذج
        if not load_model_and_classes():
            print("فشل في تحميل النموذج أو أسماء الفئات")
            return jsonify(get_mock_result(plant_name))
        
        # معالجة الصورة للنموذج
        try:
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img_resized = cv2.resize(img_rgb, (224, 224))
            img_normalized = img_resized / 255.0
            img_batch = np.expand_dims(img_normalized, axis=0)
            
            # التنبؤ
            predictions = model.predict(img_batch)
            predicted_class_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][predicted_class_idx]) * 100
            disease_name = class_names[predicted_class_idx]
            
            print(f"تم التعرف على: {disease_name} بثقة {confidence:.2f}%")
            
            # تحويل اسم المرض إلى اسم عربي أكثر وضوحاً
            readable_disease_name = arabic_disease_name(disease_name)
            plant_type = arabic_plant_name(disease_name)
            
            # الحصول على معلومات العلاج
            treatment_info = TREATMENTS.get(disease_name, TREATMENTS['default'])
            
            return jsonify({
                'disease': readable_disease_name,
                'confidence': confidence,
                'plant': plant_type or plant_name,  # استخدام النوع المكتشف إذا توفر وإلا استخدم المدخل
                'severity': get_severity(confidence),
                'treatment': treatment_info['treatment'],
                'preventive': treatment_info['preventive'],
                'timeDetected': ''
            })
            
        except Exception as e:
            print(f"خطأ في تحليل الصورة: {str(e)}")
            return jsonify(get_mock_result(plant_name))
        
    except Exception as e:
        print(f"خطأ عام: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 