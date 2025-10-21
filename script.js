// GANTI DENGAN URL WEBHOOK ANDA
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1430323817137569802/vF31PN09LnMA-ua0v3WZYITnZ-_wyLapSehD0qWhWF4prdZBt_KpCwKQVJikTL9tnZp7';
// 11.1111111111111111% dalam bentuk desimal (1/9)
const PERCENTAGE_INCREASE = 0.111111111111111111; 

document.getElementById('cropPriceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const crops = [
        'Carrot', 'Potato', 'Tomato', 'Onion', 'Cucumber'
    ];
    
    let publicData = [];
    let privateData = [];
    let privatePricesHTML = '<table><thead><tr><th>Crop Name:</th><th>Crop Supply:</th><th>Selling Prices:</th></tr></thead><tbody>';
    
    const now = new Date();
    // Format waktu agar sesuai dengan contoh: Yesterday at 15.15
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).replace(':', '.');
    // Untuk tujuan demo, kita asumsikan "Hari Ini" atau "Yesterday"
    const timeText = "Hari Ini";

    // 1. Kumpulkan data dan hitung harga private
    crops.forEach(crop => {
        const cropLower = crop.toLowerCase();
        
        // Ambil nilai dari input Public
        const supplyPublic = parseFloat(formData.get(`${cropLower}SupplyPublic`));
        const pricePublic = parseFloat(formData.get(`${cropLower}PricePublic`));
        
        // Pastikan input adalah angka valid sebelum menghitung
        if (isNaN(supplyPublic) || isNaN(pricePublic)) return; 

        // Hitung harga Private: Harga Public * (1 + Persentase_Kenaikan)
        let pricePrivate = pricePublic * (1 + PERCENTAGE_INCREASE);
        
        // Bulatkan ke 2 desimal (harga mata uang)
        pricePrivate = parseFloat(pricePrivate.toFixed(2)); 

        // Simpan data
        publicData.push({
            name: crop,
            supply: supplyPublic,
            price: pricePublic.toFixed(2)
        });

        privateData.push({
            name: crop,
            supply: supplyPublic, // Supply sama dengan Public
            price: pricePrivate.toFixed(2)
        });

        // Tampilkan Harga Private di halaman web
        privatePricesHTML += `
            <tr>
                <td>${crop}</td>
                <td>${supplyPublic} crops</td>
                <td>$${pricePrivate.toFixed(2)}/crop</td>
            </tr>
        `;
    });

    privatePricesHTML += '</tbody></table>';

    // Tampilkan hasil perhitungan Private di div
    document.getElementById('privatePrices').innerHTML = privatePricesHTML + 
        `<p>👤 Last updated by Anonymous • ${timeText} at ${formattedTime}</p>`;


    // 2. Format pesan untuk Discord Webhook (Menggunakan Embeds untuk tampilan seperti tabel)
    
    // Konversi data menjadi string baris per baris untuk deskripsi Discord Embed
    const publicFields = publicData.map(c => 
        `**${c.name}**: ${c.supply} crops | **$${c.price}/crop**`
    ).join('\n');

    const privateFields = privateData.map(c => 
        `**${c.name}**: ${c.supply} crops | **$${c.price}/crop**`
    ).join('\n');

    // Struktur pesan Discord (Payload)
    const discordPayload = {
        username: "Crop Price Tracker Bot", // Nama yang akan muncul di Discord
        avatar_url: "https://i.imgur.com/your_image_url.png", // Opsional: Ganti dengan URL gambar bot Anda
        embeds: [
            {
                title: "🌱 Public Crop Prices",
                description: "Data berikut tidak otomatis diperbarui oleh server dan mungkin tidak akurat untuk periode waktu tertentu.\n\n" + publicFields,
                color: 5763719, // Warna Hijau (Discord)
            },
            {
                title: "🌿 Private Crop Prices",
                description: "Harga Private dihitung otomatis (+11.11%) berdasarkan harga publik.\n\n" + privateFields,
                color: 16753920, // Warna Emas
                footer: {
                    text: `👤 Last updated by Anonymous • ${timeText} at ${formattedTime}`
                }
            }
        ]
    };

    // 3. Kirim data ke Discord Webhook
    fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordPayload),
    })
    .then(response => {
        if (response.ok) {
            alert('✅ Data harga berhasil dikirim ke Discord!');
        } else {
            alert('❌ Gagal mengirim data ke Discord. Cek konsol untuk detail error (misalnya, URL Webhook salah).');
            console.error('Failed to send to Discord Webhook', response);
        }
    })
    .catch(error => {
        alert('Terjadi error saat koneksi/pengiriman data.');
        console.error('Error:', error);
    });
});
