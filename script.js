// Pastikan Speedometer.js sudah ter-include
// Inisialisasi speedometer di container
document.addEventListener("DOMContentLoaded", () => {
    Speedometer.init('hud-speedometer'); // fungsi bawaan template
    Speedometer.setSpeed(0); // kecepatan awal
});

// Update spedometer tiap frame RageMP
mp.events.add("render", () => {
    let veh = mp.players.local.vehicle;
    if (veh) {
        let speed = veh.getSpeed() * 3.6; // konversi m/s -> km/h
        Speedometer.setSpeed(speed);     // fungsi template asli
    } else {
        Speedometer.setSpeed(0);
    }
});
