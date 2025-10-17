const canvas = document.getElementById('speedoCanvas');
const ctx = canvas.getContext('2d');
const cx = canvas.width / 2;
const cy = canvas.height / 2;
const radius = 120;

let speed = 0;
let fuel = 100;
let health = 100;
let gear = 'N';

// Fungsi untuk menggambar dial
function drawDial() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Dial luar
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI, 0);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'rgba(0,255,255,0.4)';
    ctx.stroke();

    // Tick marks
    for(let i=0;i<=10;i++){
        const angle = Math.PI + i*(Math.PI/10);
        const x1 = cx + Math.cos(angle)*(radius-10);
        const y1 = cy + Math.sin(angle)*(radius-10);
        const x2 = cx + Math.cos(angle)*radius;
        const y2 = cy + Math.sin(angle)*radius;
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0ff';
        ctx.stroke();
    }

    // Text speed
    ctx.font = '32px Arial';
    ctx.fillStyle = '#0ff';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(speed) + ' km/h', cx, cy + 60);

    // Gear
    ctx.font = '24px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Gear: ' + gear, cx - 60, cy - 20);

    // Fuel
    ctx.fillText('Fuel: ' + fuel + '%', cx + 60, cy - 20);

    // Health
    ctx.fillText('HP: ' + health + '%', cx, cy - 80);

    // Jarum
    const angle = Math.PI + (speed/200)*Math.PI;
    const x = cx + Math.cos(angle)*radius*0.9;
    const y = cy + Math.sin(angle)*radius*0.9;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(x,y);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'red';
    ctx.stroke();

    // Titik pusat jarum
    ctx.beginPath();
    ctx.arc(cx,cy,5,0,Math.PI*2);
    ctx.fillStyle = 'red';
    ctx.fill();
}

// Simulasi data
function simulate() {
    speed += Math.random()*4 - 2;
    if(speed<0) speed=0;
    if(speed>200) speed=200;

    fuel += Math.random()*2 - 1;
    if(fuel<0) fuel=0;
    if(fuel>100) fuel=100;

    health += Math.random()*2 - 1;
    if(health<0) health=0;
    if(health>100) health=100;

    const gears = ['N','1','2','3','4','5'];
    gear = gears[Math.floor(Math.random()*gears.length)];

    drawDial();
    requestAnimationFrame(simulate);
}

// Mulai animasi
simulate();
