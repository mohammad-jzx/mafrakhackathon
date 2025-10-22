import json
import os

def convert_coco_to_yolo(coco_json_path, images_dir, output_dir, class_list):
    with open(coco_json_path, 'r', encoding='utf-8') as f:
        coco = json.load(f)

    # بناء قاموس الصور
    image_id_to_filename = {img['id']: img['file_name'] for img in coco['images']}
    # بناء قاموس الفئات
    category_id_to_index = {cat['id']: i for i, cat in enumerate(coco['categories'])}

    # جمع الأنوتيشن لكل صورة
    image_id_to_annotations = {}
    for ann in coco['annotations']:
        image_id_to_annotations.setdefault(ann['image_id'], []).append(ann)

    os.makedirs(output_dir, exist_ok=True)

    for image_id, file_name in image_id_to_filename.items():
        txt_path = os.path.join(output_dir, os.path.splitext(file_name)[0] + '.txt')
        lines = []
        anns = image_id_to_annotations.get(image_id, [])
        for ann in anns:
            cat_id = ann['category_id']
            class_idx = category_id_to_index[cat_id]
            bbox = ann['bbox']  # [x_min, y_min, width, height]
            img_w = next(img['width'] for img in coco['images'] if img['id'] == image_id)
            img_h = next(img['height'] for img in coco['images'] if img['id'] == image_id)
            # تحويل bbox إلى YOLO format (x_center, y_center, w, h) كنسبة من الحجم
            x_center = (bbox[0] + bbox[2] / 2) / img_w
            y_center = (bbox[1] + bbox[3] / 2) / img_h
            w = bbox[2] / img_w
            h = bbox[3] / img_h
            lines.append(f"{class_idx} {x_center:.6f} {y_center:.6f} {w:.6f} {h:.6f}")
        with open(txt_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))

    print(f"تم التحويل: {output_dir}")

if __name__ == "__main__":
    # عدل المسارات حسب الحاجة
    base = r'D:/DatabasesANDModels/plant_disease_coco'
    class_list = [
        'soba-plant-disease',
        '-OgPv',
        'Downy mildew',
        'black-leaf',
        'plants',
        'powdery mildew'
    ]
    # train
    convert_coco_to_yolo(
        coco_json_path=os.path.join(base, 'train', '_annotations.coco.json'),
        images_dir=os.path.join(base, 'train'),
        output_dir=os.path.join(base, 'train'),
        class_list=class_list
    )
    # valid
    convert_coco_to_yolo(
        coco_json_path=os.path.join(base, 'valid', '_annotations.coco.json'),
        images_dir=os.path.join(base, 'valid'),
        output_dir=os.path.join(base, 'valid'),
        class_list=class_list
    ) 