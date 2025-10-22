from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# حل مشكلة CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# تحميل النموذج والتوكنيزر
model_path = "./arabert-intent"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)
id2label = {0: "sensor_data", 1: "crop_info", 2: "combined"}

class Query(BaseModel):
    text: str

@app.post("/predict")
def predict_intent(query: Query):
    inputs = tokenizer(query.text, return_tensors="pt", truncation=True, padding=True, max_length=32)
    with torch.no_grad():
        outputs = model(**inputs)
        pred = torch.argmax(outputs.logits, dim=1).item()
    return {"intent": id2label[pred]} 