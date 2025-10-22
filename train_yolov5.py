import os
import sys
import subprocess

# 1. تثبيت YOLOv5 والمتطلبات إذا لم تكن موجودة
def install_yolov5():
    if not os.path.exists('yolov5'):
        print('Downloading YOLOv5...')
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'torch', 'torchvision', 'pyyaml', 'opencv-python'])
        subprocess.check_call(['git', 'clone', 'https://github.com/ultralytics/yolov5.git'])
        print('YOLOv5 downloaded.')
    else:
        print('YOLOv5 already exists.')

# 2. تحديد مسار البيانات الخارجي وملف data.yaml
data_dir = r'D:/DatabasesANDModels/plant_disease_coco'
data_yaml = os.path.join(data_dir, 'data.yaml')

if not os.path.exists(data_yaml):
    print(f'يرجى إنشاء ملف data.yaml في {data_dir} قبل بدء التدريب.')
    sys.exit(1)

# 3. تدريب النموذج

os.environ['TORCH_HOME'] = r'D:/DatabasesANDModels/plant_disease_coco/torch_cache'
os.environ['HF_HOME'] = r'D:/DatabasesANDModels/plant_disease_coco/hf_cache'
os.environ['ULTRALYTICS_CACHE_DIR'] = r'D:/DatabasesANDModels/plant_disease_coco/ultralytics_cache'

def train():
    install_yolov5()
    os.chdir('yolov5')
    # يمكنك تعديل المعلمات أدناه حسب الحاجة
    command = [
        sys.executable, 'train.py',
        '--img', '416',
        '--batch', '8',
        '--epochs', '50',
        '--data', data_yaml,
        '--weights', 'yolov5s.pt',
        '--project', r'D:/DatabasesANDModels/plant_disease_coco/yolo_output',
        '--name', 'plant_disease_model',
        '--exist-ok'
    ]
    print('تشغيل التدريب...')
    subprocess.check_call(command)
    print('تم التدريب! ستجد النموذج في مجلد yolo_output/plant_disease_model')

if __name__ == '__main__':
    train() 