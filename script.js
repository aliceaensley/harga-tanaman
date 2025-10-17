// Script ini mensimulasikan perubahan kecepatan agar speedometer berfungsi di browser

const needle = document.getElementById('speed-needle');
const speedValueDisplay = document.getElementById('speed-value');
const container = document.getElementById('speedometer-container');

// --- Konstan Speedometer ---
const MAX_SPEED = 200; // Batas kecepatan maksimal skala
const MIN_DEGREE = 135; // Sudut jarum pada 0 KM/H
const MAX_DEGREE = 405; // Sudut jarum pada 200 KM/H (135 + 270)

/**
 * Menghitung sudut rotasi jarum berdasarkan kecepatan.
 * @param {number} speed Kecepatan saat ini dalam KM/H.
 * @returns {number} Sudut rotasi dalam derajat.
 */
function getRotation(speed) {
    if (speed >= MAX_SPEED) return MAX_DEGREE;
    if (speed <= 0) return MIN_DEGREE;
    
    // Hitung persentase kecepatan dari MAX_SPEED
    const percentage = speed / MAX_SPEED;
    
    // Total pergerakan jarum adalah 270 derajat
    const rotationDegrees = MIN_DEGREE + (percentage * 270);
    
    return rotationDegrees;
}

/**
 * Memperbarui tampilan jarum dan nilai digital.
 * @param {number} speed Kecepatan saat ini.
 */
function updateSpeed(speed) {
    const rotation = getRotation(speed);
    
    // 1. Gerakkan Jarum
    // Catatan: transform: translateX(-50%) adalah untuk centering jarum
    needle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
    
    // 2. Perbarui Tampilan Digital
    const formattedSpeed = String(Math.floor(speed)).padStart(3, '0');
    speedValueDisplay.textContent = formattedSpeed;
}

// --- Logika Simulasi Berkendara ---

let currentSpeed = 0;
const ACCELERATION_RATE = 2; 
const DECELERATION_RATE = 1; 
const MAX_SIMULATION_SPEED = 180;
let isAccelerating = true;

function simulateDrive() {
    if (isAccelerating) {
        // Akselerasi
        currentSpeed += ACCELERATION_RATE;
        if (currentSpeed >= MAX_SIMULATION_SPEED) {
            currentSpeed = MAX_SIMULATION_SPEED;
            isAccelerating = false; 
        }
    } else {
        // Deselerasi/Mengerem
        currentSpeed -= DECELERATION_RATE;
        if (currentSpeed <= 0) {
            currentSpeed = 0;
            isAccelerating = true; 
        }
    }
    
    // Pastikan kecepatan tidak negatif
    currentSpeed = Math.max(0, currentSpeed);
    
    updateSpeed(currentSpeed);
}

// Setelah dokumen dimuat sepenuhnya, mulai simulasi.
document.addEventListener('DOMContentLoaded', () => {
    // Jalankan simulasi setiap 100 milidetik (10 kali per detik)
    setInterval(simulateDrive, 100); 
});
