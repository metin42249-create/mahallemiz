// api/gemini.js

export default async function handler(req, res) {
    // 1. Güvenlik Kontrolü: Sadece POST isteklerine izin ver
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Yalnızca POST istekleri desteklenir.' });
    }

    // 2. Vercel paneline ekleyeceğiniz gizli API anahtarını çağırıyoruz
    const MY_API_KEY = process.env.GEMINI_API_KEY;

    if (!MY_API_KEY) {
        return res.status(500).json({ error: 'Sunucu hatası: API anahtarı Vercel üzerinde tanımlanmamış.' });
    }

    // 3. HTML/JavaScript kodunuzdan gelen veriyi alıyoruz
    const { contents } = req.body;

    if (!contents) {
        return res.status(400).json({ error: 'Eksik veri: "contents" yapısı bulunamadı.' });
    }

    try {
        // 4. İsteği, sizin gizli anahtarınızla arka planda Google Gemini API'sine iletiyoruz
        // (Buradaki adresi tam ve hatasız olarak güncelledik)
        const googleResponse = await fetch(
            `https://googleapis.com{MY_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ contents })
            }
        );

        // Google'dan gelen yanıtı JSON formatına çeviriyoruz
        const data = await googleResponse.json();

        // Google bir hata döndüyse bunu kullanıcıya yansıt
        if (!googleResponse.ok) {
            return res.status(googleResponse.status).json({ 
                error: 'Google Gemini API hatası', 
                details: data 
            });
        }

        // 5. Başarılı sonucu HTML sayfanıza geri gönderiyoruz
        return res.status(200).json(data);

    } catch (error) {
        console.error('Arka plan isteği sırasında hata oluştu:', error);
        return res.status(500).json({ error: 'Sunucu içi bir hata oluştu.' });
    }
}
