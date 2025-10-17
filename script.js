let speed = 0;

// Fungsi update jarum dan teks kecepatan
function updateSpeedometer(speed) {
    const needle = document.getElementById('needle');
    const speedText = document.getElementById('speedText');
    
    // Batasi kecepatan max 200 km/h untuk jarum
    const rotation = Math.min(speed, 200) / 200 * 180;
    
    needle.style.transform = `rotate(${rotation}deg)`;
    speedText.textContent = `${Math.round(speed)} km/h`;
}

// Simulasi kecepatan naik turun (untuk testing)
function simulateSpeed() {
    speed += Math.random() * 4 - 2; // naik/turun random
    if(speed < 0) speed = 0;
    if(speed > 200) speed = 200;
    
    updateSpeedometer(speed);
    requestAnimationFrame(simulateSpeed);
}

// Mulai simulasi
simulateSpeed();
