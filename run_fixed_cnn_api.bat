@echo off
echo ======================================================
echo Iniciando API de detección de enfermedades de plantas
echo ======================================================
echo Este servidor API usa un modelo CNN para detectar enfermedades de plantas
echo - Si no hay modelo, se creará uno automáticamente
echo - El servidor estará disponible en http://localhost:5000/api/detect
echo.
echo [Presiona Ctrl+C para detener el servidor]
echo.
python plant_disease_cnn_api.py
pause 