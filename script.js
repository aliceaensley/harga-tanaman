window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('speedoCanvas');
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = 120;

    let speed = 0;
    let targetSpeed = 0;
    let fuel = 100;
    let health = 100;
    let gear = 'N';

    // Fungsi draw dial
    function drawDial() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dial semi-circle
        ctx.beginPath();
        ctx.arc(cx, cy, radius, Math.PI, 0, false);
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'rgba(0,255,255,0.4)';
        ctx.shadowColor = 'rgba(0,255,255,0.5)';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Tick marks & numbers
        for (let i = 0; i <= 20; i++) {
            const angle = Math.PI + i * (Math.PI / 20);
            const x1 = cx + Math.cos(angle) * (radius - 10);
            const y1 = cy + Math.sin(angle) * (radius - 10);
            const x2 = cx + Math.cos(angle) * radius;
            const y2 = cy + Math.sin(angle) * radius;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#0ff';
            ctx.stroke();

            // Number every 20 km/h
            if (i % 2 === 0) {
                const numX = cx + Math.cos(angle) * (radius - 25);
                const numY = cy + Math.sin(angle) * (radius - 25);
                ctx.font = '14px Arial';
                ctx.fillStyle = '#0ff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(i * 10, numX, numY);
            }
        }

        // Jarum dengan easing
        speed += (targetSpeed - speed) * 0.05; // smooth easing
        const angle = Math.PI + (speed / 200) * Math.PI;
        const x = cx + Math.cos(angle) * radius * 0.9;
        const y = cy + Math.sin(angle) * radius * 0.9;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'red';
        ctx.shadowColor = 'red';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Titik pusat jarum
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();

        // Speed text
        ctx.font = '28px Arial';
        ctx.fillStyle = '#0ff';
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(speed) + ' km/h', cx, cy + 60);

        // Gear, fuel, health
        ctx.font = '20px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText('Gear: ' + gear, cx - 70, cy - 20);
        ctx.fillText('Fuel: ' + Math.round(fuel) + '%', cx + 70, cy - 20);
        ctx.fillText('HP: ' + Math.round(health) + '%', cx, cy - 80);
    }

    // Simulasi data (untuk testing)
    function simulateData() {
        targetSpeed += Math.random() * 4 - 2;
        if (targetSpeed < 0) targetSpeed = 0;
        if (targetSpeed > 200) targetSpeed = 200;

        fuel += Math.random() * 1.5 - 0.5;
        if (fuel < 0) fuel = 0;
        if (fuel > 100) fuel = 100;

        health += Math.random() * 1.5 - 0.5;
        if (health < 0) health = 0;
        if (health > 100) health = 100;

        const gears = ['N','1','2','3','4','5'];
        gear = gears[Math.floor(Math.random()*gears.length)];

        drawDial();
        requestAnimationFrame(simulateData);
    }

    simulateData();
});
