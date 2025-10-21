const DISCORD_WEBHOOK_URL = 'GANTI_DENGAN_URL_WEBHOOK_ANDA_DI_SINI';
const PERCENTAGE_INCREASE = 0.111111111111111111; // 11.1111111111111111%

document.getElementById('cropPriceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const crops = [
        'Carrot', 'Potato', 'Tomato', 'Onion', 'Cucumber'
    ];
    
    let publicData = [];
    let privateData = [];
    let privatePricesHTML = '';
    
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    // 1. Kumpulkan data dan hitung harga private
    crops.forEach(crop => {
        const cropLower = crop.toLowerCase();
        
        // Ambil nilai dari input Public
        const supplyPublic = parseFloat(formData.get(`${cropLower}SupplyPublic`));
        const pricePublic = parseFloat(formData.get(`${cropLower}PricePublic`));

        // Hitung harga Private
        // Harga Private = Harga Public * (1 + 11.1111111111111111%)
        let pricePrivate = pricePublic * (1 + PERCENTAGE_INCREASE);
        
        // Bulatkan ke 2 desimal
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
        privatePricesHTML += `<p>
            <strong>${crop}</strong>: 
            Supply: ${supplyPublic} crops, 
            Selling Prices: Rp${pricePrivate.toFixed(2)}/crop
        </p>`;
    });

    // Tampilkan hasil perhitungan Private di div
    document.getElementById('privatePrices').innerHTML = privatePricesHTML;

    // 2. Format pesan untuk Discord Webhook
    
    // Buat deskripsi Public
    const publicFields = publicData.map(c => 
        `**${c.name}**: ${c.supply} crops, **Rp${c.price}/crop**`
    ).join('\n');

    // Buat deskripsi Private
    const privateFields = privateData.map(c => 
        `**${c.name}**: ${c.supply} crops, **Rp${c.price}/crop**`
    ).join('\n');

    // Struktur pesan Discord (Embed)
    const discordPayload = {
        embeds: [
            {
                title: "🌱 Public Crop Prices",
                description: publicFields,
                color: 65280, // Warna hijau
            },
            {
                title: "🌿 Private Crop Prices",
                description: privateFields,
                color: 16753920, // Warna emas
                footer: {
                    text: `Last updated by Anonymous • Hari Ini at ${formattedTime}`
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
            alert('Data berhasil dikirim ke Discord!');
            console.log('Successfully sent to Discord Webhook');
        } else {
            alert('Gagal mengirim data ke Discord. Periksa URL Webhook Anda.');
            console.error('Failed to send to Discord Webhook', response);
        }
    })
    .catch(error => {
        alert('Terjadi error saat koneksi ke Discord.');
        console.error('Error:', error);
    });
});
