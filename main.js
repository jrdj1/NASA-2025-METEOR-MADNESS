// Datos de meteoritos reales con información de API simulada
const realMeteorsData = {
  chelyabinsk: {
    name: "Chelyabinsk",
    emoji: "🌠",
    date: "15 de febrero de 2013",
    location: "Chelyabinsk, Rusia",
    size: "~20 metros de diámetro",
    mass: "~12,000 toneladas",
    speed: "~19 km/s al entrar en la atmósfera",
    energy: "~500 kilotones de TNT",
    impact: "El meteorito explotó en el aire a unos 30 km de altura, generando una onda de choque que rompió ventanas y causó heridas a más de 1,500 personas.",
    crater: "No formó cráter, fragmentos encontrados en el lago Chebarkul",
    facts: "• Detectado solo horas antes del impacto\n• La explosión fue más brillante que el sol\n• Fue el mayor evento de este tipo desde Tunguska",
    apiData: {
      id: "2013034",
      neo_reference_id: "2013034",
      name: "(2013 Chelyabinsk)",
      designation: "2013 Chelyabinsk",
      nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2013034",
      absolute_magnitude_h: 26.5,
      estimated_diameter: {
        meters: { estimated_diameter_min: 17.0, estimated_diameter_max: 23.0 }
      },
      is_potentially_hazardous_asteroid: false,
      close_approach_data: [{
        close_approach_date: "2013-02-15",
        close_approach_date_full: "2013-Feb-15 03:20",
        epoch_date_close_approach: 1360901580000,
        relative_velocity: {
          kilometers_per_second: "19.0",
          kilometers_per_hour: "68400.0"
        },
        miss_distance: {
          astronomical: "0.0",
          lunar: "0.0",
          kilometers: "0"
        },
        orbiting_body: "Earth"
      }],
      orbital_data: {
        orbit_id: "1",
        first_observation_date: "2013-02-15",
        last_observation_date: "2013-02-15",
        data_arc_in_days: 0,
        observations_used: 150,
        orbit_uncertainty: "2",
        minimum_orbit_intersection: ".0000",
        jupiter_tisserand_invariant: "3.8",
        eccentricity: ".567",
        semi_major_axis: "1.87",
        inclination: "3.6",
        ascending_node_longitude: "326.4",
        orbital_period: "937",
        perihelion_distance: "0.81",
        perihelion_argument: "103.5",
        aphelion_distance: "2.93",
        orbit_class: {
          orbit_class_type: "APO",
          orbit_class_description: "Near-Earth asteroid orbits which cross the Earth's orbit similar to that of 1862 Apollo"
        }
      },
      is_sentry_object: false
    }
  },
  tunguska: {
    name: "Tunguska",
    emoji: "💫",
    date: "30 de junio de 1908",
    location: "Río Tunguska Pedregoso, Siberia",
    size: "~60-190 metros de diámetro",
    mass: "~1-10 millones de toneladas",
    speed: "~15 km/s (estimado)",
    energy: "~10-15 megatones de TNT",
    impact: "Explosión aérea que arrasó 2,150 km² de bosque, derribando unos 80 millones de árboles. Se cree que explotó entre 5-10 km de altura.",
    crater: "No dejó cráter visible",
    facts: "• El evento más destructivo registrado en la historia\n• Testigos reportaron un resplandor azul en el cielo\n• Se sintió a cientos de kilómetros de distancia",
    apiData: {
      id: "1908002",
      neo_reference_id: "1908002",
      name: "(1908 Tunguska)",
      designation: "1908 Tunguska Event",
      nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=1908002",
      absolute_magnitude_h: 23.2,
      estimated_diameter: {
        meters: { estimated_diameter_min: 60.0, estimated_diameter_max: 190.0 }
      },
      is_potentially_hazardous_asteroid: true,
      close_approach_data: [{
        close_approach_date: "1908-06-30",
        close_approach_date_full: "1908-Jun-30 07:17",
        epoch_date_close_approach: -1941968580000,
        relative_velocity: {
          kilometers_per_second: "15.0",
          kilometers_per_hour: "54000.0"
        },
        miss_distance: {
          astronomical: "0.0",
          lunar: "0.0",
          kilometers: "0"
        },
        orbiting_body: "Earth"
      }],
      orbital_data: {
        orbit_id: "1",
        first_observation_date: "1908-06-30",
        last_observation_date: "1908-06-30",
        data_arc_in_days: 0,
        observations_used: 50,
        orbit_uncertainty: "9",
        minimum_orbit_intersection: ".0000",
        jupiter_tisserand_invariant: "4.2",
        eccentricity: ".621",
        semi_major_axis: "2.14",
        inclination: "7.8",
        ascending_node_longitude: "98.5",
        orbital_period: "1144",
        perihelion_distance: "0.81",
        perihelion_argument: "287.3",
        aphelion_distance: "3.47",
        orbit_class: {
          orbit_class_type: "APO",
          orbit_class_description: "Near-Earth asteroid orbits which cross the Earth's orbit - Tunguska class impact event"
        }
      },
      is_sentry_object: false
    }
  },
  chicxulub: {
    name: "Chicxulub",
    emoji: "🦕",
    date: "Hace ~66 millones de años",
    location: "Península de Yucatán, México",
    size: "~10-15 kilómetros de diámetro",
    mass: "~1-4 billones de toneladas",
    speed: "~20 km/s (estimado)",
    energy: "~100,000,000 megatones de TNT",
    impact: "Causó la extinción masiva del Cretácico-Paleógeno, eliminando aproximadamente el 75% de todas las especies, incluyendo los dinosaurios no aviares.",
    crater: "Cráter de 180 km de diámetro, parcialmente bajo el agua",
    facts: "• Desencadenó tsunamis masivos y incendios globales\n• Levantó nubes de polvo que bloquearon el sol por años\n• Marcó el fin de la era de los dinosaurios",
    apiData: {
      id: "66000000",
      neo_reference_id: "66000000",
      name: "Chicxulub Impactor",
      designation: "K-Pg Extinction Event",
      nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=chicxulub",
      absolute_magnitude_h: 15.8,
      estimated_diameter: {
        meters: { estimated_diameter_min: 10000.0, estimated_diameter_max: 15000.0 }
      },
      is_potentially_hazardous_asteroid: true,
      close_approach_data: [{
        close_approach_date: "66 million years ago",
        close_approach_date_full: "-66000000-Jan-01 00:00",
        epoch_date_close_approach: -2082844800000000,
        relative_velocity: {
          kilometers_per_second: "20.0",
          kilometers_per_hour: "72000.0"
        },
        miss_distance: {
          astronomical: "0.0",
          lunar: "0.0",
          kilometers: "0"
        },
        orbiting_body: "Earth"
      }],
      orbital_data: {
        orbit_id: "1",
        first_observation_date: "1990-01-01",
        last_observation_date: "2010-12-31",
        data_arc_in_days: 7665,
        observations_used: 500,
        orbit_uncertainty: "0",
        minimum_orbit_intersection: ".0000",
        jupiter_tisserand_invariant: "3.2",
        eccentricity: ".892",
        semi_major_axis: "3.87",
        inclination: "23.4",
        ascending_node_longitude: "145.2",
        orbital_period: "2781",
        perihelion_distance: "0.42",
        perihelion_argument: "56.8",
        aphelion_distance: "7.32",
        orbit_class: {
          orbit_class_type: "APO",
          orbit_class_description: "Massive asteroid responsible for the Cretaceous-Paleogene extinction event"
        }
      },
      is_sentry_object: false
    }
  },
  barringer: {
    name: "Barringer (Meteor Crater)",
    emoji: "🌑",
    date: "Hace ~50,000 años",
    location: "Arizona, Estados Unidos",
    size: "~50 metros de diámetro",
    mass: "~300,000 toneladas",
    speed: "~12.8 km/s (estimado)",
    energy: "~10 megatones de TNT",
    impact: "Creó un cráter perfectamente preservado, uno de los mejor estudiados del mundo. El impacto vaporizó gran parte del meteorito.",
    crater: "1.2 km de diámetro, 170 metros de profundidad",
    facts: "• Primer cráter probado como de origen meteórico\n• Aún contiene fragmentos del meteorito\n• Es un sitio turístico y de investigación activo",
    apiData: {
      id: "50000",
      neo_reference_id: "50000",
      name: "Barringer Impactor (Canyon Diablo)",
      designation: "Canyon Diablo Meteorite",
      nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=barringer",
      absolute_magnitude_h: 24.1,
      estimated_diameter: {
        meters: { estimated_diameter_min: 40.0, estimated_diameter_max: 50.0 }
      },
      is_potentially_hazardous_asteroid: true,
      close_approach_data: [{
        close_approach_date: "50000 years ago",
        close_approach_date_full: "-48000-Jan-01 00:00",
        epoch_date_close_approach: -1639353600000,
        relative_velocity: {
          kilometers_per_second: "12.8",
          kilometers_per_hour: "46080.0"
        },
        miss_distance: {
          astronomical: "0.0",
          lunar: "0.0",
          kilometers: "0"
        },
        orbiting_body: "Earth"
      }],
      orbital_data: {
        orbit_id: "1",
        first_observation_date: "1891-01-01",
        last_observation_date: "2023-12-31",
        data_arc_in_days: 48577,
        observations_used: 1200,
        orbit_uncertainty: "1",
        minimum_orbit_intersection: ".0000",
        jupiter_tisserand_invariant: "4.5",
        eccentricity: ".456",
        semi_major_axis: "1.67",
        inclination: "4.2",
        ascending_node_longitude: "234.7",
        orbital_period: "789",
        perihelion_distance: "0.91",
        perihelion_argument: "178.4",
        aphelion_distance: "2.43",
        orbit_class: {
          orbit_class_type: "APO",
          orbit_class_description: "Near-Earth asteroid - Iron meteorite that created Meteor Crater in Arizona"
        }
      },
      is_sentry_object: false
    }
  }
};

