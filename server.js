const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Xosting taqdim etadigan portni olish yoki bo'lmasa standart 3000 
const PORT = process.env.PORT || 3000;

// Frontend fayllarni ulash
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Telegram API Endpoint
app.post('/api/booking', async (req, res) => {
    try {
        const { name, phone, date, service } = req.body;

        if (!name || !phone || !date || !service) {
            return res.status(400).json({ success: false, message: "Barcha maydonlarni to'ldiring!" });
        }

        // Xosting muhitidan tokenlarni o'qish
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        // Agar xostingda xatolik qilib tokenlar kiritilmagan bo'lsa tekshirish
        if (!BOT_TOKEN || !CHAT_ID) {
            console.error("Xatolik: Telegram tokenlari xosting sozlamalarida (Environment Variables) topilmadi!");
            return res.status(500).json({ success: false, message: "Server sozlamalarida xatolik." });
        }

        const message = 
            `🐝 Asal Ari Klinikasi\n\n` +
            `📥 Yangi qabul so'rovi\n\n` +
            `👤 Ism: ${name}\n` +
            `📞 Telefon: ${phone}\n` +
            `📅 Sana: ${date}\n` +
            `💉 Xizmat: ${service}`;

        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        
        await axios.post(telegramUrl, {
            chat_id: CHAT_ID,
            text: message
        });

        return res.status(200).json({ success: true, message: "Muvaffaqiyatli yuborildi!" });

    } catch (error) {
        console.error("Telegram xatoligi:", error.response ? error.response.data : error.message);
        return res.status(500).json({ success: false, message: "Serverda xatolik yuz berdi." });
    }
});

// Express v5 uchun barcha yo'nalishlarni index.html ga qaytarish (Wildcard)
app.get('{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda muvaffaqiyatli ishlayapti... 🚀`);
});
