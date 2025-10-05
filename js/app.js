// ===============================================
// MMS - METEOR MADNESS SIMULATOR
// Complete JavaScript Application
// ===============================================

// Global Variables
let impactMap;
let impactMarker;
let destructionCircles = [];
let impactLocation = { lat: 40.4168, lng: -3.7038 };
let comparisonChart;
let earth;
let impactMarker3D = null;
let blastRadiusCircle = null;
let selectedMeteorId = null;

// ===============================================
// INITIALIZATION
// ===============================================

function initializeApp() {
  console.log("Initializing MMS Application...");

  // Initialize background stars
  initializeStars();

  // Initialize hero section interactions
  initializeHeroSection();

  // Wait for libraries to load, then initialize features
  setTimeout(() => {
    initializeSimulatorControls();
    initializeEarthGlobe();
    initializeLeafletMap();
    initializeStatisticsChart();
    initializeModalEvents();
    loadRealMeteorsFromAPI();
  }, 1000);
}

// ===============================================
// BACKGROUND STARS
// ===============================================

function initializeStars() {
  const starsCanvas = document.getElementById("stars_canvas");
  const ctx = starsCanvas.getContext("2d");

  starsCanvas.width = window.innerWidth;
  starsCanvas.height = window.innerHeight;

  const stars = [];
  const numStars = 50;
  const starColors = [
    "rgb(255, 255, 255)",
    "rgb(255, 255, 255)",
    "rgb(255, 255, 255)",
    "rgb(255, 255, 255)",
    "rgb(135, 206, 250)",
    "rgb(255, 200, 150)",
    "rgb(255, 100, 100)",
  ];

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * starsCanvas.width,
      y: Math.random() * starsCanvas.height,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random(),
      fadeSpeed: Math.random() * 0.002 + 0.001,
      color: starColors[Math.floor(Math.random() * starColors.length)],
    });
  }

  function animateStars() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, starsCanvas.width, starsCanvas.height);

    stars.forEach((star) => {
      star.opacity += star.fadeSpeed;
      if (star.opacity >= 1 || star.opacity <= 0) {
        star.fadeSpeed = -star.fadeSpeed;
      }

      const rgb = star.color.match(/\d+/g);
      ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${star.opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animateStars);
  }

  animateStars();

  window.addEventListener("resize", () => {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
  });
}

// ===============================================
// HERO SECTION
// ===============================================

function initializeHeroSection() {
  // Mode selector
  const modeButtons = document.querySelectorAll(".mode-btn");
  const modeContents = document.querySelectorAll(".mode-content");

  modeButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const mode = this.getAttribute("data-mode");

      modeButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      modeContents.forEach((content) => content.classList.remove("active"));
      if (mode === "simulate") {
        document.getElementById("simulation-mode").classList.add("active");
      } else {
        document.getElementById("real-mode").classList.add("active");
      }
    });
  });

  // Simulation meteor selector
  const simulationOptions = document.querySelectorAll(
    "#simulation-mode .meteor-option"
  );
  simulationOptions.forEach((option) => {
    option.addEventListener("click", function () {
      simulationOptions.forEach((opt) => opt.classList.remove("active"));
      this.classList.add("active");
      const meteorType = this.getAttribute("data-meteor");
      updateMeteorSize(meteorType);
      scrollToMainContent();
    });
  });
}

function updateMeteorSize(sizeCategory) {
  const meteorImg = document.getElementById("meteor_img");
  meteorImg.classList.remove(
    "size-small",
    "size-medium",
    "size-large",
    "size-catastrophic"
  );
  if (sizeCategory) {
    meteorImg.classList.add(`size-${sizeCategory}`);
  }
}

function getSizeCategoryFromDiameter(avgDiameter) {
  if (avgDiameter > 500) return "catastrophic";
  if (avgDiameter > 200) return "large";
  if (avgDiameter > 50) return "medium";
  return "small";
}

