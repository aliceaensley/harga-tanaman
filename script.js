// Script ini mensimulasikan data agar speedometer sangat responsif di browser

const speedValueEl = document.getElementById('speed-value');
const gearValueEl = document.getElementById('gear-value');
const rpmBarFillEl = document.getElementById('rpm-bar-fill');
const rpmDigitalEl = document.getElementById('rpm-value');
const statusArcFillEl = document.getElementById('status-arc-fill');
const fuelValueEl = document.getElementById('fuel-value');

// --- Konstan ---
const MAX_SPEED = 180; // MPH
const MAX_RPM = 8000;
const ARC_LENGTH = 125.66; // Panjang total busur (2 * PI * r) / 2 = 125.66 (radius 40)

let currentSpeed = 0;
let currentRPM = 0;
let currentGear = 0;
let currentFuel = 100;

// --- Logika Perhitungan ---

function updateRPM(speed, gear) {
    if (speed === 0 || gear === 0) return 0;
    
    // Model Sederhana: RPM = (Basis + (Speed * Faktor)) * Multiplier Gear
    const RPM_BASE = 1500;
    const RPM_FACTOR = 40;
    const GEAR_MULTIPLIER = [0, 1.5, 1.0, 0.8, 0.6, 0.5]; // Multiplier rendah untuk gigi tinggi

    let calculatedRpm = RPM_BASE + (speed * RPM_FACTOR * GEAR_MULTIPLIER[gear]);
    
    return Math.min(MAX_RPM, Math.max(0, calculatedRpm));
}

function updateHUD() {
    // 1. Kecepatan & Warna
    const formattedSpeed = String(Math.floor(currentSpeed)).padStart(3, '0');
    speedValueEl.textContent = formattedSpeed;

    // Perubahan warna neon saat mendekati kecepatan max
    if (currentSpeed > 150) {
        speedValueEl.style.color = 'var(--neon-red)';
        speedValueEl.style.textShadow = '0 0 20px var(--neon-red)';
    } else {
        speedValueEl.style.color = 'var(--neon-blue)';
        speedValueEl.style.textShadow = '0 0 20px var(--neon-blue)';
    }

    // 2. RPM Bar
    const rpmPercentage = currentRPM / MAX_RPM;
    const rpmBarWidth = rpmPercentage * 100;

    rpmBarFillEl.style.width = `${rpmBarWidth}%`;
    rpmDigitalEl.textContent = `${(currentRPM / 1000).toFixed(1)}K`;

    // 3. Gear
    gearValueEl.textContent = currentGear === 0 ? 'N' : currentGear;

    // 4. Fuel Arc
    const fuelPercentage = currentFuel / 100;
    
    // Stroke-dashoffset adalah offset dari awal garis (0% = tidak ada offset)
    const dashOffset = ARC_LENGTH * (1 - fuelPercentage);
    statusArcFillEl.style.strokeDashoffset = dashOffset;
    
    fuelValueEl.textContent = `${Math.floor(currentFuel)}%`;
}

// --- Logika Simulasi Interaktif ---

const ACCEL_RATE = 4; 
const DECEL_RATE = 2; 

document.addEventListener('keydown', (event) => {
    // Akselerasi (A)
    if (event.key === 'a' || event.key === 'A') {
        currentSpeed = Math.min(MAX_SPEED, currentSpeed + ACCEL_RATE);
        if (currentSpeed > 0 && currentGear === 0) currentGear = 1;

        // Simulasi pindah gigi naik saat RPM tinggi
        if (currentRPM > 6000 && currentGear < 5) {
            currentGear++;
            currentRPM = 3500; // Drop RPM saat pindah gigi
        }
    } 
    // Deselerasi (D)
    else if (event.key === 'd' || event.key === 'D') {
        currentSpeed = Math.max(0, currentSpeed - DECEL_RATE);
        if (currentSpeed <= 0) currentGear = 0;
        
        // Simulasi pindah gigi turun saat RPM rendah
        if (currentRPM < 2500 && currentGear > 1) {
            currentGear--;
        }
    }
    
    // Perbarui RPM
    currentRPM = updateRPM(currentSpeed, currentGear);
    
    // Simulasi Pengurangan Fuel (lambat)
    if (Math.random() < 0.01) { // 1% kemungkinan per tick
        currentFuel = Math.max(0, currentFuel - 0.1);
    }

    updateHUD(); 
});


// --- Start Simulasi ---
document.addEventListener('DOMContentLoaded', () => {
    // Jalankan update HUD setiap 50ms untuk tampilan yang sangat responsif
    setInterval(updateHUD, 50); 
    
    // Atur offset awal untuk Fuel Arc
    statusArcFillEl.style.strokeDashoffset = '0';
    
    updateHUD(); 
});
