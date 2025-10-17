document.addEventListener("DOMContentLoaded", () => {
  const needle = document.getElementById("needle");
  const progress = document.querySelector(".progress");
  const speedText = document.getElementById("speed");
  const rpmText = document.getElementById("rpm");
  const fuelText = document.getElementById("fuel");
  const gearText = document.getElementById("gear");
  const unitText = document.getElementById("unit");

  let speedMode = 0; // 0 = KMH, 1 = MPH, 2 = Knots

  const setSpeed = (value) => {
    const maxSpeed = 240;
    const normalized = Math.min(value / maxSpeed, 1);
    const angle = normalized * 270 - 135;

    needle.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
    progress.style.strokeDashoffset = 283 - normalized * 283;
    speedText.textContent = Math.round(value);
  };

  const setRPM = (value) => {
    rpmText.textContent = value.toFixed(1);
  };

  const setFuel = (value) => {
    fuelText.textContent = `${Math.round(value * 100)}%`;
  };

  const setGear = (gear) => {
    gearText.textContent = gear;
  };

  const setSpeedMode = (mode) => {
    const units = ["KM/H", "MPH", "Knots"];
    speedMode = mode;
    unitText.textContent = units[mode] || "KM/H";
  };

  // === DEMO ANIMASI OTOMATIS ===
  let demoSpeed = 0;
  setInterval(() => {
    demoSpeed = (demoSpeed + 8) % 240;
    setSpeed(demoSpeed);
    setRPM(Math.random() * 8);
    setFuel(Math.random());
    setGear(["R", "N", "1", "2", "3", "4", "5"][Math.floor(Math.random() * 7)]);
  }, 500);
});
