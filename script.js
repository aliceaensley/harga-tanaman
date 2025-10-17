window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('speedoCanvas');
    const ctx = canvas.getContext('2d');

    // Ukuran tetap canvas agar speedometer selalu terlihat
    canvas.width = 250;
    canvas.height = 250;

    let speed = 0;
    let targetSpeed = 0;

    function drawHUD() {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = canvas.width * 0.45;

        ctx.clearRect(0,0,canvas.width,canvas.height);

        // Dial
        ctx.beginPath();
        ctx.arc(cx, cy, radius, Math.PI, 0, false);
        ctx.lineWidth = 15;
        ctx.strokeStyle = 'rgba(0,255,255,0.4)';
        ctx.stroke();

        // Tick marks
        for(let i=0;i<=20;i++){
            const angle = Math.PI + i*(Math.PI/20);
            const x1 = cx + Math.cos(angle)*(radius-10);
            const y1 = cy + Math.sin(angle)*(radius-10);
            const x2 = cx + Math.cos(angle)*radius;
            const y2 = cy + Math.sin(angle)*radius;
            ctx.beginPath();
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.lineWidth=2;
            ctx.strokeStyle='#0ff';
            ctx.stroke();
        }

        // Jarum speed
        speed += (targetSpeed-speed)*0.05; // smooth
        const angle = Math.PI + (speed/200)*Math.PI;
        const sx = cx + Math.cos(angle)*radius*0.9;
        const sy = cy + Math.sin(angle)*radius*0.9;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(sx, sy);
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'red';
        ctx.stroke();

        // Speed text
        ctx.font = `${canvas.width*0.12}px Arial`;
        ctx.fillStyle = '#0ff';
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(speed)+' km/h', cx, cy + canvas.width*0.2);
    }

    // Dummy speed untuk demo
    function updateSpeed() {
        targetSpeed = (Math.sin(Date.now()/1000)*100 + 100); // 0-200 km/h
    }

    function loop() {
        updateSpeed();
        drawHUD();
        requestAnimationFrame(loop);
    }

    loop();
});
