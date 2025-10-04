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
      console.log('Selected real meteor:', meteorId);
      // Functionality will be added later (API call)
    });
  });
  
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
