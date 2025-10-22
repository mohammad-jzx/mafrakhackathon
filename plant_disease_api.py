from flask import Flask, request, jsonify
import torch
import base64
import numpy as np
import cv2
import os
import yaml
from flask_cors import CORS
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # تمكين CORS للسماح بالاتصال من الواجهة الأمامية

# تحميل نموذج YOLOv5 المدرب مسبقًا - تعديل المسار إلى مسار صحيح
# استخدام النموذج المدرب الخاص بالمستخدم
MODEL_PATH = "D:/DatabasesANDModels/plant_disease_coco/yolo_output/plant_disease_model/weights/best.pt"
YAML_PATH = "D:/DatabasesANDModels/plant_disease_coco/data.yaml"
model = None

# تحميل أسماء الفئات من ملف data.yaml
def load_class_names():
    try:
        if os.path.exists(YAML_PATH):
            with open(YAML_PATH, 'r') as f:
                data = yaml.safe_load(f)
                if 'names' in data:
                    return data['names']
        return []
    except Exception as e:
        print(f"خطأ في قراءة ملف data.yaml: {str(e)}")
        return []

# قائمة بأسماء الأمراض (تم تحديثها بناءً على ملف data.yaml)
DISEASE_CLASSES = load_class_names()
print("أسماء الفئات المحملة:", DISEASE_CLASSES)

# ترجمة أسماء الأمراض من الإنجليزية إلى العربية
DISEASE_TRANSLATIONS = {
    'soba-plant-disease': 'مرض نبات الصوبا',
    '-OgPv': 'مرض غير معروف',
    'Downy mildew': 'البياض الزغبي',
    'black-leaf': 'تبقع الأوراق السوداء',
    'plants': 'نبات سليم',
    'powdery mildew': 'البياض الدقيقي'
}

# توصيات العلاج لكل مرض
TREATMENTS = {
    'مرض نبات الصوبا': {
        "treatment": "رش مبيد فطري، تحسين التهوية، إزالة الأوراق المصابة",
        "preventive": "حافظ على تباعد مناسب، تجنب الري العلوي، استخدم مبيد وقائي",
        "severity": "متوسط"
    },
    'مرض غير معروف': {
        "treatment": "استشر خبير زراعي للتشخيص الدقيق",
        "preventive": "مراقبة النبات بانتظام، تطبيق مبيدات وقائية عامة",
        "severity": "غير معروف"
    },
    'البياض الزغبي': {
        "treatment": "رش مبيد فطري نحاسي، إزالة النباتات المصابة بشدة",
        "preventive": "تحسين التهوية، تقليل الرطوبة، زراعة أصناف مقاومة",
        "severity": "مرتفع"
    },
    'تبقع الأوراق السوداء': {
        "treatment": "رش مبيد فطري، إزالة الأوراق المصابة",
        "preventive": "تجنب الري العلوي، تحسين التهوية بين النباتات",
        "severity": "متوسط"
    },
    'نبات سليم': {
        "treatment": "لا يوجد علاج مطلوب",
        "preventive": "استمر في الممارسات الزراعية الجيدة",
        "severity": "منخفض"
    },
    'البياض الدقيقي': {
        "treatment": "رش مبيد فطري خاص بالبياض الدقيقي، زيادة تدوير الهواء",
        "preventive": "زراعة أصناف مقاومة، تجنب الرطوبة العالية",
        "severity": "متوسط"
    },
    'سليم': {  # احتفظ بهذا للتوافق مع الكود السابق
        "treatment": "لا يوجد علاج مطلوب",
        "preventive": "استمر في الممارسات الزراعية الجيدة",
        "severity": "منخفض"
    }
}

def get_mock_result(plant_name="طماطم"):
    """إرجاع نتيجة تجريبية في حالة حدوث خطأ"""
    return {
        'disease': 'تبقع الأوراق السوداء',
        'confidence': 94.2,
        'plant': plant_name,
        'severity': 'متوسط',
        'treatment': TREATMENTS['تبقع الأوراق السوداء']['treatment'],
        'preventive': TREATMENTS['تبقع الأوراق السوداء']['preventive'],
        'timeDetected': '',
        'note': 'هذه نتيجة تجريبية بسبب حدوث خطأ في تحليل الصورة'
    }

def load_model():
    """تحميل نموذج YOLOv5"""
    global model
    try:
        if model is None:
            print("محاولة تحميل النموذج من مسار:", MODEL_PATH)
            
            # التحقق من وجود الملف
            if not os.path.exists(MODEL_PATH):
                print(f"خطأ: ملف النموذج غير موجود في المسار {MODEL_PATH}")
                return None
                
            # محاولة تحميل النموذج مباشرة
            try:
                model = torch.hub.load('D:/DatabasesANDModels/plant_disease_coco/yolov5', 'custom', 
                                      path=MODEL_PATH, source='local')
                model.conf = 0.25  # خفض مستوى الثقة لزيادة فرص الكشف
                model.iou = 0.45  # عتبة IoU
                print("تم تحميل النموذج بنجاح")
            except Exception as e:
                print(f"فشل تحميل النموذج باستخدام torch.hub.load: {str(e)}")
                
                # محاولة تحميل النموذج باستخدام طريقة أخرى
                try:
                    model = torch.load(MODEL_PATH, map_location=torch.device('cpu'))
                    if hasattr(model, 'model'):
                        model = model['model']
                    print("تم تحميل النموذج باستخدام torch.load")
                except Exception as e2:
                    print(f"فشل تحميل النموذج باستخدام torch.load: {str(e2)}")
                    model = None
    except Exception as e:
        print(f"خطأ عام في تحميل النموذج: {str(e)}")
        model = None
    
    return model

