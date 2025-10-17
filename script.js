// Script ini berjalan di lingkungan RageMP (Node.js/JS)
const localPlayer = mp.players.local;
let speedometerBrowser = null;

// Ganti path ke folder retro
const HTML_PATH = 'package://speedometer_retro/index.html';

// Buat browser CEF saat sumber daya dimuat
mp.events.add('clientResourceStart', () => {
    speedometerBrowser = mp.browsers.new(HTML_PATH);
});

// Event yang dipanggil setiap frame untuk memperbarui data
mp.events.add('render', () => {
    if (!speedometerBrowser) return;

    if (localPlayer.vehicle) {
        // Dapatkan kecepatan kendaraan
        let velocity = localPlayer.vehicle.getVelocity();
        let speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y + velocity.z * velocity.z);
        // Konversi dari m/s ke km/h (GTA V Native)
        let speedKmh = Math.round(speed * 3.6); 
        
        // Kirim data kecepatan ke browser CEF
        speedometerBrowser.execute(`speedometer.updateSpeed(${speedKmh});`);
        speedometerBrowser.execute(`speedometer.setVisible(true);`);
    } else {
        // Sembunyikan speedometer jika tidak di dalam kendaraan
        speedometerBrowser.execute(`speedometer.setVisible(false);`);
    }
});

// Pastikan browser dihapus saat resource berhenti
mp.events.add('clientResourceStop', () => {
    if (speedometerBrowser) {
        speedometerBrowser.destroy();
        speedometerBrowser = null;
    }
});
