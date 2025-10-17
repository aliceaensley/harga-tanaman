// Fungsi untuk mengupdate kecepatan dan posisi jarum
function updateSpeedometer(speed) {
    const needle = document.getElementById('needle');
    const speedElement = document.getElementById('speed');
    const maxSpeed = 200; // Kecepatan maksimum dalam km/h
    const rotation = (speed / maxSpeed) * 180; // Menghitung sudut rotasi jarum

    needle.style.transform = `rotate(${rotation}deg)`;
    speedElement.textContent = `${Math.round(speed)} km/h`;
}

// Misalnya, kita dapat memanggil fungsi ini dengan kecepatan tertentu
updateSpeedometer(120); // Contoh kecepatan 120 km/h
