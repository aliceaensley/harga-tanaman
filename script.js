// GANTI DENGAN URL WEBHOOK ANDA
const DISCORD_WEBHOOK_URL = '[https://discord.com/api/webhooks/1430323817137569802/vF31PN09LnMA-ua0v3WZYITnZ-_wyLapSehD0qWhWF4prdZBt_KpCwKQVJikTL9tnZp7](https://discord.com/api/webhooks/1430323817137569802/vF31PN09LnMA-ua0v3WZYITnZ-_wyLapSehD0qWhWF4prdZBt_KpCwKQVJikTL9tnZp7)';
// 11.1111111111111111% dalam bentuk desimal (1/9)
const PERCENTAGE_INCREASE = 0.111111111111111111; 

// Fungsi untuk menyesuaikan padding data agar sejajar di Discord Code Block
function padRight(str, length) {
    return str.padEnd(length, ' ');
}

document.getElementById('cropPriceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const crops = [
        'Carrot', 'Potato', 'Tomato', 'Onion', 'Cucumber'
    ];
    
    let publicData = [];
    let privateData = [];
    let privatePricesTableBodyHTML = ''; 
    
    const now = new Date();
    // Format waktu: 15.15
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).replace(':', '.');
    const timeText = "Hari Ini";

    // Header untuk Code Block Discord (lebar disesuaikan)
    const header = padRight('CROP', 10) + ' ' + padRight('SUPPLY', 9) + ' ' + 'PRICE ($)';
    const separator = '-'.repeat(header.length);

    let publicFieldsText = header + '\n' + separator;
    let privateFieldsText = header + '\n' + separator;
    

    // 1. Kumpulkan data dan hitung harga private
    crops.forEach(crop => {
        const cropLower = crop.toLowerCase();
        
        // Ambil nilai dari input Public
        const supplyPublic = parseFloat(formData.get(`${cropLower}SupplyPublic`));
        const pricePublic = parseFloat(formData.get(`${cropLower}PricePublic`));
        
        if (isNaN(supplyPublic) || isNaN(pricePublic)) return; 

        // Hitung harga Private
        let pricePrivate = pricePublic * (1 + PERCENTAGE_INCREASE);
        pricePrivate = parseFloat(pricePrivate.toFixed(2)); 

        const pricePublicFormatted = pricePublic.toFixed(2);
        const pricePrivateFormatted = pricePrivate.toFixed(2);

        // Siapkan Baris untuk Discord Code Block
        const cropName = padRight(crop, 10);
        const supplyStr = padRight(supplyPublic.toString(), 9);

        // Data Public untuk Discord
        publicFieldsText += '\n' + cropName + ' ' + supplyStr + ' ' + pricePublicFormatted;
        
        // Data Private untuk Discord
        privateFieldsText += '\n' + cropName + ' ' + supplyStr + ' ' + pricePrivateFormatted;


        // Bangun HTML untuk tabel Private Prices di halaman web
        privatePricesTableBodyHTML += `
            <tr>
                <td>${crop}</td>
                <td>${supplyPublic} crops</td>
                <td>$${pricePrivateFormatted}/crop</td>
            </tr>
        `;
    });

    // Perbarui konten tabel private prices di halaman web
    document.getElementById('privatePricesTableBody').innerHTML = privatePricesTableBodyHTML;
    document.getElementById('privatePricesFooter').innerHTML = 
        `<img src="https://discord.com/assets/f7652397753a47900b213.svg" alt="Anonymous icon"> Last updated by Anonymous • ${timeText} at ${formattedTime}`;


    // 2. Format pesan untuk Discord Webhook (Menggunakan Code Block Markdown)
    
    // Bungkus teks data dengan Code Block
    const publicDescription = `\`\`\`css\n${publicFieldsText}\n\`\`\``;
    const privateDescription = `\`\`\`yaml\n${privateFieldsText}\n\`\`\``; // Menggunakan yaml untuk warna yang berbeda

    // Struktur pesan Discord (Payload)
    const discordPayload = {
        username: "Crop Price Tracker Bot",
        avatar_url: "[https://discord.com/assets/f7652397753a47900b213.svg](https://discord.com/assets/f7652397753a47900b213.svg)", 
        embeds: [
            {
                title: "🌱 Public Crop Prices",
                description: `**Data harga publik terbaru yang dimasukkan:**\n${publicDescription}`,
                color: 5763719, // Warna Hijau
                footer: {
                    text: `Diinput oleh Anonymous • ${timeText} at ${formattedTime}`,
                    icon_url: "[https://discord.com/assets/f7652397753a47900b213.svg](https://discord.com/assets/f7652397753a47900b213.svg)"
                }
            },
            {
                title: "🌿 Private Crop Prices (Auto-Calculated)",
                description: `**Harga Private (Public + 11.11%):**\n${privateDescription}`,
                color: 16753920, // Warna Emas
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
            alert('❌ Gagal mengirim data ke Discord. Periksa konsol browser.');
            console.error('Failed to send to Discord Webhook', response);
        }
    })
    .catch(error => {
        alert('Terjadi error saat koneksi/pengiriman data.');
        console.error('Error:', error);
    });
});
