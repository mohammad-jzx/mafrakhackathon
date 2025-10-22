from fastapi import FastAPI
from pydantic import BaseModel
import joblib
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# إعدادات CORS للسماح بجميع الطلبات من أي مصدر
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load(r"D:\DatabasesANDModels\rf_model.pkl")

class SensorInput(BaseModel):
    temp: float
    humidity: float
    soil_moisture: float
    ph: float
    n: float
    p: float
    k: float
    ec: float

@app.post("/predict")
def predict(input: SensorInput):
    X = [[
        input.temp, input.humidity, input.soil_moisture,
        input.ph, input.n, input.p, input.k, input.ec
    ]]
    pred = model.predict(X)[0]
    # تحويل التوصية إلى وصف عربي دقيق
    def arabic_description(label):
        mapping = {
            'bad temperature': 'درجة الحرارة غير مناسبة للنمو. يُنصح بضبط نظام التدفئة أو التبريد.',
            'bad humidity': 'الرطوبة غير مناسبة. يُفضل تعديل الري أو التهوية.',
            'bad soil moisture': 'رطوبة التربة غير كافية أو زائدة. راقب نظام الري.',
            'bad ph': 'درجة الحموضة (pH) خارج النطاق المثالي. يُنصح بضبط التربة.',
            'bad nitrogen': 'نقص أو زيادة في النيتروجين. اضبط التسميد النيتروجيني.',
            'bad phosphorus': 'نقص أو زيادة في الفسفور. اضبط التسميد الفوسفوري.',
            'bad potassium': 'نقص أو زيادة في البوتاسيوم. اضبط التسميد البوتاسيومي.',
            'good': 'جميع المؤشرات البيئية في النطاق المثالي. استمر في المتابعة بنفس الطريقة!',
        }
        return mapping.get(str(label).strip().lower(), f'ملاحظة: {label}')
    return {"recommendation": arabic_description(pred)}