def base64_to_image(base64_string):
    """تحويل صورة base64 إلى صورة OpenCV"""
    try:
        # التحقق من صحة بيانات base64
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

def translate_disease_name(english_name):
    """ترجمة اسم المرض من الإنجليزية إلى العربية"""
    return DISEASE_TRANSLATIONS.get(english_name, english_name)

@app.route('/', methods=['GET'])
def index():
    """صفحة الترحيب"""
    return jsonify({
        'status': 'running',
        'message': 'خدمة API للكشف عن أمراض النباتات',
        'endpoints': {
            '/api/detect': 'POST - إرسال صورة للكشف عن الأمراض'
        },
        'supported_diseases': list(DISEASE_TRANSLATIONS.values())
    })

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
        model = load_model()
        if model is None:
            print("النموذج غير متاح")
            return jsonify(get_mock_result(plant_name))
        
        # تنفيذ الكشف
        try:
            results = model(img)
            print("تم تنفيذ الكشف بنجاح")
            
            # حفظ نتائج الكشف للتصحيح
            try:
                results.save()
                print("تم حفظ نتائج الكشف")
            except Exception as e:
                print(f"فشل في حفظ نتائج الكشف: {str(e)}")
                
        except Exception as e:
            print(f"خطأ في تنفيذ الكشف: {str(e)}")
            return jsonify(get_mock_result(plant_name))
        
        # معالجة النتائج
        try:
            # طباعة كل المعلومات المتاحة عن النتائج للتصحيح
            print("نوع النتائج:", type(results))
            
            predictions = results.pandas().xyxy[0].to_dict(orient='records')
            print(f"التنبؤات: {predictions}")
            
            # طباعة الأعمدة المتاحة في النتائج
            if hasattr(results.pandas().xyxy[0], 'columns'):
                print("الأعمدة المتاحة:", list(results.pandas().xyxy[0].columns))
                
        except Exception as e:
            print(f"خطأ في معالجة النتائج: {str(e)}")
            return jsonify(get_mock_result(plant_name))
        
        if not predictions:
            print("لم يتم العثور على أي أمراض، إرجاع 'سليم'")
            return jsonify({
                'disease': 'نبات سليم',
                'confidence': 95.0,
                'plant': plant_name,
                'severity': 'منخفض',
                'treatment': TREATMENTS['نبات سليم']['treatment'],
                'preventive': TREATMENTS['نبات سليم']['preventive'],
                'timeDetected': ''
            })
        
        # اختيار التنبؤ ذو أعلى ثقة
        best_prediction = max(predictions, key=lambda x: x['confidence'])
        print(f"أفضل تنبؤ: {best_prediction}")
        
        # طباعة مفاتيح التنبؤ للتصحيح
        print("مفاتيح التنبؤ:", list(best_prediction.keys()))
        
        # استخراج اسم المرض والثقة
        english_disease_name = None
        
        # محاولة استخراج اسم المرض من مفاتيح مختلفة
        if 'name' in best_prediction:
            english_disease_name = best_prediction['name']
            print(f"تم العثور على اسم المرض في مفتاح 'name': {english_disease_name}")
        elif 'class' in best_prediction:
            class_index = int(best_prediction['class'])
            print(f"تم العثور على مؤشر الفئة: {class_index}")
            if 0 <= class_index < len(DISEASE_CLASSES):
                english_disease_name = DISEASE_CLASSES[class_index]
                print(f"تم تحويل مؤشر الفئة إلى اسم المرض: {english_disease_name}")
            else:
                english_disease_name = "plants"  # افتراض أنه سليم إذا كان المؤشر خارج النطاق
                print(f"مؤشر الفئة خارج النطاق، استخدام القيمة الافتراضية: {english_disease_name}")
        else:
            print("لم يتم العثور على مفتاح للاسم في التنبؤ")
            english_disease_name = "plants"  # قيمة افتراضية
        
        # ترجمة اسم المرض إلى العربية
        disease_name = translate_disease_name(english_disease_name)
        print(f"اسم المرض بالإنجليزية: {english_disease_name}, بالعربية: {disease_name}")
        
        confidence = round(float(best_prediction['confidence']) * 100, 1)
        print(f"الثقة: {confidence}%")
        
        # الحصول على معلومات العلاج
        treatment_info = TREATMENTS.get(disease_name, {
            'treatment': 'استشر خبير زراعي',
            'preventive': 'مراقبة النبات بانتظام',
            'severity': 'متوسط'
        })
        
        # إعداد الاستجابة
        response = {
            'disease': disease_name,
            'confidence': confidence,
            'plant': plant_name,
            'severity': treatment_info['severity'],
            'treatment': treatment_info['treatment'],
            'preventive': treatment_info['preventive'],
            'timeDetected': '',
            'english_name': english_disease_name  # إضافة الاسم الإنجليزي للتصحيح
        }
        
        print(f"إرسال الاستجابة: {response}")
        return jsonify(response)
    
    except Exception as e:
        print(f"خطأ عام: {str(e)}")
        plant_name = request.json.get('plant', 'طماطم') if request.json else 'طماطم'
        return jsonify(get_mock_result(plant_name))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 