function scrollToMainContent() {
  const section = document.getElementById("simulator-section");
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ===============================================
// SIMULATOR CONTROLS
// ===============================================

function initializeSimulatorControls() {
  const diameter = document.getElementById("diameter");
  const velocity = document.getElementById("velocity");
  const angle = document.getElementById("angle");

  if (diameter) {
    diameter.addEventListener("input", (e) => {
      document.getElementById("diameter-value").textContent = e.target.value;
    });
  }

  if (velocity) {
    velocity.addEventListener("input", (e) => {
      document.getElementById("velocity-value").textContent = e.target.value;
    });
  }

  if (angle) {
    angle.addEventListener("input", (e) => {
      document.getElementById("angle-value").textContent = e.target.value;
    });
  }
}

// ===============================================
// 3D GLOBE INITIALIZATION
// ===============================================

function initializeEarthGlobe() {
  if (typeof WE === "undefined") {
    console.warn("WebGL Earth not loaded");
    return;
  }

  try {
    earth = new WE.map("earth_div", {
      zoom: 3,
      center: [impactLocation.lat, impactLocation.lng],
      zooming: true,
      scrollWheelZoom: true,
    });

    WE.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "",
      }
    ).addTo(earth);

    earth.on("click", function (e) {
      if (e.latlng) {
        handleGlobeClick(e.latlng.lat, e.latlng.lng);
      }
    });

    addGlobeControls();

    console.log("WebGL Earth initialized");
  } catch (e) {
    console.error("Error initializing WebGL Earth:", e);
  }
}

function handleGlobeClick(lat, lng) {
  impactLocation = { lat, lng };

  if (impactMarker3D) {
    earth.removeMarker(impactMarker3D);
  }

  impactMarker3D = WE.marker([lat, lng], {
    icon: createImpactIcon(),
    draggable: false,
  }).addTo(earth);

  impactMarker3D.bindPopup(`
    <div style="text-align: center; padding: 5px;">
      <strong style="color: #ff6b6b;">Impact Location</strong><br>
      <span style="font-size: 0.9rem;">${lat.toFixed(2)}°, ${lng.toFixed(
    2
  )}°</span>
    </div>
  `);

  document.getElementById("location-display").textContent = `${lat.toFixed(
    2
  )}°, ${lng.toFixed(2)}°`;

  const terrain = detectTerrain(lat, lng);
  document.getElementById("terrain").value = terrain;

  earth.panTo([lat, lng], { animate: true, duration: 1 });

  const resultsPanel = document.getElementById("results-panel");
  if (resultsPanel.style.display !== "none") {
    setTimeout(() => calculateImpact(), 500);
  }
}

