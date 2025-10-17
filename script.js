const speedValueEl = document.getElementById('speed-value');
const gearValueEl = document.getElementById('gear-value');
const outerRingFillEl = document.getElementById('outer-ring-fill');
const fuelBarFillEl = document.getElementById('fuel-bar-fill');
const healthBarFillEl = document.getElementById('health-bar-fill');

// --- Konstan NUI ---
const MAX_RPM = 8000;
const MAX_RPM_ANGLE = 270; // Sudut putaran ring luar

// Fungsi utama untuk memperbarui HUD berdasarkan data yang dikirim dari game
function updateHUD(data) {
    
    if (!data || data.type !== 'updateSpeedometer') return;

    // 1. Kecepatan Digital (data.speed = KM/H)
    const speed = Math.floor(data.speed);
    const formattedSpeed = String(speed).padStart(3, '0');
    speedValueEl.textContent = formattedSpeed;

    // 2. RPM Ring Luar (data.rpm = 0.0 sampai 1.0)
    const rpmValue = data.rpm * MAX_RPM;
    const rpmPercentage = data.rpm;

    // Hitung sudut putaran dari posisi awal (45 derajat)
    const rotationDegrees = 45 + (rpmPercentage * MAX_RPM_ANGLE);
    outerRingFillEl.style.transform = `rotate(${rotationDegrees}deg)`;
    
    // Logika pewarnaan RPM (Redline pada 7000 RPM)
    if (rpmValue > 7000) {
        outerRingFillEl.style.borderColor = '#ff5252'; // Danger Red
        outerRingFillEl.style.filter = 'drop-shadow(0 0 8px #ff5252)';
    } else if (rpmValue > 5000) {
        outerRingFillEl.style.borderColor = '#FFC107'; // Warning Yellow
        outerRingFillEl.style.filter = 'drop-shadow(0 0 6px #FFC107)';
    } else {
        outerRingFillEl.style.borderColor = '#00bcd4'; // Accent Blue
        outerRingFillEl.style.filter = 'drop-shadow(0 0 7px #00bcd4)';
    }

    // 3. Gear Display
    // Asumsi: data.gear 0=Netral, 1+=Gigi
    gearValueEl.textContent = data.gear === 0 ? 'N' : data.gear;

    // 4. Fuel Bar (data.fuel = 0-100%)
    fuelBarFillEl.style.width = `${data.fuel}%`;
    const fuelColor = data.fuel < 20 ? '#ff5252' : data.fuel < 50 ? '#FFC107' : '#4CAF50';
    fuelBarFillEl.style.backgroundColor = fuelColor;

    // 5. Health Bar (data.engineHealth = 0-100%)
    healthBarFillEl.style.width = `${data.engineHealth}%`;
    const healthColor = data.engineHealth < 20 ? '#ff5252' : data.engineHealth < 50 ? '#FFC107' : '#4CAF50';
    healthBarFillEl.style.backgroundColor = healthColor;
    
    // 6. Tampilkan/Sembunyikan Kontainer
    const container = document.getElementById('speedometer-container');
    if (data.inVehicle) {
        container.style.display = 'flex'; 
    } else {
        container.style.display = 'none'; 
    }
}

// --- Event Listener untuk Menerima Data dari Game (PENTING!) ---

window.addEventListener('message', (event) => {
    // Memproses pesan yang dikirim dari skrip game (Lua/JS Client)
    updateHUD(event.data);
});

// Sembunyikan secara default saat NUI dimuat
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('speedometer-container').style.display = 'none';
    
    // Tambahkan kode untuk mengirim sinyal siap ke game jika diperlukan resource Anda.
    /*
    if (typeof GetParentResourceName !== 'undefined') {
        fetch(`https://${GetParentResourceName()}/nuiReady`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({})
        });
    }
    */
});
