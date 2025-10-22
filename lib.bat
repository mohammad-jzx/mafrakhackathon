@echo off
echo Installing required packages...
echo ================================

REM تحديث pip أولاً
python -m pip install --upgrade pip

REM تثبيت المكتبات الأساسية
echo Installing basic packages...
pip install streamlit==1.28.0
pip install numpy==1.24.3
pip install pandas==2.0.3
pip install pillow==10.0.0
pip install plotly==5.15.0
pip install python-dateutil==2.8.2

REM تثبيت مكتبات إضافية (اختياري - يمكن إلغاء التعليق)
REM echo Installing optional packages...
REM pip install opencv-python-headless==4.8.0.76
REM pip install speechrecognition==3.10.0
REM pip install gtts==2.3.2
REM pip install pyttsx3==2.90
REM pip install tensorflow==2.13.0
REM pip install keras==2.13.1
REM pip install scikit-learn==1.3.0

echo ================================
echo Installation completed!
echo Starting the application...
echo ================================

REM تشغيل التطبيق (غير اسم الملف حسب تطبيقك)
streamlit run app.py

pause