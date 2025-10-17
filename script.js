// Fungsi dari template jgvrp-speedometer-template
function setSpeed(speed) {
    // speed dalam m/s, dikonversi ke km/h
    const kmh = speed * 3.6;
    const speedText = document.getElementById('speed-text');
    if(speedText) speedText.innerText = Math.round(kmh) + " km/h";

    const needle = document.getElementById('speed-needle');
    if(needle) {
        const rotation = Math.min(kmh, 200) / 200 * 180;
        needle.style.transform = `rotate(${rotation}deg)`;
    }
}

// Ambil kecepatan kendaraan dari RageMP
mp.events.add("render", () => {
    let veh = mp.players.local.vehicle;
    if (veh) {
        let speed = veh.getSpeed() * 3.6; // km/h
        Speedometer.setSpeed(speed);     // gunakan fungsi template asli
    } else {
        Speedometer.setSpeed(0);
    }
});
