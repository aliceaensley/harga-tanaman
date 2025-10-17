// Script ini sekarang berjalan di browser biasa untuk simulasi

const needle = document.getElementById('speed-needle');
const speedValueDisplay = document.getElementById('speed-value');
const container = document.getElementById('speedometer-container');

// Batas kecepatan maksimal untuk skala speedometer
const MAX_SPEED = 200; 
const MIN_DEGREE = 135; 
const MAX_DEGREE = 405; 

// Fungsi untuk mengkonversi kecepatan (KM/H) menjadi sudut rotasi (derajat)
function getRotation(speed) {
    if (speed >= MAX_SPEED) return MAX_DEGREE;
    if (speed <= 0) return MIN_DEGREE;
    
    const percentage = speed / MAX_SPEED;
    const rotationDegrees = MIN_DEGREE + (percentage * 270);
    
    return rotationDegrees;
}

function updateSpeed(speed) {
    const rotation = getRotation(speed);
    
    // 1. Gerakkan Jarum
    needle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
    
    // 2. Perbarui Tampilan Digital
    const formattedSpeed = String(Math.floor(speed)).padStart(3, '0');
    speedValueDisplay.textContent = formattedSpeed;
    
    // Pastikan container terlihat (tidak perlu lagi fungsi setVisible)
    container.classList.remove('hidden');
}


// --- Simulasi Kecepatan (agar bisa dilihat di browser) ---

let currentSpeed = 0;
const ACCELERATION = 2; // Kecepatan bertambah per interval
const MAX_SIMULATION_SPEED = 180; // Batas simulasi
let isAccelerating = true;

function simulateDrive() {
    if (isAccelerating) {
        currentSpeed += ACCELERATION;
        if (currentSpeed >= MAX_SIMULATION_SPEED) {
            currentSpeed = MAX_SIMULATION_SPEED;
            isAccelerating = false; // Mulai mengerem atau melambat
        }
    } else {
        currentSpeed -= ACCELERATION * 0.5; // Melambat lebih pelan
        if (currentSpeed <= 0) {
            currentSpeed = 0;
            isAccelerating = true; // Mulai berakselerasi lagi
        }
    }
    
    updateSpeed(currentSpeed);
}

// Mulai simulasi setiap 100 milidetik
document.addEventListener('DOMContentLoaded', () => {
    // Sembunyikan container saat awal, lalu tampilkan saat simulasi mulai
    container.classList.add('hidden');
    
    // Kita panggil simulateDrive() secara berulang
    setInterval(simulateDrive, 100); 
});
