import React, { useRef, useState, useEffect } from 'react';
import { Mic, StopCircle, Copy, Download, Trash2, Brain, MessageCircle } from 'lucide-react';
import { useQuestionAnalyzer } from '../hooks/useQuestionAnalyzer';

const translations = {
  ar: { copy: 'نسخ', download: 'تنزيل', clear: 'مسح', placeholder: 'سيظهر النص المحول هنا...', start: 'بدء التسجيل', stop: 'إيقاف', downloading: 'جاري التنزيل...', analyze: 'تحليل ذكي', analyzing: 'جاري التحليل...', answer: 'الإجابة الذكية' },
  en: { copy: 'Copy', download: 'Download', clear: 'Clear', placeholder: 'Transcribed text will appear here...', start: 'Start Recording', stop: 'Stop', downloading: 'Downloading...', analyze: 'Smart Analysis', analyzing: 'Analyzing...', answer: 'Smart Answer' },
} as const;
type Lang = keyof typeof translations;

const getLang = (): Lang => (document.documentElement.lang === 'ar' ? 'ar' : 'en');

const VoiceToText: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [text, setText] = useState('');
  const [lang, setLang] = useState<Lang>(getLang());
  const [downloading, setDownloading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const recognitionRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { analyzeQuestion, isAnalyzing } = useQuestionAnalyzer();
  const finalSegmentsRef = useRef<string[]>([]);

  // رسم الموجة
  const drawWave = () => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    analyser.getByteTimeDomainData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    const sliceWidth = canvas.width / dataArray.length;
    let x = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.stroke();
    animationIdRef.current = requestAnimationFrame(drawWave);
  };

  // بدء التسجيل
  const startRecording = async () => {
    setRecording(true);
    setText('');
    setAnswer('');
    setShowAnalysis(false);
    finalSegmentsRef.current = [];
    // الصوت
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
    sourceRef.current.connect(analyserRef.current);
    analyserRef.current.fftSize = 2048;
    dataArrayRef.current = new Uint8Array(analyserRef.current.fftSize);
    drawWave();
    // النص
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event: any) => {
        let interim = '';
        let newFinals: string[] = [];
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            const seg = event.results[i][0].transcript.trim();
            if (seg && !finalSegmentsRef.current.includes(seg)) {
              finalSegmentsRef.current.push(seg);
              newFinals.push(seg);
            }
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        // النص النهائي هو دمج كل الجمل النهائية + المؤقتة (إن وجدت)
        let fullText = finalSegmentsRef.current.join(' ');
        if (interim) fullText += ' ' + interim + ' [مؤقت]';
        setText(fullText.trim());
      };
      recognitionRef.current.start();
    }
  };

  // إيقاف التسجيل
  const stopRecording = () => {
    setRecording(false);
    if (recognitionRef.current) recognitionRef.current.stop();
    if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    setText((prev) => prev.replace(' [مؤقت]', ''));
  };

  // تحليل النص تلقائيًا
  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setShowAnalysis(true);
    setAnswer('');
    try {
      const analysis = await analyzeQuestion(text.replace(' [مؤقت]', ''));
      setAnswer(analysis.suggestedResponse);
    } catch (e) {
      setAnswer(lang === 'ar' ? 'حدث خطأ أثناء التحليل.' : 'An error occurred during analysis.');
    }
  };

  // تحليل تلقائي عند إيقاف التسجيل إذا كان هناك نص
  useEffect(() => {
    if (!recording && text.trim() && !showAnalysis) {
      const timer = setTimeout(() => {
        handleAnalyze();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [recording, text, showAnalysis]);

  // نسخ النص
  const handleCopy = () => {
    navigator.clipboard.writeText(text.replace(' [مؤقت]', ''));
  };

  // تنزيل النص
  const handleDownload = () => {
    setDownloading(true);
    const content = text.replace(' [مؤقت]', '') + (answer ? '\n\nالإجابة:\n' + answer : '');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voice-analysis.txt';
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      setDownloading(false);
    }, 1000);
  };

  // مسح النص
  const handleClear = () => {
    setText('');
    setAnswer('');
    setShowAnalysis(false);
    finalSegmentsRef.current = [];
  };

  // دعم تغيير اللغة تلقائيًا
  useEffect(() => {
    const observer = new MutationObserver(() => setLang(getLang()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`max-w-4xl mx-auto mt-8 rounded-2xl p-6`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-300 text-center flex items-center justify-center gap-2">
          🎤 {lang === 'ar' ? 'تحويل الصوت إلى نص مع تحليل ذكي' : 'Voice to Text with Smart Analysis'}
          <Brain className="w-6 h-6 text-blue-500" />
        </h2>
        
        {/* منطقة الموجة الصوتية */}
        <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-6 flex items-center justify-center">
          <canvas ref={canvasRef} width={600} height={120} className="w-full h-full" />
        </div>
        
        {/* أزرار التسجيل */}
        <div className="flex justify-center gap-8 mb-6">
          {!recording ? (
            <button onClick={startRecording} title={translations[lang].start}
              className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 shadow-lg flex items-center justify-center transition-all duration-200 focus:outline-none animate-pulse">
              <Mic className="w-8 h-8 text-white" />
            </button>
          ) : (
            <button onClick={stopRecording} title={translations[lang].stop}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg flex items-center justify-center transition-all duration-200 focus:outline-none">
              <StopCircle className="w-8 h-8 text-white" />
            </button>
          )}
        </div>
        
        {/* منطقة النص المحول */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {lang === 'ar' ? 'النص المحول:' : 'Transcribed Text:'}
          </label>
          <textarea
            className="w-full h-32 p-4 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
            value={text.replace(' [مؤقت]', '')}
            placeholder={translations[lang].placeholder}
            readOnly
            style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}
          />
        </div>
        
        {/* منطقة الإجابة الذكية */}
        {showAnalysis && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              {translations[lang].answer}:
            </label>
            <div className="w-full min-h-32 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-gray-100">
              {isAnalyzing ? (
                <div className="flex items-center justify-center h-24">
                  <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                  <span className="text-blue-600 dark:text-blue-400">{translations[lang].analyzing}</span>
                </div>
              ) : answer ? (
                <div className="whitespace-pre-line" style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
                  {answer}
                </div>
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-center h-24 flex items-center justify-center">
                  {lang === 'ar' ? 'اضغط "تحليل ذكي" لتحليل النص' : 'Click "Smart Analysis" to analyze the text'}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* شريط الإجراءات */}
        <div className="flex justify-between items-center mt-4" style={{ direction: 'ltr' }}>
          <div className="flex space-x-4">
            <button onClick={handleCopy} className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-green-900 transition">
              <Copy className="w-4 h-4" /> {translations[lang].copy}
            </button>
            <button onClick={handleDownload} disabled={downloading} className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition">
              <Download className="w-4 h-4" /> {downloading ? translations[lang].downloading : translations[lang].download}
            </button>
            <button onClick={handleClear} className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900 transition">
              <Trash2 className="w-4 h-4" /> {translations[lang].clear}
            </button>
          </div>
          
          {/* زر التحليل اليدوي */}
          {text.trim() && !showAnalysis && (
            <button onClick={handleAnalyze} disabled={isAnalyzing} 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition">
              <Brain className="w-4 h-4" />
              {isAnalyzing ? translations[lang].analyzing : translations[lang].analyze}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceToText; 