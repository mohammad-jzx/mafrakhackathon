import React, { useState, useRef } from 'react';
import { useQuestionAnalyzer } from '../hooks/useQuestionAnalyzer';

// محاكاة بيانات الحساس
const mockSensorData = {
  temperature: 27.5,
  humidity: 61,
  soilMoisture: 42,
  timestamp: '2024-06-01 10:30',
};

// محاكاة قاعدة بيانات المحاصيل
const mockCropInfo = {
  قمح: 'القمح يحتاج إلى ري معتدل وتسميد منتظم. أفضل وقت للزراعة هو الخريف.',
  طماطم: 'الطماطم تحتاج إلى تربة جيدة التصريف وري منتظم. انتبه لعلامات الاصفرار.',
  ذرة: 'الذرة تزرع في الربيع وتحتاج إلى شمس مباشرة وري كافٍ.',
};

const VoiceAssistant: React.FC = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { analyzeQuestion, isAnalyzing } = useQuestionAnalyzer();

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('متصفحك لا يدعم تحويل الصوت إلى نص');
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setListening(false);
      setAnswer('');
    };
    recognition.onerror = () => {
      setListening(false);
    };
    recognition.onend = () => {
      setListening(false);
    };
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  // عند الضغط على زر بحث
  const handleSearch = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setAnswer('');
    try {
      // استخدم الخوارزمية المحلية
      const analysis = await analyzeQuestion(transcript);
      setAnswer(analysis.suggestedResponse);
    } catch (e) {
      setAnswer('حدث خطأ أثناء التحليل.');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded shadow w-full max-w-md mx-auto my-4 text-center">
      <button
        onClick={startListening}
        className={`px-4 py-2 rounded text-white ${listening ? 'bg-red-500' : 'bg-blue-500'}`}
        disabled={listening}
      >
        {listening ? 'جاري التسجيل...' : 'ابدأ التحدث'}
      </button>
      <div className="mt-4 min-h-[40px]">
        <strong>النص المحول:</strong>
        <div className="mt-2 bg-gray-100 p-2 rounded min-h-[24px]">{transcript}</div>
      </div>
      {transcript && (
        <button
          onClick={handleSearch}
          className="mt-4 px-4 py-2 rounded text-white bg-green-600"
          disabled={loading || isAnalyzing}
        >
          {(loading || isAnalyzing) ? 'جاري التحليل...' : 'بحث'}
        </button>
      )}
      {answer && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded text-right whitespace-pre-line">
          <strong>الجواب:</strong>
          <div className="mt-2">{answer}</div>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant; 