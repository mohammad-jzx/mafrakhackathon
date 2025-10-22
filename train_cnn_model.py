import tensorflow as tf
import os
import numpy as np
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2

# مسارات البيانات والنموذج
DATA_PATH = "./PlantVillage"  # مسار قاعدة البيانات المحلي داخل المشروع
MODEL_SAVE_PATH = "./model/plant_disease_model.h5"
CLASS_NAMES_PATH = "./model/class_names.npy"

# التأكد من وجود المجلدات
os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)

print(f"جاري تحميل البيانات من {DATA_PATH}")
print(f"سيتم حفظ النموذج في {MODEL_SAVE_PATH}")

# إعداد معالجة الصور
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    validation_split=0.2
)

# تحميل البيانات للتدريب والتحقق
print("جاري تحميل بيانات التدريب...")
train_generator = train_datagen.flow_from_directory(
    DATA_PATH,
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical',
    subset='training'
)

print("جاري تحميل بيانات التحقق...")
validation_generator = train_datagen.flow_from_directory(
    DATA_PATH,
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical',
    subset='validation'
)

# حفظ أسماء الفئات للتنبؤ لاحقاً
class_names = list(train_generator.class_indices.keys())
np.save(CLASS_NAMES_PATH, class_names)
print(f"تم حفظ أسماء الفئات: {class_names}")

# إنشاء النموذج
print("جاري بناء النموذج...")
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False  # تجميد الطبقات الأساسية

model = tf.keras.Sequential([
    base_model,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Dense(len(class_names), activation='softmax')
])

# تجميع النموذج
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# إظهار ملخص النموذج
model.summary()

# تدريب النموذج
print("جاري تدريب النموذج...")
history = model.fit(
    train_generator,
    steps_per_epoch=train_generator.samples // train_generator.batch_size,
    validation_data=validation_generator,
    validation_steps=validation_generator.samples // validation_generator.batch_size,
    epochs=15,
    callbacks=[
        tf.keras.callbacks.ReduceLROnPlateau(factor=0.2, patience=2)
    ]
)

# حفظ النموذج
print(f"حفظ النموذج في {MODEL_SAVE_PATH}...")
model.save(MODEL_SAVE_PATH)
print(f"تم الانتهاء! النموذج جاهز للاستخدام.") 