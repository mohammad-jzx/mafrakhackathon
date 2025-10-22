import json
import matplotlib.pyplot as plt

# تحميل نتائج التدريب
with open('training_hist.json', 'r') as f:
    history = json.load(f)

# رسم منحنى الدقة
plt.figure(figsize=(10,5))
plt.plot(history['accuracy'], label='Training Accuracy', color='red')
plt.plot(history['val_accuracy'], label='Validation Accuracy', color='blue')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.title('Accuracy Curve')
plt.legend()
plt.grid(True)
plt.show()

# رسم منحنى الخسارة
plt.figure(figsize=(10,5))
plt.plot(history['loss'], label='Training Loss', color='orange')
plt.plot(history['val_loss'], label='Validation Loss', color='green')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.title('Loss Curve')
plt.legend()
plt.grid(True)
plt.show() 