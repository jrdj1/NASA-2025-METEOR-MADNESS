// Datos de meteoritos reales
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
    facts: "• Detectado solo horas antes del impacto\n• La explosión fue más brillante que el sol\n• Fue el mayor evento de este tipo desde Tunguska"
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
    facts: "• El evento más destructivo registrado en la historia\n• Testigos reportaron un resplandor azul en el cielo\n• Se sintió a cientos de kilómetros de distancia"
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
    facts: "• Desencadenó tsunamis masivos y incendios globales\n• Levantó nubes de polvo que bloquearon el sol por años\n• Marcó el fin de la era de los dinosaurios"
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
    facts: "• Primer cráter probado como de origen meteórico\n• Aún contiene fragmentos del meteorito\n• Es un sitio turístico y de investigación activo"
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
    
    meteorModal.style.display = 'flex';
  }
  
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
