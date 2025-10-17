const speedValueEl = document.getElementById('speed-value');
const gearValueEl = document.getElementById('gear-value');
const outerRingFillEl = document.getElementById('outer-ring-fill');
const fuelBarFillEl = document.getElementById('fuel-bar-fill');
const healthBarFillEl = document.getElementById('health-bar-fill');

// --- Konstan ---
const MAX_SPEED = 240; // KM/H
const MAX_RPM_ANGLE = 270; // Derajat putaran maksimum untuk ring luar (3/4 lingkaran)

let currentSpeed = 0;
let currentRPM = 0; 
let currentGear = 0; 
let currentFuel = 100; 
let currentHealth = 100; 

// --- Logika Perhitungan ---

function calculateRPM(speed, gear) {
    if (speed === 0 || gear === 0) return 0;
    const RPM_BASE = 1000;
    const RPM_FACTOR = 30; 
    const GEAR_MULTIPLIER = [0, 1.8, 1.2, 0.9, 0.7, 0.6, 0.5]; 

    let calculatedRpm = RPM_BASE + (speed * RPM_FACTOR * GEAR_MULTIPLIER[gear]);
    return Math.min(8000, Math.max(0, calculatedRpm)); 
}

function updateHUD() {
    // 1. Kecepatan Digital
    const formattedSpeed = String(Math.floor(currentSpeed)).padStart(3, '0');
    speedValueEl.textContent = formattedSpeed;

    // 2. Outer Ring (RPM Indicator)
    const rpmPercentage = currentRPM / 8000; 
    // Putaran dimulai dari 45 derajat (posisi kanan atas), total 270 derajat
    const rotationDegrees = 45 + (rpmPercentage * MAX_RPM_ANGLE);
    outerRingFillEl.style.transform = `rotate(${rotationDegrees}deg)`;
    
    // Warna ring saat RPM tinggi
    if (currentRPM > 7000) {
        outerRingFillEl.style.borderColor = 'var(--danger-red)';
        outerRingFillEl.style.filter = 'drop-shadow(0 0 8px var(--danger-red))';
    } else if (currentRPM > 5000) {
        outerRingFillEl.style.borderColor = 'var(--warning-yellow)';
        outerRingFillEl.style.filter = 'drop-shadow(0 0 6px var(--warning-yellow))';
    }
    else {
        outerRingFillEl.style.borderColor = 'var(--accent-blue)';
        outerRingFillEl.style.filter = 'drop-shadow(0 0 7px var(--accent-blue))';
    }

    // 3. Gear Display
    gearValueEl.textContent = currentGear === 0 ? 'N' : currentGear;

    // 4. Fuel Bar
    fuelBarFillEl.style.width = `${currentFuel}%`;
    if (currentFuel < 20) {
        fuelBarFillEl.style.backgroundColor = 'var(--danger-red)';
    } else if (currentFuel < 50) {
        fuelBarFillEl.style.backgroundColor = 'var(--warning-yellow)';
    } else {
        fuelBarFillEl.style.backgroundColor = 'var(--success-green)';
    }

    // 5. Health Bar
    healthBarFillEl.style.width = `${currentHealth}%`;
    if (currentHealth < 20) {
        healthBarFillEl.style.backgroundColor = 'var(--danger-red)';
    } else if (currentHealth < 50) {
        healthBarFillEl.style.backgroundColor = 'var(--warning-yellow)';
    } else {
        healthBarFillEl.style.backgroundColor = 'var(--success-green)';
    }
}

// --- Logika Simulasi Interaktif ---

const ACCEL_RATE = 3; 
const DECEL_RATE = 2; 

document.addEventListener('keydown', (event) => {
    // Akselerasi (A)
    if (event.key === 'a' || event.key === 'A') {
        currentSpeed = Math.min(MAX_SPEED, currentSpeed + ACCEL_RATE);
        if (currentSpeed > 0 && currentGear === 0) currentGear = 1;

        if (currentRPM > 6500 && currentGear < 6) { 
            currentGear++;
            currentRPM = 3000; 
        }
    } 
    // Deselerasi (D)
    else if (event.key === 'd' || event.key === 'D') {
        currentSpeed = Math.max(0, currentSpeed - DECEL_RATE);
        if (currentSpeed <= 0) currentGear = 0;
        
        if (currentRPM < 2000 && currentGear > 1) {
            currentGear--;
        }
    }
    // Kurangi Health (H)
    else if (event.key === 'h' || event.key === 'H') {
        currentHealth = Math.max(0, currentHealth - 10);
        if (currentHealth === 0) currentHealth = 100; 
    }
    // Kurangi Fuel (F)
    else if (event.key === 'f' || event.key === 'F') {
        currentFuel = Math.max(0, currentFuel - 10);
        if (currentFuel === 0) currentFuel = 100; 
    }
    
    currentRPM = calculateRPM(currentSpeed, currentGear);
    
    // Simulasi Pengurangan Fuel yang lambat (opsional)
    if (currentSpeed > 0 && Math.random() < 0.005) { 
        currentFuel = Math.max(0, currentFuel - 0.1);
    }

    updateHUD(); 
});


// --- Start Simulasi ---
document.addEventListener('DOMContentLoaded', () => {
    setInterval(updateHUD, 50); 
    updateHUD(); 
});
