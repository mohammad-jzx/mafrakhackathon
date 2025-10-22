import express from 'express';
import bodyParser from 'body-parser';
import twilio from 'twilio';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Twilio credentials
const accountSid = 'AC22188ea22e0cd8f58d3b8073be9b98c6';
const authToken = '70ef73cbe63c42a276df21f477955a3a';
const twilioPhone = '+13513005091';

const client = twilio(accountSid, authToken);

const USERS_FILE = path.join(process.cwd(), 'users.json');

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// Register phone number
app.post('/register-phone', (req, res) => {
  const { phone } = req.body;
  if (!phone || typeof phone !== 'string' || phone.length !== 10) {
    return res.status(400).json({ success: false, error: 'رقم غير صالح' });
  }
  let users = loadUsers();
  if (users.find(u => u.id === phone)) {
    return res.json({ success: true, duplicate: true });
  }
  users.push({ id: phone });
  saveUsers(users);
  res.json({ success: true, duplicate: false });
});

// Send SMS to all registered users
app.post('/send-alert', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ success: false, error: 'رسالة مطلوبة' });
  const users = loadUsers();
  let results = [];
  for (const user of users) {
    try {
      const msg = await client.messages.create({
        body: message,
        from: twilioPhone,
        to: '+962' + user.id
      });
      results.push({ id: user.id, success: true, sid: msg.sid });
    } catch (err) {
      results.push({ id: user.id, success: false, error: err.message });
    }
  }
  res.json({ success: true, results });
});

// Old single SMS endpoint (optional, can keep for direct use)
app.post('/send-sms', async (req, res) => {
  const { to, message } = req.body;
  try {
    const msg = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: to
    });
    res.json({ success: true, sid: msg.sid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`SMS server running on port ${PORT}`)); 