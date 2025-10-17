// RageMP client-side
mp.events.add("render", () => {
    let playerVeh = mp.players.local.vehicle;
    let speed = 0;

    if (playerVeh) {
        // Kecepatan kendaraan dalam km/h
        speed = playerVeh.getSpeed() * 3.6;
    }

    // Update teks
    document.getElementById("speedText").innerText = Math.round(speed) + " km/h";

    // Update jarum (0-200 km/h => 0-180 derajat)
    let needleDeg = Math.min(speed, 200) / 200 * 180; 
    document.getElementById("needle").style.transform = `rotate(${needleDeg}deg)`;
});
