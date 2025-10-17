// RageMP client-side code
mp.events.add("render", () => {
    let playerVeh = mp.players.local.vehicle;
    if (playerVeh) {
        // Mendapatkan kecepatan kendaraan dalam m/s dan konversi ke km/h
        let speed = playerVeh.getSpeed() * 3.6;
        document.getElementById("speedMain").innerText = Math.round(speed) + " km/h";
        document.getElementById("speedSmall").innerText = Math.round(speed) + " km/h";
    } else {
        document.getElementById("speedMain").innerText = "0 km/h";
        document.getElementById("speedSmall").innerText = "0 km/h";
    }
});
