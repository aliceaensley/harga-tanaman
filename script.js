const canvas = document.getElementById("gauge");
const ctx = canvas.getContext("2d");
const speedEl = document.getElementById("speed");

let speed = 0;

function drawGauge(speed) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 110;

    // Sudut 0.75π (135 derajat) hingga 0.25π (45 derajat)
    const startAngle = 0.75 * Math.PI;
    const endAngle = 0.25 * Math.PI;

    // Background arc (busur abu-abu gelap)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 12;
    ctx.stroke();

    // Speed arc (busur hijau yang mengisi)
    const percent = speed / 200; // Asumsi kecepatan max = 200
    // Menghitung sudut akhir berdasarkan persentase
    const angle = startAngle + percent * (2 * Math.PI - (startAngle - endAngle));

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, angle, false);
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 12;
    ctx.stroke();
}

function updateSpeedometer() {
    // Simulasi perubahan kecepatan: bertambah 1 dan berputar kembali setelah mencapai 200
    speed = (speed + 1) % 200; 
    
    speedEl.textContent = speed;
    drawGauge(speed);
    
    // Menggunakan requestAnimationFrame untuk animasi yang lebih halus
    requestAnimationFrame(updateSpeedometer);
}

// Memulai loop animasi
updateSpeedometer();
