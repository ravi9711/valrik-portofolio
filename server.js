// server.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(express.static('public')); // index.html serve karega

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.post('/send', async (req, res) => {
  try {
    const { name, email, tg, subject, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ ok: false, error: "Name & Message required" });
    }

    const text =
      `📨 *New Contact Form Message*\n\n` +
      `*Name:* ${name}\n` +
      (email ? `*Email:* ${email}\n` : '') +
      (tg ? `*Telegram:* @${tg}\n` : '') +
      (subject ? `*Subject:* ${subject}\n` : '') +
      `\n*Message:*\n${message}`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const r = await fetch(url, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "Markdown"
      })
    });

    const j = await r.json();
    if (!j.ok) {
      return res.status(500).json({ ok: false, error: j.description });
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
