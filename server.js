// server.js
import 'dotenv/config';

import express from 'express';
import cors    from 'cors';
import path    from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const app  = express();
const PORT = process.env.PORT || 4000;

// لتخزين آخر قراءة
let latestReadings = {};

// Middlewares
app.use(express.json()); // لقراءة JSON من الـ POST
app.use(cors());         // للسماح بالطلبات من الواجهة

// راوت POST من ESP32 ليُحدّث latestReadings
app.post('/api/sensor/update', (req, res) => {
  latestReadings = req.body;
  console.log('Received sensor update:', latestReadings);
  res.sendStatus(204);
});

// راوت GET للواجهة لتُجلب آخر القيم
app.get('/api/sensor', (req, res) => {
  res.json(latestReadings);
});

// خدمة الملفات الثابتة من مجلد public/
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Serve the 1cnn webapp statically without modifying its files
app.use('/cnn', express.static(path.join(__dirname, '1cnn', 'webapp')));

// OpenAI Chat endpoint
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
app.get('/api/health', (req, res) => {
  res.json({ ok: true, hasOpenAI: Boolean(process.env.OPENAI_API_KEY) });
});
app.post('/api/chat/openai', async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'No message provided' });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for an agriculture app (AgriAI).' },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
    });
    const reply = completion?.choices?.[0]?.message?.content ?? 'لم يصلني رد صالح.';
    res.json({ reply });
  } catch (err) {
    console.error('OpenAI error:', err?.response?.data || err);
    res.status(500).json({ error: 'OpenAI API Error' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
