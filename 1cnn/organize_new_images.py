import os
import shutil
import random

# مسارات المجلدات
source_dir = r'C:/Users/moham/OneDrive/Desktop/New folder (5)'
dest_train = r'New Plant Diseases Dataset(Augmented)/New Plant Diseases Dataset(Augmented)/train'
dest_valid = r'New Plant Diseases Dataset(Augmented)/New Plant Diseases Dataset(Augmented)/valid'

# تجاهل مجلد PlantDoc-Dataset-master
ignore_folders = ['PlantDoc-Dataset-master']

# الحصول على أسماء المجلدات (الفئات)
all_folders = [f for f in os.listdir(source_dir) if os.path.isdir(os.path.join(source_dir, f)) and f not in ignore_folders]

for folder in all_folders:
    class_path = os.path.join(source_dir, folder)
    images = [img for img in os.listdir(class_path) if os.path.isfile(os.path.join(class_path, img))]
    random.shuffle(images)
    n_total = len(images)
    n_train = int(n_total * 0.8)
    train_imgs = images[:n_train]
    valid_imgs = images[n_train:]

    # إنشاء مجلدات الوجهة إذا لم تكن موجودة
    train_class_dir = os.path.join(dest_train, folder)
    valid_class_dir = os.path.join(dest_valid, folder)
    os.makedirs(train_class_dir, exist_ok=True)
    os.makedirs(valid_class_dir, exist_ok=True)

    # نسخ صور التدريب
    for img in train_imgs:
        src = os.path.join(class_path, img)
        dst = os.path.join(train_class_dir, img)
        shutil.copy2(src, dst)

    # نسخ صور التحقق
    for img in valid_imgs:
        src = os.path.join(class_path, img)
        dst = os.path.join(valid_class_dir, img)
        shutil.copy2(src, dst)

print('تم تنظيم ودمج الصور بنجاح!') 