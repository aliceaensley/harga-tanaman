window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('speedoCanvas');
    const ctx = canvas.getContext('2d');

    // 1️⃣ Resize canvas dan pastikan ukurannya proporsional
    function resizeCanvas() {
        canvas.width = 200; // bisa diganti sesuai kebutuhan
        canvas.height = 200;
    }
    resizeCanvas(); // panggil sekali saat load
    window.addEventListener('resize', resizeCanvas); // panggil saat window resize

    // 2️⃣ Variabel speedometer
    let speed = 0;
    let targetSpeed = 0;

    // 3️⃣ Fungsi drawHUD
    function drawHUD() {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = canvas.width * 0.45;

        ctx.clearRect(0,0,canvas.width,canvas.height);

        // ... (sisa kode menggambar dial, jarum, text)
    }

    // 4️⃣ Dummy speed update
    function updateSpeed() {
        targetSpeed = (Math.sin(Date.now()/1000)*100 + 100);
    }

    // 5️⃣ Loop animasi
    function loop(){
        updateSpeed();
        drawHUD();
        requestAnimationFrame(loop);
    }

    loop();
});
