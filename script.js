// RageMP client-side
mp.events.add("render", () => {
    let playerVeh = mp.players.local.vehicle;
    let speed = 0;

    if (playerVeh) {
        speed = playerVeh.getSpeed() * 3.6; // km/h
    }

    // Update HUD utama
    document.getElementById("speedTextMain").innerText = Math.round(speed) + " km/h";
    let needleDegMain = Math.min(speed, 200) / 200 * 180;
    document.getElementById("needleMain").style.transform = `rotate(${needleDegMain}deg)`;

    // Update HUD mini
    document.getElementById("speedTextMini").innerText = Math.round(speed) + " km/h";
    let needleDegMini = Math.min(speed, 200) / 200 * 180;
    document.getElementById("needleMini").style.transform = `rotate(${needleDegMini}deg)`;
});
