// Script ini menggunakan logika simulasi dari versi sebelumnya,
// namun hanya menargetkan elemen-elemen kecil.

const speedValueEl = document.getElementById('speed-value-small');
const gearValueEl = document.getElementById('gear-value-small');
const rpmBarFillEl = document.getElementById('rpm-bar-fill-small');
const fuelValueEl = document.getElementById('fuel-value-small');

// --- Konstan ---
const MAX_SPEED = 180; // MPH
const MAX_RPM = 8000;

let currentSpeed = 0;
let currentRPM = 0;
let currentGear = 0;
let currentFuel = 100;

// --- Logika Perhitungan (Dipertahankan) ---

function updateRPM(speed, gear) {
    if (speed === 0 || gear === 0) return 0;
    
    const RPM_BASE = 1500;
    const RPM_FACTOR = 40;
    const GEAR_MULTIPLIER = [0, 1.5, 1.0, 0.8, 0.6, 0.5]; 

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
        speedValueEl.style.textShadow = '0 0 15px var(--neon-red)';
    } else {
        speedValueEl.style.color = 'var(--neon-blue)';
        speedValueEl.style.textShadow = '0 0 15px var(--neon-blue)';
    }

    // 2. RPM Bar
    const rpmPercentage = currentRPM / MAX_RPM;
    const rpmBarWidth = rpmPercentage * 100;

    rpmBarFillEl.style.width = `${rpmBarWidth}%`;

    // 3. Gear
    gearValueEl.textContent = currentGear === 0 ? 'N' : currentGear;

    // 4. Fuel Status
    fuelValueEl.textContent = `F: ${Math.floor(currentFuel)}`;
}

// --- Logika Simulasi Interaktif ---

const ACCEL_RATE = 4; 
const DECEL_RATE = 2; 

document.addEventListener('keydown', (event) => {
    // Akselerasi (A)
    if (event.key === 'a' || event.key === 'A') {
        currentSpeed = Math.min(MAX_SPEED, currentSpeed + ACCEL_RATE);
        if (currentSpeed > 0 && currentGear === 0) currentGear = 1;

        if (currentRPM > 6000 && currentGear < 5) {
            currentGear++;
            currentRPM = 3500; 
        }
    } 
    // Deselerasi (D)
    else if (event.key === 'd' || event.key === 'D') {
        currentSpeed = Math.max(0, currentSpeed - DECEL_RATE);
        if (currentSpeed <= 0) currentGear = 0;
        
        if (currentRPM < 2500 && currentGear > 1) {
            currentGear--;
        }
    }
    
    currentRPM = updateRPM(currentSpeed, currentGear);
    
    // Simulasi Pengurangan Fuel
    if (Math.random() < 0.01) { 
        currentFuel = Math.max(0, currentFuel - 0.1);
    }

    updateHUD(); 
});


// --- Start Simulasi ---
document.addEventListener('DOMContentLoaded', () => {
    setInterval(updateHUD, 50); 
    updateHUD(); 
});