function createImpactIcon() {
  const iconHtml = `
    <div style="
      width: 30px;
      height: 30px;
      background: radial-gradient(circle, rgba(255, 107, 107, 0.8), rgba(255, 50, 50, 0.3));
      border: 2px solid #ff6b6b;
      border-radius: 50%;
      box-shadow: 0 0 20px rgba(255, 107, 107, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <span style="font-size: 1.2rem;">💥</span>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: "impact-marker-3d",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function detectTerrain(lat, lng) {
  const isOcean =
    Math.abs(lat) < 60 &&
    ((lng < -30 && lng > -180) || (lng > 30 && lng < 180));
  if (isOcean) return "ocean";

  const megacities = [
    { lat: 40.7, lng: -74 },
    { lat: 51.5, lng: -0.1 },
    { lat: 35.7, lng: 139.7 },
    { lat: 34.0, lng: -118.2 },
    { lat: 19.4, lng: -99.1 },
  ];

  for (let city of megacities) {
    const distance = Math.sqrt(
      Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2)
    );
    if (distance < 1) return "megacity";
  }

  if (Math.abs(lat) < 50 && Math.abs(lng) < 100) return "urban";
  return "rural";
}

function addGlobeControls() {
  const controlPanel = document.createElement("div");
  controlPanel.className = "globe-navigation-controls";
  controlPanel.style.cssText = `
    position: absolute;
    bottom: 20px;
    left: 20px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
  `;

  const controls = [
    { icon: "🌍", action: () => earth.setZoom(3), tooltip: "Reset View" },
    {
      icon: "+",
      action: () => earth.setZoom(earth.getZoom() + 1),
      tooltip: "Zoom In",
    },
    {
      icon: "-",
      action: () => earth.setZoom(earth.getZoom() - 1),
      tooltip: "Zoom Out",
    },
  ];

  controls.forEach((control) => {
    const btn = document.createElement("button");
    btn.textContent = control.icon;
    btn.title = control.tooltip;
    btn.style.cssText = `
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      width: 40px;
      height: 40px;
      cursor: pointer;
      backdrop-filter: blur(10px);
      font-size: 1.2rem;
      color: #fff;
      transition: all 0.3s;
    `;

    btn.addEventListener("click", control.action);
    btn.addEventListener("mouseenter", function () {
      this.style.background = "rgba(255, 107, 107, 0.3)";
    });
    btn.addEventListener("mouseleave", function () {
      this.style.background = "rgba(255, 255, 255, 0.2)";
    });

    controlPanel.appendChild(btn);
  });

  document.getElementById("earth-side").appendChild(controlPanel);
}

// ===============================================
// 2D MAP INITIALIZATION
// ===============================================

function initializeLeafletMap() {
  if (typeof L === "undefined") {
    console.warn("Leaflet not loaded");
    return;
  }

  try {
    impactMap = L.map("impact-map").setView(
      [impactLocation.lat, impactLocation.lng],
      4
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 18,
    }).addTo(impactMap);

    impactMap.on("click", function (e) {
      impactLocation = { lat: e.latlng.lat, lng: e.latlng.lng };

      if (impactMarker) {
        impactMap.removeLayer(impactMarker);
      }

      impactMarker = L.marker([e.latlng.lat, e.latlng.lng], {
        icon: L.divIcon({
          className: "impact-marker",
          html: "💥",
          iconSize: [30, 30],
        }),
      }).addTo(impactMap);

      document.getElementById(
        "location-display"
      ).textContent = `${e.latlng.lat.toFixed(2)}°, ${e.latlng.lng.toFixed(
        2
      )}°`;
    });

    console.log("Leaflet initialized");
  } catch (e) {
    console.error("Error initializing Leaflet:", e);
  }
}

function drawDestructionCircles(radiusKm) {
  if (!impactMap) return;

  destructionCircles.forEach((circle) => impactMap.removeLayer(circle));
  destructionCircles = [];

  const zones = [
    { radius: radiusKm, color: "#ff0000", label: "Total Destruction" },
    { radius: radiusKm * 2, color: "#ff6b00", label: "Severe Damage" },
    { radius: radiusKm * 3, color: "#ffd700", label: "Moderate Damage" },
    { radius: radiusKm * 5, color: "#4169e1", label: "Shockwave" },
  ];

  zones.forEach((zone) => {
    const circle = L.circle([impactLocation.lat, impactLocation.lng], {
      radius: zone.radius * 1000,
      color: zone.color,
      fillColor: zone.color,
      fillOpacity: 0.2,
      weight: 2,
    }).addTo(impactMap);

    circle.bindPopup(
      `<b>${zone.label}</b><br>Radius: ${zone.radius.toFixed(2)} km`
    );
    destructionCircles.push(circle);
  });

  const bounds = L.latLngBounds(destructionCircles.map((c) => c.getBounds()));
  impactMap.fitBounds(bounds);
}

// ===============================================
// STATISTICS CHART
// ===============================================

function initializeStatisticsChart() {
  if (typeof Chart === "undefined") {
    console.warn("Chart.js not loaded");
    return;
  }

  const ctx = document.getElementById("comparison-chart");
  if (!ctx) return;

  try {
    comparisonChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Your Impact",
          "Chelyabinsk",
          "Tunguska",
          "Barringer",
          "Chicxulub",
        ],
        datasets: [
          {
            label: "Energy (Megatons)",
            data: [0, 0.5, 15, 10000, 100000000],
            backgroundColor: [
              "rgba(255, 107, 107, 0.8)",
              "rgba(52, 152, 219, 0.8)",
              "rgba(46, 204, 113, 0.8)",
              "rgba(155, 89, 182, 0.8)",
              "rgba(241, 196, 15, 0.8)",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            type: "logarithmic",
            title: { display: true, text: "Energy (MT)", color: "#fff" },
            ticks: { color: "#aaa" },
            grid: { color: "rgba(255, 255, 255, 0.1)" },
          },
          x: {
            ticks: { color: "#aaa" },
            grid: { color: "rgba(255, 255, 255, 0.1)" },
          },
        },
        plugins: {
          legend: { labels: { color: "#fff" } },
        },
      },
    });

    console.log("Chart initialized");
  } catch (e) {
    console.error("Error initializing chart:", e);
  }
}

// ===============================================
// IMPACT CALCULATION
// ===============================================

function calculateImpact() {
  const diameter = parseFloat(document.getElementById("diameter").value);
  const velocity = parseFloat(document.getElementById("velocity").value);
  const angle = parseFloat(document.getElementById("angle").value);
  const density = parseFloat(document.getElementById("density").value);
  const terrain = document.getElementById("terrain").value;
  const timeOfDay = document.getElementById("time-of-day").value;

  const atmospheric = calculateAtmosphericEntry(
    diameter,
    velocity,
    angle,
    density
  );

  const velocityMs = velocity * 1000;
  const initialEnergyJ =
    0.5 * atmospheric.initialMass * Math.pow(velocityMs, 2);
  const effectiveEnergyJ = initialEnergyJ * (1 - atmospheric.energyLossRatio);
  const energyMT = effectiveEnergyJ / 4.184e15;

  let destructionRadius;
  if (atmospheric.impactType === "airburst") {
    destructionRadius = 2.5 * Math.pow(energyMT, 0.33);
  } else {
    destructionRadius = 2.2 * Math.pow(energyMT, 0.33);
  }

  let craterDiameter = 0;
  if (atmospheric.impactType !== "airburst") {
    const angleRad = (angle * Math.PI) / 180;
    craterDiameter =
      1.8 *
      Math.pow(atmospheric.finalDiameter, 0.78) *
      Math.pow(Math.sin(angleRad), 0.33);
  }

  const casualties = calculateCasualties(
    destructionRadius,
    terrain,
    timeOfDay,
    impactLocation,
    atmospheric.impactType
  );
  const economicDamage = calculateEconomicDamage(
    destructionRadius,
    terrain,
    energyMT,
    casualties.total
  );

  let tsunami = null;
  if (terrain === "ocean") {
    tsunami = calculateTsunami(
      energyMT,
      atmospheric.finalDiameter,
      impactLocation
    );
  }

  const earthquakeMagnitude = 4 + 0.67 * Math.log10(energyMT);
  const hiroshimaEquivalent = energyMT / 0.015;

  // Update UI
  document.getElementById("results-panel").style.display = "block";
  document.getElementById("result-energy").textContent = `${energyMT.toFixed(
    2
  )} MT (${(atmospheric.energyLossRatio * 100).toFixed(
    1
  )}% lost in atmosphere)`;
  document.getElementById(
    "result-radius"
  ).textContent = `${destructionRadius.toFixed(2)} km`;
  document.getElementById("result-crater").textContent =
    atmospheric.impactType === "airburst"
      ? "No crater (airburst)"
      : `${(craterDiameter / 1000).toFixed(2)} km`;
  document.getElementById(
    "result-equivalent"
  ).textContent = `${hiroshimaEquivalent.toFixed(0)} Hiroshima bombs`;

  document.getElementById("stat-energy").textContent = energyMT.toFixed(2);
  document.getElementById("stat-radius").textContent =
    destructionRadius.toFixed(2);
  document.getElementById("stat-hiroshima").textContent =
    hiroshimaEquivalent.toFixed(0);
  document.getElementById("stat-earthquake").textContent =
    earthquakeMagnitude.toFixed(1);

  updateAdvancedStats({ casualties, economicDamage });

  if (comparisonChart) {
    comparisonChart.data.datasets[0].data[0] = energyMT;
    comparisonChart.update();
  }

  drawDestructionCircles(destructionRadius);

  if (tsunami) {
    showTsunamiAlert(tsunami);
  }
}

function calculateAtmosphericEntry(diameter, velocity, angle, density) {
  const SCALE_HEIGHT = 8500;
  const SEA_LEVEL_DENSITY = 1.225;

  const radius = diameter / 2;
  const area = Math.PI * Math.pow(radius, 2);
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
  const mass = volume * density;

  const dragCoeff = 0.5;
  const ballisticCoeff = mass / (dragCoeff * area);

  const fragmentationPressure = 1e7;
  const velocityMs = velocity * 1000;
  const fragmentationAltitude =
    -SCALE_HEIGHT *
    Math.log(
      (2 * fragmentationPressure) /
        (SEA_LEVEL_DENSITY * Math.pow(velocityMs, 2))
    );

  let energyLossRatio = 0;
  let finalDiameter = diameter;
  let finalMass = mass;
  let impactType = "surface";

  if (ballisticCoeff < 1e6) {
    energyLossRatio = 0.3 + 0.4 * Math.random();
    impactType = "airburst";
    const ablationFactor = Math.exp(
      -fragmentationAltitude / (2 * SCALE_HEIGHT)
    );
    finalDiameter = diameter * Math.pow(ablationFactor, 1 / 3);
    finalMass = mass * ablationFactor;
  } else if (ballisticCoeff < 1e7) {
    energyLossRatio = 0.1 + 0.2 * Math.random();
    impactType = "fragmented";
    const ablationFactor = 0.7 + 0.2 * Math.random();
    finalDiameter = diameter * Math.pow(ablationFactor, 1 / 3);
    finalMass = mass * ablationFactor;
  } else {
    energyLossRatio = 0.02 + 0.05 * Math.random();
    impactType = "surface";
    finalDiameter = diameter * 0.95;
    finalMass = mass * 0.9;
  }

  return {
    initialMass: mass,
    finalMass: finalMass,
    initialDiameter: diameter,
    finalDiameter: finalDiameter,
    energyLossRatio: energyLossRatio,
    fragmentationAltitude: Math.max(0, fragmentationAltitude / 1000),
    impactType: impactType,
    ballisticCoeff: ballisticCoeff,
  };
}

function calculateCasualties(
  radiusKm,
  terrain,
  timeOfDay,
  location,
  impactType
) {
  const populationDensity = {
    ocean: 0,
    rural: 50,
    urban: 2000,
    megacity: 10000,
  };

  const density = populationDensity[terrain];

  const zones = [
    { radius: radiusKm, mortality: 0.95, name: "Total Destruction" },
    { radius: radiusKm * 2, mortality: 0.7, name: "Severe Damage" },
    { radius: radiusKm * 3, mortality: 0.4, name: "Moderate Damage" },
    { radius: radiusKm * 5, mortality: 0.1, name: "Light Damage" },
  ];

  const timeFactor = timeOfDay === "night" ? 0.7 : 1.0;
  const impactFactor = impactType === "airburst" ? 0.6 : 1.0;

  let casualties = {
    total: 0,
    immediate: 0,
    injured: 0,
    byZone: [],
  };

  if (terrain !== "ocean") {
    let previousRadius = 0;
    zones.forEach((zone) => {
      const area =
        Math.PI * (Math.pow(zone.radius, 2) - Math.pow(previousRadius, 2));
      const population = area * density;
      const deaths = population * zone.mortality * timeFactor * impactFactor;
      const injured = population * (1 - zone.mortality) * 0.5;

      casualties.immediate += deaths;
      casualties.injured += injured;
      casualties.byZone.push({
        name: zone.name,
        deaths: Math.round(deaths),
        injured: Math.round(injured),
      });

      previousRadius = zone.radius;
    });

    casualties.total = casualties.immediate + casualties.injured;
  }

  return casualties;
}

function calculateEconomicDamage(radiusKm, terrain, energyMT, casualties) {
  const economicValue = {
    ocean: 0.1,
    rural: 5,
    urban: 500,
    megacity: 2000,
  };

  const valuePerKm2 = economicValue[terrain];
  const affectedArea = Math.PI * Math.pow(radiusKm * 3, 2);

  const infrastructureDamage = affectedArea * valuePerKm2;
  const casualtyDamage = (casualties / 1e6) * 10000;
  const indirectDamage = infrastructureDamage * 0.5;
  const environmentalDamage = energyMT * 10;

  const total =
    infrastructureDamage +
    casualtyDamage +
    indirectDamage +
    environmentalDamage;

  return {
    total: total,
    infrastructure: infrastructureDamage,
    casualties: casualtyDamage,
    indirect: indirectDamage,
    environmental: environmentalDamage,
  };
}

function calculateTsunami(energyMT, diameter, location) {
  const waterDepth = 4000;
  const waterEnergyMT = energyMT * 0.5;
  const waveHeightM =
    0.014 * Math.pow(diameter, 0.5) * Math.pow(waterEnergyMT, 0.33);
  const propagationRadiusKm = 100 * Math.pow(energyMT, 0.25);
  const coastalDamageKm = propagationRadiusKm * 2;

  return {
    initialHeight: waveHeightM,
    propagationRadius: propagationRadiusKm,
    coastalDamage: coastalDamageKm,
    severity:
      waveHeightM > 10
        ? "catastrophic"
        : waveHeightM > 5
        ? "severe"
        : "moderate",
  };
}

function updateAdvancedStats(results) {
  const statsGrid = document.querySelector(".stats-grid");

  const casualtyCard =
    document.getElementById("stat-casualties-card") ||
    createStatCard("stat-casualties-card");
  casualtyCard.querySelector("h4").textContent = "ESTIMATED CASUALTIES";
  casualtyCard.querySelector(".big-number").textContent =
    results.casualties.total > 1e6
      ? (results.casualties.total / 1e6).toFixed(1) + "M"
      : results.casualties.total.toLocaleString();
  casualtyCard.querySelector(".unit").textContent = "people affected";

  const economicCard =
    document.getElementById("stat-economic-card") ||
    createStatCard("stat-economic-card");
  economicCard.querySelector("h4").textContent = "ECONOMIC DAMAGE";
  economicCard.querySelector(".big-number").textContent =
    results.economicDamage.total > 1000
      ? "$" + (results.economicDamage.total / 1000).toFixed(1) + "B"
      : "$" + results.economicDamage.total.toFixed(0) + "M";
  economicCard.querySelector(".unit").textContent = "USD estimated";

  if (!document.getElementById("stat-casualties-card")) {
    statsGrid.appendChild(casualtyCard);
    statsGrid.appendChild(economicCard);
  }
}

function createStatCard(id) {
  const card = document.createElement("div");
  card.className = "stat-card";
  card.id = id;
  card.innerHTML = `
    <h4></h4>
    <div class="big-number"></div>
    <div class="unit"></div>
  `;
  return card;
}

function showTsunamiAlert(tsunami) {
  const alert = document.createElement("div");
  alert.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(255, 50, 50, 0.95);
    border: 2px solid #ff0000;
    padding: 20px;
    border-radius: 10px;
    z-index: 10000;
    max-width: 300px;
    animation: pulse 2s infinite;
  `;
  alert.innerHTML = `
    <h3 style="margin: 0 0 10px 0; color: #fff;">🌊 TSUNAMI WARNING</h3>
    <p style="margin: 5px 0; color: #fff;">Wave Height: ${tsunami.initialHeight.toFixed(
      1
    )}m</p>
    <p style="margin: 5px 0; color: #fff;">Affected Radius: ${tsunami.propagationRadius.toFixed(
      0
    )}km</p>
    <p style="margin: 5px 0; color: #fff;">Severity: ${tsunami.severity.toUpperCase()}</p>
    <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 15px; background: #fff; border: none; border-radius: 5px; cursor: pointer;">Close</button>
  `;
  document.body.appendChild(alert);
  setTimeout(() => alert.remove(), 10000);
}

