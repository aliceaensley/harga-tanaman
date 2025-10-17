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

// Contoh elemen HUD spedometer
const container = document.getElementById('hud-speedometer');
container.innerHTML = `
<div id="speedometer">
    <div id="speed-needle"></div>
    <div id="speed-text">0 km/h</div>
</div>
`;
