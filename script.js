// ====================================================================================
// PERHATIAN: URL WEBHOOK TELAH DIGANTI SESUAI PERMINTAAN TERBARU
// ====================================================================================
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1430327141265834054/5Rzq68WvTktf1-fD_tEnR1juPfl06S4SjZQQyP2Ms1gHcH_oGM__5xZ5h2BpyPnhFoSK';
const PERCENTAGE_INCREASE = 0.111111111111111111; 

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
    
    let privatePricesTableBodyHTML = ''; 
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).replace(':', '.');
    const timeText = "Hari Ini";

    // Header untuk Code Block Discord
    const header = padRight('CROP', 10) + ' ' + padRight('SUPPLY', 9) + ' ' + 'PRICE ($)';
    const separator = '-'.repeat(header.length);

    let publicFieldsText = header + '\n' + separator;
    let privateFieldsText = header + '\n' + separator;
    

    // 1. Kumpulkan data dan hitung harga private
    crops.forEach(crop => {
        const cropLower = crop.toLowerCase();
        
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

        publicFieldsText += '\n' + cropName + ' ' + supplyStr + ' ' + pricePublicFormatted;
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
    
    const publicDescription = `**Data harga publik terbaru yang dimasukkan:**\n\`\`\`css\n${publicFieldsText}\n\`\`\``;
    const privateDescription = `**Harga Private (Public + 11.11%):**\n\`\`\`yaml\n${privateFieldsText}\n\`\`\``; 

    // Gabungkan kedua data ke dalam satu Embed Field
    const discordPayload = {
        username: "Crop Price Tracker Bot",
        avatar_url: "https://discord.com/assets/f7652397753a47900b213.svg", 
        embeds: [
            {
                title: "🌱 Crop Price Report",
                description: publicDescription + '\n\n' + privateDescription, 
                color: 5763719, // Warna Hijau
                footer: {
                    text: `Diinput oleh Anonymous • ${timeText} at ${formattedTime}`,
                    icon_url: "https://discord.com/assets/f7652397753a47900b213.svg"
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
            // Log status respons untuk diagnosis
            response.text().then(text => console.error('Discord Webhook Failed. Response:', text)); 
            alert('❌ Gagal mengirim data ke Discord. Periksa konsol browser.');
        }
    })
    .catch(error => {
        alert('Terjadi error saat koneksi/pengiriman data.');
        console.error('Error:', error);
    });
});