// ===============================================
// TAB SWITCHING
// ===============================================

function switchTab(tabName) {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => tab.classList.remove("active"));
  event.target.classList.add("active");

  const panels = document.querySelectorAll(".content-panel");
  panels.forEach((panel) => panel.classList.remove("active"));

  switch (tabName) {
    case "globe":
      document.getElementById("globe-panel").classList.add("active");
      break;
    case "map":
      document.getElementById("map-panel").classList.add("active");
      setTimeout(() => impactMap && impactMap.invalidateSize(), 100);
      break;
    case "statistics":
      document.getElementById("statistics-panel").classList.add("active");
      break;
    case "analysis":
      document.getElementById("analysis-panel").classList.add("active");
      break;
    case "prevention":
      document.getElementById("prevention-panel").classList.add("active");
      break;
  }
}

// ===============================================
// CHATBOT
// ===============================================

function toggleChatbot() {
  const chatWindow = document.getElementById("chatbot-window");
  chatWindow.classList.toggle("open");
}

// ===============================================
// MODAL
// ===============================================

function initializeModalEvents() {
  const meteorImg = document.getElementById("meteor_img");
  const meteorModal = document.getElementById("meteor-modal");
  const modalClose = document.getElementById("modal-close");

  meteorImg.addEventListener("click", function () {
    if (window.selectedNeoData) {
      showNasaApiMeteorInfo(window.selectedNeoData);
    } else {
      alert("Please select a real meteor first from the top section.");
    }
  });

  modalClose.addEventListener("click", function () {
    meteorModal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === meteorModal) {
      meteorModal.style.display = "none";
    }
  });
}

