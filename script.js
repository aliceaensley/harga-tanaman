// Script ini mensimulasikan data untuk HUD bergaya Pixel Retro

const speedValueEl = document.getElementById('speed-value-pixel');
const rpmValueEl = document.getElementById('rpm-value-pixel');
const gearValueEl = document.getElementById('gear-value-pixel');
const healthFillEl = document.getElementById('health-fill-pixel');
const fuelFillEl = document.getElementById('fuel-fill-pixel');
const lightIndicatorEl = document.getElementById('light-indicator-pixel');

// --- Konstan ---
const MAX_SPEED = 180; // MPH
const MAX_RPM = 8000;

let currentSpeed = 0;
let currentRPM = 0;
let currentGear = 0; // 0 = Netral (N)
let currentHealth = 100;
let currentFuel = 100;

// --- Logika Perhitungan ---

function updateRPM(speed, gear) {
    if (speed === 0 || gear === 0) return 0;
    
    const RPM_BASE = 1500;
    const RPM_FACTOR = 40;
    const GEAR_MULTIPLIER = [0, 1.5, 1.0, 0.8, 0.6, 0.5]; 

    let calculatedRpm = RPM_BASE + (speed * RPM_FACTOR * GEAR_MULTIPLIER[gear]);
    
    return Math.min(MAX_RPM, Math.max(0, calculatedRpm));
}

function updateHUD() {
    // 1. Speed & Gear
    const formattedSpeed = String(Math.floor(currentSpeed)).padStart(3, '0');
    speedValueEl.textContent = formattedSpeed;
    gearValueEl.textContent = currentGear === 0 ? 'N' : currentGear;

    // 2. RPM (dikonversi ke Kilo RPM)
    const rpmKilo = (currentRPM / 1000).toFixed(1);
    rpmValueEl.textContent = rpmKilo;

    // 3. Health Bar
    healthFillEl.style.width = `${currentHealth}%`;
    if (currentHealth < 25) {
        healthFillEl.style.backgroundColor = '#FF0000'; // Merah saat low
        healthFillEl.style.boxShadow = '0 0 5px #FF0000';
    } else {
        healthFillEl.style.backgroundColor = 'var(--pixel-green)';
        healthFillEl.style.boxShadow = '0 0 5px var(--pixel-green)';
    }

    // 4. Fuel Bar
    fuelFillEl.style.width = `${currentFuel}%`;
    
    // 5. Lampu
    if (lightIndicatorEl.classList.contains('active')) {
        lightIndicatorEl.style.color = '#000';
    } else {
        lightIndicatorEl.style.color = '#000'; // Tetap hitam
    }
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
    // Health (H) - Mengurangi Health
    else if (event.key === 'h' || event.key === 'H') {
        currentHealth = Math.max(0, currentHealth - 10);
        if (currentHealth === 0) currentHealth = 100; // Reset
    }
    // Lampu (L) - Toggle Lampu
    else if (event.key === 'l' || event.key === 'L') {
        lightIndicatorEl.classList.toggle('active');
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
