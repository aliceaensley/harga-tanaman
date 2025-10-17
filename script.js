// Script ini mensimulasikan data HUD agar dapat dilihat di browser

const speedValueEl = document.getElementById('speed-value');
const rpmValueEl = document.getElementById('rpm-value');
const fuelValueEl = document.getElementById('fuel-value');
const healthValueEl = document.getElementById('health-value');
const gearValueEl = document.getElementById('gear-value');
const healthBarEl = document.getElementById('health-bar-fill');
const lightIndicatorEl = document.getElementById('light-indicator');

let currentSpeed = 50;
let currentRPM = 5821;
let currentFuel = 49;
let currentHealth = 100;
let currentGear = 2;

// --- Fungsi Update Tampilan ---

function updateHUD() {
    // Speed
    const formattedSpeed = String(Math.floor(currentSpeed)).padStart(3, '0');
    speedValueEl.textContent = formattedSpeed;

    // RPM (simulasi pergerakan acak kecil)
    const rpmChange = Math.floor(Math.random() * 50) - 25; // -25 hingga +25
    currentRPM = Math.min(8000, Math.max(1000, currentRPM + rpmChange)); 
    rpmValueEl.textContent = currentRPM;

    // Fuel (simulasi penurunan lambat)
    if (Math.random() < 0.05) { // 5% kemungkinan turun setiap detik
        currentFuel = Math.max(0, currentFuel - 1);
    }
    fuelValueEl.textContent = currentFuel;

    // Health
    healthValueEl.textContent = `${currentHealth}%`;
    healthBarEl.style.width = `${currentHealth}%`;
    if (currentHealth < 30) {
        healthBarEl.style.backgroundColor = 'red';
    } else if (currentHealth < 60) {
        healthBarEl.style.backgroundColor = 'yellow';
    } else {
        healthBarEl.style.backgroundColor = ''; // Reset ke gradient hijau
    }

    // Gear (simulasi pergantian gigi acak)
    gearValueEl.textContent = currentGear;
}

// --- Logika Simulasi Interaktif ---

// Mengatur kecepatan, RPM, dan Gear saat tombol ditekan
document.addEventListener('keydown', (event) => {
    // Accelerate (A)
    if (event.key === 'a' || event.key === 'A') {
        currentSpeed = Math.min(180, currentSpeed + 5);
        currentRPM = Math.min(8000, currentRPM + 500);
        if (currentRPM > 6500 && currentGear < 5) {
            currentGear++;
            currentRPM = 3000; // Drop RPM saat pindah gigi
        }
    } 
    // Decelerate (D)
    else if (event.key === 'd' || event.key === 'D') {
        currentSpeed = Math.max(0, currentSpeed - 5);
        currentRPM = Math.max(1000, currentRPM - 300);
        if (currentRPM < 2500 && currentGear > 1) {
            currentGear--;
            currentRPM = 4000; // Rise RPM saat turun gigi
        }
    }
    // Toggle Health (H)
    else if (event.key === 'h' || event.key === 'H') {
        currentHealth = Math.max(1, currentHealth - 10);
        if (currentHealth <= 1) currentHealth = 100; // Reset
    }
    // Toggle Lights (L)
    else if (event.key === 'l' || event.key === 'L') {
        lightIndicatorEl.classList.toggle('active');
    }
    
    // Pastikan Gear tidak nol saat bergerak
    if (currentSpeed > 0 && currentGear < 1) currentGear = 1;
    if (currentSpeed === 0) currentGear = 0;

    updateHUD(); // Perbarui tampilan segera setelah interaksi
});


// --- Start Simulasi ---
document.addEventListener('DOMContentLoaded', () => {
    // Panggil updateHUD setiap 1 detik untuk RPM, Fuel, Health
    setInterval(updateHUD, 1000); 
    
    // Inisialisasi tampilan awal
    updateHUD(); 
});