function showNasaApiMeteorInfo(apiData) {
  const closeApproach = apiData.close_approach_data[0];
  const diameter = apiData.estimated_diameter.meters;
  const velocity = closeApproach.relative_velocity;
  const missDistance = closeApproach.miss_distance;

  const avgDiameter =
    (diameter.estimated_diameter_min + diameter.estimated_diameter_max) / 2;
  const sizeCategory = getSizeCategoryFromDiameter(avgDiameter);
  updateMeteorSize(sizeCategory);

  let emoji;
  if (avgDiameter > 500) emoji = "🔥";
  else if (avgDiameter > 200) emoji = "💥";
  else if (avgDiameter > 50) emoji = "☄️";
  else emoji = "🌍";

  const isPotentiallyHazardous = apiData.is_potentially_hazardous_asteroid;
  const hazardStatus = isPotentiallyHazardous
    ? "⚠️ YES - Potentially hazardous asteroid"
    : "✅ NO - Safe asteroid";

  const formattedDate = new Date(
    closeApproach.close_approach_date_full
  ).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isActualImpact = parseFloat(missDistance.kilometers) === 0;

  document.getElementById("modal-emoji").textContent = emoji;
  document.getElementById("modal-name").textContent = apiData.name;
  document.getElementById("modal-date").textContent = formattedDate;
  document.getElementById(
    "modal-location"
  ).textContent = `Close approach to ${closeApproach.orbiting_body}`;
  document.getElementById(
    "modal-size"
  ).textContent = `${diameter.estimated_diameter_min.toFixed(
    2
  )} - ${diameter.estimated_diameter_max.toFixed(2)} meters diameter`;
  document.getElementById("modal-mass").textContent =
    "Mass estimated based on size";
  document.getElementById("modal-speed").textContent = `${parseFloat(
    velocity.kilometers_per_second
  ).toFixed(2)} km/s (${parseFloat(velocity.kilometers_per_hour).toLocaleString(
    "en-US"
  )} km/h)`;
  document.getElementById(
    "modal-energy"
  ).textContent = `Absolute magnitude: ${apiData.absolute_magnitude_h}`;

  if (isActualImpact) {
    document.getElementById("modal-impact").textContent =
      "This asteroid directly impacted Earth.";
    document.getElementById("modal-crater").textContent =
      "Crater information not available";
  } else {
    document.getElementById(
      "modal-impact"
    ).textContent = `This asteroid will pass ${parseFloat(
      missDistance.kilometers
    ).toLocaleString("en-US")} km from Earth (${parseFloat(
      missDistance.lunar
    ).toFixed(2)} lunar distances).`;
    document.getElementById("modal-crater").textContent =
      "No impact - Close pass without collision";
  }

  let facts = `• Designation: ${apiData.designation || apiData.name}
• Hazard Status: ${hazardStatus}
• NASA ID: ${apiData.neo_reference_id}
• Absolute magnitude: ${apiData.absolute_magnitude_h}
• Relative velocity: ${parseFloat(velocity.kilometers_per_second).toFixed(
    2
  )} km/s
• Approach distance: ${parseFloat(missDistance.kilometers).toLocaleString(
    "en-US"
  )} km
• Lunar distances: ${parseFloat(missDistance.lunar).toFixed(2)} LD
• Is Sentry object: ${apiData.is_sentry_object ? "Yes" : "No"}`;

  document.getElementById("modal-facts").textContent = facts;
  document.getElementById("meteor-modal").style.display = "flex";
}

