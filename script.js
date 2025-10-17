mp.events.add("render", () => {
    let veh = mp.players.local.vehicle;
    if (veh) {
        let speed = veh.getSpeed() * 3.6; // konversi m/s ke km/h
        let gear = veh.getGear();
        let fuel = veh.getFuelLevel();
        let health = veh.getHealth();

        updateElement('speedValue', speed.toFixed(0).padStart(3, '0'));
        updateElement('gearValue', gear);
        updateElement('fuelValue', fuel.toFixed(0));
        updateElement('healthValue', health.toFixed(0));
    } else {
        updateElement('speedValue', '000');
        updateElement('gearValue', 'N');
        updateElement('fuelValue', '100');
        updateElement('healthValue', '100');
    }
});