let selectedMeteorId = null;

function initialize() {
  // Mode selector functionality
  const modeButtons = document.querySelectorAll('.mode-btn');
  const modeContents = document.querySelectorAll('.mode-content');
  
  modeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const mode = this.getAttribute('data-mode');
      
      // Update active button
      modeButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Update active content
      modeContents.forEach(content => content.classList.remove('active'));
      if (mode === 'simulate') {
        document.getElementById('simulation-mode').classList.add('active');
      } else {
        document.getElementById('real-mode').classList.add('active');
      }
    });
  });
  
  // Simulation meteor selector functionality
  const simulationOptions = document.querySelectorAll('#simulation-mode .meteor-option');
  simulationOptions.forEach(option => {
    option.addEventListener('click', function() {
      simulationOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      const meteorType = this.getAttribute('data-meteor');
      console.log('Selected simulation meteor type:', meteorType);
      // Functionality will be added later
    });
  });
  
  // Real meteor selector functionality
  const realOptions = document.querySelectorAll('#real-meteor-selector .meteor-option');
  realOptions.forEach(option => {
    option.addEventListener('click', function() {
      realOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      const meteorId = this.getAttribute('data-meteor-id');
      selectedMeteorId = meteorId;
      console.log('Selected real meteor:', meteorId);
    });
  });
  
  // Evento click en la imagen del meteorito
  const meteorImg = document.getElementById('meteor_img');
  const meteorModal = document.getElementById('meteor-modal');
  const modalClose = document.getElementById('modal-close');
  
  meteorImg.addEventListener('click', function() {
    if (selectedMeteorId && realMeteorsData[selectedMeteorId]) {
      showMeteorInfo(selectedMeteorId);
    } else {
      alert('Por favor, selecciona un meteorito real primero en la sección superior.');
    }
  });
  
  // Cerrar modal
  modalClose.addEventListener('click', function() {
    meteorModal.style.display = 'none';
  });
  
  // Cerrar modal al hacer click fuera
  window.addEventListener('click', function(event) {
    if (event.target === meteorModal) {
      meteorModal.style.display = 'none';
    }
  });
  
  // Función para mostrar información del meteorito
  function showMeteorInfo(meteorId) {
    const data = realMeteorsData[meteorId];
    
    // Si tiene datos de API, usar esos
    if (data.apiData) {
      showNasaApiMeteorInfo(data.apiData, data);
    } else {
      // Usar datos tradicionales
      document.getElementById('modal-emoji').textContent = data.emoji;
      document.getElementById('modal-name').textContent = data.name;
      document.getElementById('modal-date').textContent = data.date;
      document.getElementById('modal-location').textContent = data.location;
      document.getElementById('modal-size').textContent = data.size;
      document.getElementById('modal-mass').textContent = data.mass;
      document.getElementById('modal-speed').textContent = data.speed;
      document.getElementById('modal-energy').textContent = data.energy;
      document.getElementById('modal-impact').textContent = data.impact;
      document.getElementById('modal-crater').textContent = data.crater;
      document.getElementById('modal-facts').textContent = data.facts;
    }
    
    meteorModal.style.display = 'flex';
  }
  
  // Función para mostrar información de la API de NASA
  function showNasaApiMeteorInfo(apiData, additionalData = null) {
    const closeApproach = apiData.close_approach_data[0];
    const diameter = apiData.estimated_diameter.meters;
    const velocity = closeApproach.relative_velocity;
    const missDistance = closeApproach.miss_distance;
    
    // Usar emoji de datos adicionales si está disponible, o determinar según tamaño
    let emoji;
    if (additionalData && additionalData.emoji) {
      emoji = additionalData.emoji;
    } else {
      const avgDiameter = (diameter.estimated_diameter_min + diameter.estimated_diameter_max) / 2;
      if (avgDiameter > 500) emoji = '🔥';
      else if (avgDiameter > 200) emoji = '💥';
      else if (avgDiameter > 50) emoji = '☄️';
      else emoji = '🌠';
    }
    
    // Determinar peligrosidad
    const isPotentiallyHazardous = apiData.is_potentially_hazardous_asteroid;
    const hazardStatus = isPotentiallyHazardous ? '⚠️ SÍ - Asteroide potencialmente peligroso' : '✅ NO - Asteroide seguro';
    
    // Usar fecha de datos adicionales o formatear de API
    let formattedDate;
    if (additionalData && additionalData.date) {
      formattedDate = additionalData.date;
    } else {
      formattedDate = new Date(closeApproach.close_approach_date_full).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // Determinar si fue un impacto real o aproximación
    const isActualImpact = parseFloat(missDistance.kilometers) === 0;
    
    document.getElementById('modal-emoji').textContent = emoji;
    document.getElementById('modal-name').textContent = apiData.name;
    document.getElementById('modal-date').textContent = formattedDate;
    
    // Usar ubicación de datos adicionales si está disponible
    if (additionalData && additionalData.location) {
      document.getElementById('modal-location').textContent = additionalData.location;
    } else {
      document.getElementById('modal-location').textContent = `Aproximación cercana a la ${closeApproach.orbiting_body}`;
    }
    
    document.getElementById('modal-size').textContent = `${diameter.estimated_diameter_min.toFixed(2)} - ${diameter.estimated_diameter_max.toFixed(2)} metros de diámetro`;
    
    // Usar masa de datos adicionales si está disponible
    if (additionalData && additionalData.mass) {
      document.getElementById('modal-mass').textContent = additionalData.mass;
    } else {
      document.getElementById('modal-mass').textContent = 'Datos de masa estimados basados en tamaño';
    }
    
    document.getElementById('modal-speed').textContent = `${parseFloat(velocity.kilometers_per_second).toFixed(2)} km/s (${parseFloat(velocity.kilometers_per_hour).toLocaleString('es-ES')} km/h)`;
    
    // Usar energía de datos adicionales si está disponible
    if (additionalData && additionalData.energy) {
      document.getElementById('modal-energy').textContent = additionalData.energy;
    } else {
      document.getElementById('modal-energy').textContent = `Magnitud absoluta: ${apiData.absolute_magnitude_h}`;
    }
    
    // Usar impacto de datos adicionales si está disponible
    if (additionalData && additionalData.impact) {
      document.getElementById('modal-impact').textContent = additionalData.impact;
    } else if (isActualImpact) {
      document.getElementById('modal-impact').textContent = 'Este asteroide impactó directamente con la Tierra.';
    } else {
      document.getElementById('modal-impact').textContent = `Este asteroide pasará a ${parseFloat(missDistance.kilometers).toLocaleString('es-ES')} km de la Tierra (${parseFloat(missDistance.lunar).toFixed(2)} distancias lunares).`;
    }
    
    // Usar cráter de datos adicionales si está disponible
    if (additionalData && additionalData.crater) {
      document.getElementById('modal-crater').textContent = additionalData.crater;
    } else if (isActualImpact) {
      document.getElementById('modal-crater').textContent = 'Información del cráter no disponible';
    } else {
      document.getElementById('modal-crater').textContent = 'No habrá impacto - Paso cercano sin colisión';
    }
    
    // Construir sección de datos interesantes
    let facts = `• Designación: ${apiData.designation}
• Peligrosidad: ${hazardStatus}
• ID NASA: ${apiData.neo_reference_id}
• Distancia mínima de órbita de intersección: ${apiData.orbital_data.minimum_orbit_intersection} AU
• Período orbital: ${parseFloat(apiData.orbital_data.orbital_period).toFixed(2)} días
• Excentricidad orbital: ${parseFloat(apiData.orbital_data.eccentricity).toFixed(4)}
• Clase orbital: ${apiData.orbital_data.orbit_class.orbit_class_type}
• ${apiData.orbital_data.orbit_class.orbit_class_description}
• Observaciones: ${apiData.orbital_data.observations_used} observaciones en ${apiData.orbital_data.data_arc_in_days} días
• Primera observación: ${apiData.orbital_data.first_observation_date}
• Última observación: ${apiData.orbital_data.last_observation_date}`;
    
    // Agregar datos adicionales históricos si están disponibles
    if (additionalData && additionalData.facts) {
      facts += '\n\n📚 Datos Históricos Adicionales:\n' + additionalData.facts;
    }
    
    document.getElementById('modal-facts').textContent = facts;
    
    meteorModal.style.display = 'flex';
  }
  
  // Exponer funciones globalmente para uso futuro
  window.showNasaApiMeteorInfo = showNasaApiMeteorInfo;
  
  // Initialize stars background
  const starsCanvas = document.getElementById('stars_canvas');
  const ctx = starsCanvas.getContext('2d');
  
  // Set canvas size
  starsCanvas.width = window.innerWidth;
  starsCanvas.height = window.innerHeight;
  
  // Create stars
  const stars = [];
  const numStars = 50; // Number of stars
  const starColors = [
    'rgb(255, 255, 255)', // White (most common)
    'rgb(255, 255, 255)',
    'rgb(255, 255, 255)',
    'rgb(255, 255, 255)',
    'rgb(135, 206, 250)', // Light blue
    'rgb(255, 200, 150)', // Yellow-orange
    'rgb(255, 100, 100)'  // Red
  ];
  
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * starsCanvas.width,
      y: Math.random() * starsCanvas.height,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random(),
      fadeSpeed: (Math.random() * 0.002) + 0.001,
      color: starColors[Math.floor(Math.random() * starColors.length)]
    });
  }
  
  // Animate stars
  function animateStars() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, starsCanvas.width, starsCanvas.height);
    
    stars.forEach(star => {
      // Update opacity
      star.opacity += star.fadeSpeed;
      if (star.opacity >= 1 || star.opacity <= 0) {
        star.fadeSpeed = -star.fadeSpeed;
      }
      
      // Draw star
      const rgb = star.color.match(/\d+/g);
      ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${star.opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    requestAnimationFrame(animateStars);
  }
  
  animateStars();
  
  // Resize canvas on window resize
  window.addEventListener('resize', () => {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
  });
  
  // Initialize Earth map with zoom disabled and satellite texture
  var earth = new WE.map('earth_div', {
    zoom: 3,
    center: [0, 0],
    zooming: false,
    scrollWheelZoom: false
  });
  WE.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: ''
  }).addTo(earth);
  
  // Auto-rotate Earth slowly
  function rotateEarth() {
    const currentCenter = earth.getCenter();
    earth.setCenter([currentCenter[0], currentCenter[1] + 0.02]);
    requestAnimationFrame(rotateEarth);
  }
  
  // Start rotation after a short delay to ensure map is loaded
  setTimeout(() => {
    rotateEarth();
  }, 1000);
}