// ===============================================
// NASA API INTEGRATION
// ===============================================

async function loadRealMeteorsFromAPI() {
  const API_BASE_URL = "http://localhost:6789";

  try {
    console.log("Fetching NEO data from API...");
    const response = await fetch(`${API_BASE_URL}/recent_neos`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (Array.isArray(data) && data.length > 0) {
      console.log(`Loaded ${data.length} NEOs from API`);
      updateRealMeteorSelector(data);
    } else {
      console.warn("No NEO data received from API");
      showLoadingError("No meteor data found");
    }
  } catch (error) {
    console.error("Error connecting to API:", error);
    showLoadingError("Connection error: " + error.message);
  }
}

function showLoadingError(message) {
  const realMeteorSelector = document.getElementById("real-meteor-selector");
  realMeteorSelector.innerHTML = `
    <div class="meteor-option error">
      <h3>⚠️ Error</h3>
      <p>${message}</p>
    </div>
  `;
}

function updateRealMeteorSelector(neos) {
  const realMeteorSelector = document.getElementById("real-meteor-selector");
  realMeteorSelector.innerHTML = "";

  console.log("Updating selector with", neos.length, "NEOs");

  const categories = {
    small: { meteors: [], emoji: "🌍", label: "Small (< 50m)", limit: 3 },
    medium: { meteors: [], emoji: "☄️", label: "Medium (50-200m)", limit: 3 },
    large: { meteors: [], emoji: "💥", label: "Large (200-500m)", limit: 3 },
    massive: { meteors: [], emoji: "🔥", label: "Massive (> 500m)", limit: 3 },
  };

  neos.forEach((neo) => {
    const diameter = neo.estimated_diameter.meters;
    const avgDiameter =
      (diameter.estimated_diameter_min + diameter.estimated_diameter_max) / 2;

    if (
      avgDiameter > 500 &&
      categories.massive.meteors.length < categories.massive.limit
    ) {
      categories.massive.meteors.push(neo);
    } else if (
      avgDiameter > 200 &&
      categories.large.meteors.length < categories.large.limit
    ) {
      categories.large.meteors.push(neo);
    } else if (
      avgDiameter > 50 &&
      categories.medium.meteors.length < categories.medium.limit
    ) {
      categories.medium.meteors.push(neo);
    } else if (categories.small.meteors.length < categories.small.limit) {
      categories.small.meteors.push(neo);
    }
  });

  Object.keys(categories).forEach((categoryKey) => {
    const category = categories[categoryKey];
    if (category.meteors.length > 0) {
      const categoryHeader = document.createElement("div");
      categoryHeader.className = "meteor-category-header";
      categoryHeader.innerHTML = `<h3>${category.emoji} ${category.label}</h3>`;
      realMeteorSelector.appendChild(categoryHeader);

      const rowContainer = document.createElement("div");
      rowContainer.className = "meteor-row";

      category.meteors.forEach((neo) => {
        const closeApproach = neo.close_approach_data[0];
        const diameter = neo.estimated_diameter.meters;
        const avgDiameter =
          (diameter.estimated_diameter_min + diameter.estimated_diameter_max) /
          2;

        const date = new Date(closeApproach.close_approach_date);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        const meteorOption = document.createElement("div");
        meteorOption.className = "meteor-option";
        meteorOption.setAttribute("data-neo-id", neo.id);

        meteorOption.innerHTML = `
          <h3>${category.emoji} ${neo.name}</h3>
          <p>${formattedDate} - ${Math.round(avgDiameter)}m</p>
        `;

        meteorOption.addEventListener("click", function () {
          document
            .querySelectorAll("#real-meteor-selector .meteor-option")
            .forEach((opt) => {
              opt.classList.remove("active");
            });

          this.classList.add("active");
          window.selectedNeoData = neo;
          selectedMeteorId = neo.id;

          const sizeCategory = getSizeCategoryFromDiameter(avgDiameter);
          updateMeteorSize(sizeCategory);

          setTimeout(() => scrollToMainContent(), 300);
        });

        rowContainer.appendChild(meteorOption);
      });

      realMeteorSelector.appendChild(rowContainer);
    }
  });

  if (realMeteorSelector.children.length === 0) {
    realMeteorSelector.innerHTML = `
      <div class="meteor-option error">
        <h3>⚠️ No data</h3>
        <p>No meteors found in expected categories</p>
      </div>
    `;
  }

  console.log("Real meteor selector updated successfully");
}
