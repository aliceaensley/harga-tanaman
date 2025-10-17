// Fungsi untuk memperbarui nilai pada elemen
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Fungsi untuk mensimulasikan data
function simulateData() {
    let speed = Math.floor(Math.random() * 201); // 0 - 200 km/h
    let gear = ['N', '1', '2', '3', '4', '5'][Math.floor(Math.random() * 6)];
    let fuel = Math.floor(Math.random() * 101); // 0 - 100%
    let health = Math.floor(Math.random() * 101); // 0 - 100%

    updateElement('speedValue', speed.toString().padStart(3, '0'));
    updateElement('gearValue', gear);
    updateElement('fuelValue', fuel);
    updateElement('healthValue', health);
}

// Update data setiap 1 detik
setInterval(simulateData, 1000);
