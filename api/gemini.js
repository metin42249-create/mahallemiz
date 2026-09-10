// api/gemini.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Yalnızca POST istekleri desteklenir.' });
    }

    const MY_API_KEY = process.env.GEMINI_API_KEY;

    if (!MY_API_KEY) {
        return res.status(500).json({ error: 'Sunucu hatası: API anahtarı Vercel üzerinde tanımlanmamış.' });
    }

    const { contents } = req.body;

    if (!contents) {
        return res.status(400).json({ error: 'Eksik veri: "contents" yapısı bulunamadı.' });
    }

    try {
        const googleResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${MY_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ contents })
            }
        );

        const data = await googleResponse.json();

        if (!googleResponse.ok) {
            return res.status(googleResponse.status).json({ 
                error: 'Google Gemini API hatası', 
                details: data 
            });
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error('Arka plan isteği sırasında hata oluştu:', error);
        return res.status(500).json({ error: 'Sunucu içi bir hata oluştu.' });
    }
}
