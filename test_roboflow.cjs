const axios = require('axios');
const fs = require('fs');

// استبدل هذه القيم بما يناسبك
const API_KEY = 'kYYqfsrR2UcIaOfDvrVx';
const MODEL_SLUG = 'fruit-ripening-process';
const VERSION = 1;

// ضع هنا مسار صورة اختبار لديك
const imagePath = 'lemon.jpg';

const imageBuffer = fs.readFileSync(imagePath);
const base64Image = imageBuffer.toString('base64');

axios.post(
  `https://detect.roboflow.com/${MODEL_SLUG}/${VERSION}?api_key=${API_KEY}`,
  { image: `data:image/jpeg;base64,${base64Image}` },
  { headers: { 'Content-Type': 'application/json' } }
)
.then(response => {
  console.log('نجح الاتصال! النتيجة:', response.data);
})
.catch(error => {
  console.error('فشل الاتصال! الخطأ:', error.response ? error.response.data : error.message);
});