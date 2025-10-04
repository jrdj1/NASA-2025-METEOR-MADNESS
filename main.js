let selectedMeteorId = null;

// Función para cambiar el tamaño de la imagen del meteorito
function updateMeteorSize(sizeCategory) {
  const meteorImg = document.getElementById('meteor_img');
  
  // Remover todas las clases de tamaño existentes
  meteorImg.classList.remove('size-small', 'size-medium', 'size-large', 'size-catastrophic');
  
  // Añadir la nueva clase de tamaño
  if (sizeCategory) {
    meteorImg.classList.add(`size-${sizeCategory}`);
  }
}

// Función para determinar tamaño basado en diámetro (para API NASA)
function getSizeCategoryFromDiameter(avgDiameter) {
  if (avgDiameter > 500) return 'catastrophic';
  if (avgDiameter > 200) return 'large';
  if (avgDiameter > 50) return 'medium';
  return 'small';
}

// Función para hacer scroll suave hacia la sección principal
function scrollToMainContent() {
  const container = document.getElementById('container');
  if (container) {
    container.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

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
      
      // Cambiar tamaño de la imagen según el tipo seleccionado
      updateMeteorSize(meteorType);
      
      // Hacer scroll automático hacia la sección principal con un pequeño delay
      setTimeout(() => {
        scrollToMainContent();
      }, 300);
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
    if (window.selectedNeoData) {
      showNasaApiMeteorInfo(window.selectedNeoData);
    } else if (selectedMeteorId && realMeteorsData && realMeteorsData[selectedMeteorId]) {
      const data = realMeteorsData[selectedMeteorId];
      if (data.apiData) {
        showNasaApiMeteorInfo(data.apiData, data);
      } else {
        showMeteorInfo(selectedMeteorId);
      }
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
    
    // Calcular diámetro promedio y actualizar tamaño de la imagen
    const avgDiameter = (diameter.estimated_diameter_min + diameter.estimated_diameter_max) / 2;
    const sizeCategory = getSizeCategoryFromDiameter(avgDiameter);
    updateMeteorSize(sizeCategory);
    
    // Usar emoji de datos adicionales si está disponible, o determinar según tamaño
    let emoji;
    if (additionalData && additionalData.emoji) {
      emoji = additionalData.emoji;
    } else {
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
    
    // Construir sección de datos interesantes con datos disponibles
    let facts = `• Designación: ${apiData.designation || apiData.name}
• Peligrosidad: ${hazardStatus}
• ID NASA: ${apiData.neo_reference_id}
• Magnitud absoluta: ${apiData.absolute_magnitude_h}
• Velocidad relativa: ${parseFloat(velocity.kilometers_per_second).toFixed(2)} km/s
• Distancia de aproximación: ${parseFloat(missDistance.kilometers).toLocaleString('es-ES')} km
• Distancias lunares: ${parseFloat(missDistance.lunar).toFixed(2)} LD
• Es objeto Sentry: ${apiData.is_sentry_object ? 'Sí' : 'No'}`;
    
    // Agregar datos de Sentry si está disponible
    if (apiData.is_sentry_object && apiData.sentry_data) {
      facts += '\n• Datos adicionales de riesgo disponibles en NASA Sentry';
    }
    
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
  
  // Load real meteors from NASA API
  loadRealMeteorsFromAPI();
}

// Function to fetch and display real meteors from NASA API
async function loadRealMeteorsFromAPI() {
  const API_BASE_URL = 'http://localhost:6789';
  
  try {
    console.log('Fetching NEO data from API...');
    const response = await fetch(`${API_BASE_URL}/recent_neos`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', data);
    
    // Check if data has error property (if it's an object with error)
    if (data && typeof data === 'object' && data.error) {
      console.error('Error fetching NEO data:', data.error);
      showLoadingError('Error en la API: ' + data.error);
      return;
    }
    
    // Check if data is an array directly (your API returns array directly)
    if (Array.isArray(data) && data.length > 0) {
      console.log(`Loaded ${data.length} NEOs from API`);
      // Update the real meteor selector with API data
      updateRealMeteorSelector(data);
    } 
    // Check if data has neos property (alternative structure)
    else if (data && data.neos && Array.isArray(data.neos) && data.neos.length > 0) {
      console.log(`Loaded ${data.neos.length} NEOs from API`);
      updateRealMeteorSelector(data.neos);
    } 
    else {
      console.warn('No NEO data received from API');
      console.log('Data structure:', typeof data, data);
      showLoadingError('No se encontraron datos de meteoritos');
    }
  } catch (error) {
    console.error('Error connecting to API:', error);
    showLoadingError('Error de conexión: ' + error.message);
  }
}

// Function to show loading error
function showLoadingError(message) {
  const realMeteorSelector = document.getElementById('real-meteor-selector');
  realMeteorSelector.innerHTML = `
    <div class="meteor-option error">
      <h3>⚠️ Error</h3>
      <p>${message}</p>
    </div>
  `;
}

// Function to update the real meteor selector with NASA API data
function updateRealMeteorSelector(neos) {
  const realMeteorSelector = document.getElementById('real-meteor-selector');
  
  // Clear existing content
  realMeteorSelector.innerHTML = '';
  
  console.log('Updating selector with', neos.length, 'NEOs');
  
  // Categorize NEOs by size
  const categories = {
    small: { meteors: [], emoji: '🌠', label: 'Pequeños (< 50m)', limit: 3 },
    medium: { meteors: [], emoji: '☄️', label: 'Medianos (50-200m)', limit: 3 },
    large: { meteors: [], emoji: '💥', label: 'Grandes (200-500m)', limit: 3 },
    massive: { meteors: [], emoji: '🔥', label: 'Masivos (> 500m)', limit: 3 }
  };
  
  // Sort meteors into categories
  neos.forEach((neo, index) => {
    const diameter = neo.estimated_diameter.meters;
    const avgDiameter = (diameter.estimated_diameter_min + diameter.estimated_diameter_max) / 2;
    
    if (avgDiameter > 500) {
      if (categories.massive.meteors.length < categories.massive.limit) {
        categories.massive.meteors.push(neo);
      }
    } else if (avgDiameter > 200) {
      if (categories.large.meteors.length < categories.large.limit) {
        categories.large.meteors.push(neo);
      }
    } else if (avgDiameter > 50) {
      if (categories.medium.meteors.length < categories.medium.limit) {
        categories.medium.meteors.push(neo);
      }
    } else {
      if (categories.small.meteors.length < categories.small.limit) {
        categories.small.meteors.push(neo);
      }
    }
  });
  
  // Create columns for each category that has meteors
  Object.keys(categories).forEach(categoryKey => {
    const category = categories[categoryKey];
    if (category.meteors.length > 0) {
      // Create category container (column)
      const categoryContainer = document.createElement('div');
      categoryContainer.className = 'meteor-category-container';
      
      // Create category header
      const categoryHeader = document.createElement('div');
      categoryHeader.className = 'meteor-category-header';
      categoryHeader.innerHTML = `<h3>${category.emoji} ${category.label}</h3>`;
      categoryContainer.appendChild(categoryHeader);
      
      // Create column container for meteors
      const columnContainer = document.createElement('div');
      columnContainer.className = 'meteor-row';
      
      // Add meteors to this column
      category.meteors.forEach((neo, index) => {
        const closeApproach = neo.close_approach_data[0];
        const diameter = neo.estimated_diameter.meters;
        const avgDiameter = (diameter.estimated_diameter_min + diameter.estimated_diameter_max) / 2;
        
        // Format date
        const date = new Date(closeApproach.close_approach_date);
        const formattedDate = date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        
        // Create meteor option element
        const meteorOption = document.createElement('div');
        meteorOption.className = 'meteor-option';
        meteorOption.setAttribute('data-neo-id', neo.id);
        meteorOption.setAttribute('data-neo-index', index);
        
        meteorOption.innerHTML = `
          <h3>${category.emoji} ${neo.name}</h3>
          <p>${formattedDate} - ${Math.round(avgDiameter)}m</p>
        `;
        
        // Add click event
        meteorOption.addEventListener('click', function() {
          console.log('Clicked on NEO:', neo.name);
          
          // Remove active class from all options
          document.querySelectorAll('#real-meteor-selector .meteor-option').forEach(opt => {
            opt.classList.remove('active');
          });
          
          // Add active class to clicked option
          this.classList.add('active');
          
          // Store the NEO data globally for modal display
          window.selectedNeoData = neo;
          selectedMeteorId = neo.id;
          
          // Cambiar tamaño de la imagen según el diámetro del asteroide
          const sizeCategory = getSizeCategoryFromDiameter(avgDiameter);
          updateMeteorSize(sizeCategory);
          
          // Hacer scroll automático hacia la sección principal con un pequeño delay
          setTimeout(() => {
            scrollToMainContent();
          }, 300);
          
          console.log('Selected NEO:', neo.name, 'ID:', neo.id, 'Size:', sizeCategory);
        });
        
        columnContainer.appendChild(meteorOption);
      });
      
      categoryContainer.appendChild(columnContainer);
      realMeteorSelector.appendChild(categoryContainer);
    }
  });
  
  // If no meteors were categorized, show message
  if (realMeteorSelector.children.length === 0) {
    realMeteorSelector.innerHTML = `
      <div class="meteor-option error">
        <h3>⚠️ Sin datos</h3>
        <p>No se encontraron meteoritos en las categorías esperadas</p>
      </div>
    `;
  }
  
  console.log('Real meteor selector updated successfully with categorized meteors');
}
