document.getElementById('upload-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('image-input');
    const resultDiv = document.getElementById('result');
    const previewImg = document.getElementById('preview');
    resultDiv.textContent = 'جاري التشخيص...';
    if (fileInput.files.length === 0) {
        resultDiv.textContent = 'يرجى اختيار صورة.';
        return;
    }
    const file = fileInput.files[0];
    // عرض معاينة الصورة
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImg.src = e.target.result;
        previewImg.style.display = 'block';
    };
    reader.readAsDataURL(file);
    // إرسال الصورة إلى الخادم
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.result) {
            resultDiv.textContent = 'النتيجة: ' + data.result;
        } else {
            resultDiv.textContent = 'حدث خطأ في التشخيص.';
        }
    } catch (err) {
        resultDiv.textContent = 'تعذر الاتصال بالخادم.';
    }
}); 