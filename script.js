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

    // Fungsi draw HUD
    function drawSpeedometer() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dial semi-circle
        ctx.beginPath();
        ctx.arc(cx, cy, radius, Math.PI, 0);
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

        // Jarum smooth
        speed += (targetSpeed - speed) * 0.05;
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
        ctx.arc(cx, cy, 5, 0, Math.PI*2);
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

    // Fungsi update dari RageMP
    mp.events.add("render", () => {
        const veh = mp.players.local.vehicle;
        if(veh){
            targetSpeed = veh.getSpeed() * 3.6; // m/s -> km/h
            gear = veh.getCurrentGear ? veh.getCurrentGear().toString() : 'N';
            fuel = veh.getFuelLevel ? veh.getFuelLevel() : 100;
            health = veh.getHealth ? veh.getHealth() : 100;
        } else {
            targetSpeed = 0;
            gear = 'N';
            fuel = 100;
            health = 100;
        }
        drawSpeedometer();
    });
});
