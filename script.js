// Script ini mensimulasikan data HUD agar dapat dilihat di browser

const speedValueEl = document.getElementById('speed-value');
const speedUnitEl = document.getElementById('speed-unit'); // Menambahkan ini
const rpmValueEl = document.getElementById('rpm-value');
const gearValueEl = document.getElementById('gear-value');
const lightIndicatorEl = document.getElementById('light-indicator');
const rpmArcFillEl = document.getElementById('rpm-arc-fill');

let currentSpeed = 0;
let currentRPM = 0;
let currentGear = 0; // 0 = Netral (N)
let isLightsOn = false;

const MAX_SPEED = 200; // KM/H
const MAX_RPM = 8000;

// Path length of the RPM arc (from SVG 'd' attribute, roughly)
// d="M10 90 A90 90 0 0 1 190 90" => ini adalah setengah lingkaran dengan radius 90
// Keliling setengah lingkaran = pi * radius = 3.14159 * 90 = 282.74
// Tapi karena SVG dirotateY, dan start/end point, kita perlu nilai yang lebih akurat
// Untuk 90 derajat busur, panjangnya sekitar 1.57 * radius
// Untuk 180 derajat busur (setengah lingkaran), panjangnya sekitar 3.14159 * radius
// Di sini kita memiliki busur 180 derajat
const RPM_ARC_LENGTH = Math.PI * 90; // Lingkar setengah lingkaran radius 90

// --- Fungsi Update Tampilan ---

function updateHUD() {
    // Speed
    const formattedSpeed = String(Math.floor(currentSpeed)).padStart(3, '0');
    speedValueEl.textContent = formattedSpeed;

    // RPM
    const formattedRPM = String(Math.floor(currentRPM)).padStart(4, '0');
    rpmValueEl.textContent = formattedRPM;

    // Gear
    gearValueEl.textContent = currentGear === 0 ? 'N' : currentGear;

    // Lights
    if (isLightsOn) {
        lightIndicatorEl.classList.add('active');
    } else {
        lightIndicatorEl.classList.remove('active');
    }

    // RPM Arc
    const rpmPercentage = currentRPM / MAX_RPM;
    // Stroke-dasharray: 'panjang garis terlihat' 'panjang garis tidak terlihat'
    // Kita ingin mengisi dari kiri ke kanan (yang sebenarnya dari 0% ke 100% dari total panjang busur)
    const dashLength = RPM_ARC_LENGTH * rpmPercentage;
    rpmArcFillEl.style.strokeDasharray = `${dashLength} ${RPM_ARC_LENGTH - dashLength}`;
}

// --- Logika Simulasi Interaktif ---

const ACCELERATION_RATE = 2; // KM/H per tick
const DECELERATION_RATE = 1.5; // KM/H per tick
const MAX_SIMULATION_SPEED = 180; // KM/H

// Fungsi untuk menghitung RPM berdasarkan kecepatan dan gigi
function calculateRPM(speed, gear) {
    if (speed === 0 || gear === 0) return 0;
    // Ini adalah model yang sangat disederhanakan
    const rpmBase = 1500; // RPM dasar saat bergerak
    const rpmPerSpeedUnit = 50;
    const gearFactor = [0, 1.2, 0.9, 0.7, 0.5, 0.4]; // Faktor untuk setiap gigi

    let calculatedRpm = rpmBase + (speed * rpmPerSpeedUnit * gearFactor[gear]);
    return Math.min(MAX_RPM, Math.max(0, Math.floor(calculatedRpm)));
}

document.addEventListener('keydown', (event) => {
    // Accelerate (A)
    if (event.key === 'a' || event.key === 'A') {
        currentSpeed = Math.min(MAX_SIMULATION_SPEED, currentSpeed + ACCELERATION_RATE);
        if (currentSpeed > 0 && currentGear === 0) currentGear = 1; // Masuk gigi 1
        
        // Simulasikan perpindahan gigi otomatis
        if (currentSpeed > 20 && currentGear === 1 && currentRPM > 6000) currentGear = 2;
        if (currentSpeed > 50 && currentGear === 2 && currentRPM > 6000) currentGear = 3;
        if (currentSpeed > 80 && currentGear === 3 && currentRPM > 6000) currentGear = 4;
        if (currentSpeed > 120 && currentGear === 4 && currentRPM > 6000) currentGear = 5;

    } 
    // Decelerate (D)
    else if (event.key === 'd' || event.key === 'D') {
        currentSpeed = Math.max(0, currentSpeed - DECELERATION_RATE);
        if (currentSpeed <= 0) currentGear = 0; // Netral saat berhenti
        
        // Simulasikan perpindahan gigi otomatis (turun)
        if (currentSpeed < 100 && currentGear === 5) currentGear = 4;
        if (currentSpeed < 70 && currentGear === 4) currentGear = 3;
        if (currentSpeed < 40 && currentGear === 3) currentGear = 2;
        if (currentSpeed < 15 && currentGear === 2) currentGear = 1;
    }
    // Toggle Lights (L)
    else if (event.key === 'l' || event.key === 'L') {
        isLightsOn = !isLightsOn;
    }
    
    currentRPM = calculateRPM(currentSpeed, currentGear);
    updateHUD(); 
});


// --- Start Simulasi ---
document.addEventListener('DOMContentLoaded', () => {
    // Panggil updateHUD secara berkala (misal, 50ms untuk responsif)
    setInterval(updateHUD, 50); 
    
    // Inisialisasi tampilan awal
    updateHUD(); 
});
