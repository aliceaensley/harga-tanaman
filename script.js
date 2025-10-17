// Script ini berjalan di dalam lingkungan CEF (HTML)
const needle = document.getElementById('speed-needle');
const speedValueDisplay = document.getElementById('speed-value');
const container = document.getElementById('speedometer-container');

// Batas kecepatan maksimal untuk skala speedometer
const MAX_SPEED = 200; // Sesuai dengan skala CSS (200 KM/H)
const MIN_DEGREE = 135; // Sudut jarum pada 0 KM/H
const MAX_DEGREE = 405; // Sudut jarum pada 200 KM/H (135 + 270)

// Fungsi untuk mengkonversi kecepatan (KM/H) menjadi sudut rotasi (derajat)
function getRotation(speed) {
    if (speed >= MAX_SPEED) return MAX_DEGREE;
    if (speed <= 0) return MIN_DEGREE;
    
    // Hitung persentase kecepatan dari MAX_SPEED
    const percentage = speed / MAX_SPEED;
    
    // Total pergerakan jarum adalah 270 derajat (405 - 135)
    const rotationDegrees = MIN_DEGREE + (percentage * 270);
    
    return rotationDegrees;
}

// Objek global yang akan dipanggil dari RageMP (client_packages/index.js)
window.speedometer = {
    updateSpeed: function(speed) {
        const rotation = getRotation(speed);
        
        // 1. Gerakkan Jarum
        needle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
        
        // 2. Perbarui Tampilan Digital
        const formattedSpeed = String(Math.floor(speed)).padStart(3, '0');
        speedValueDisplay.textContent = formattedSpeed;
    },

    setVisible: function(isVisible) {
        if (isVisible) {
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
        }
    }
};
