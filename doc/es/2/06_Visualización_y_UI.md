# 06 – Visualización y Interfaz de Usuario

## 1. Descripción General

El componente de **Visualización e Interfaz de Usuario (UI)** de *Meteor Madness* convierte los datos numéricos y geoespaciales en experiencias interactivas, intuitivas y educativas.  
Su propósito es hacer que los resultados científicos complejos —trayectorias orbitales, zonas de impacto y efectos ambientales— sean accesibles y visualmente comprensibles para públicos que van desde científicos hasta el público general.

La filosofía de diseño se centra en la **claridad, la interactividad y la precisión científica**, garantizando al mismo tiempo un rendimiento fluido en navegadores web.

---

## 2. Objetivos de la Visualización

1. Representar en tiempo real trayectorias y eventos de impacto.  
2. Mostrar efectos geoespaciales (zonas de cráter, propagación de tsunamis, ondas sísmicas).  
3. Permitir la manipulación de parámetros (tamaño, velocidad, desviación) mediante controles dinámicos.  
4. Proporcionar explicaciones visuales de los conceptos físicos.  
5. Garantizar accesibilidad y adaptabilidad en distintos dispositivos.

---

## 3. Marco de Visualización

### 3.1 Tecnologías Principales
| Tecnología | Propósito |
|-------------|-----------|
| **Three.js** | Renderizado 3D de órbitas, trayectorias desviadas y puntos de impacto en la Tierra. |
| **D3.js** | Visualización 2D dinámica, gráficos y animaciones temporales. |
| **Leaflet.js** | Mapas interactivos con coordenadas geográficas reales. |
| **Plotly.js** | Representación gráfica de energía de impacto y correlaciones de magnitud. |
| **HTML5/CSS3/JavaScript (React)** | Desarrollo del frontend y lógica de control de la interfaz. |

---

### 3.2 Visualización 3D
- **Vista Orbital:** muestra el asteroide y la Tierra en un entorno tridimensional a escala.  
- **Animación de Trayectoria:** simula el movimiento con control de tiempo.  
- **Marcador de Impacto:** indica el punto de colisión proyectado sobre la superficie terrestre.  
- **Simulación de Desviación:** visualiza órbitas alternativas tras modificar el vector de velocidad.  

### 3.3 Visualización 2D y Geoespacial
- **Mapas de Calor:** muestran el radio del cráter y la distribución de energía.  
- **Propagación de Tsunamis:** ondas concéntricas animadas según datos de elevación del USGS.  
- **Ondas Sísmicas:** gradientes circulares que representan la propagación del movimiento del suelo.  
- **Leyendas Interactivas:** permiten activar o desactivar capas de datos.  

---

## 4. Diseño de la Interfaz de Usuario

### 4.1 Principios de Diseño
El diseño de la interfaz sigue principios **centrados en el usuario y con enfoque educativo**:
- Jerarquía visual clara y esquema de colores coherente.  
- Tooltips contextuales con definiciones científicas.  
- Panel minimalista que prioriza la simulación y los resultados.  
- Disposición adaptable a escritorio, tableta y móvil.  

### 4.2 Componentes Principales
| Componente | Descripción |
|-------------|--------------|
| **Panel de Control** | Controles deslizantes y menús para ajustar parámetros del asteroide y la simulación. |
| **Lienzo 3D** | Vista principal interactiva para la visualización de trayectorias e impactos. |
| **Mapa** | Representa las proyecciones de impacto y efectos sobre la superficie terrestre. |
| **Barra Lateral de Información** | Muestra resultados calculados (energía, tamaño del cráter, magnitud). |
| **Línea Temporal** | Permite pausar, retroceder o adelantar la simulación orbital. |

---

## 5. Interactividad y Experiencia de Usuario

La interfaz admite **retroalimentación en tiempo real** e **interacción bidireccional**:
- Los cambios en parámetros generan actualizaciones visuales inmediatas.  
- Al pasar el cursor o hacer clic, se muestran explicaciones emergentes.  
- Controles de cámara (zoom, rotación, desplazamiento) para exploración libre.  
- Múltiples modos de visualización: *científico*, *educativo* y *narrativo*.  

Las animaciones se implementan con **requestAnimationFrame()** para optimizar rendimiento y sincronizarse con el backend de simulación.

---

## 6. Accesibilidad e Inclusión

- Paleta de colores adaptada a daltónicos (normas WCAG).  
- Navegación por teclado y etiquetas ARIA para lectores de pantalla.  
- Interfaz multilingüe (inglés y español inicialmente).  
- Tamaño de fuente y contraste ajustables.  

---

## 7. Flujo de Datos e Integración

| Capa | Función |
|------|----------|
| **Backend (Flask/Django)** | Envía los resultados de simulación mediante API REST en formato JSON. |
| **Frontend (React/JS)** | Recupera y representa dinámicamente los resultados. |
| **Módulos de Visualización** | Procesan los datos para generar salidas 2D y 3D. |
| **Entradas del Usuario** | Se envían al backend para recalcular la simulación. |

---

## 8. Optimización del Rendimiento

- Renderizado con niveles de detalle (LOD) para modelos 3D.  
- Carga diferida de texturas y mapas.  
- Caché de recursos estáticos mediante *service workers*.  
- Escalado de resolución adaptativo según el GPU del dispositivo.  

---

## 9. Elementos Educativos

La visualización incluye **capas educativas e interactivas**:
- Ventanas emergentes que explican conceptos de mecánica orbital y física de impactos.  
- Modo “¿Qué pasaría si...?” para probar estrategias de mitigación.  
- Reproducción de escenarios (por ejemplo, “Desviar Impactor-2025”).  
- Visualización en tiempo real de valores numéricos con explicación contextual.  

---

## 10. Resumen

El sistema de visualización e interfaz de usuario de **Meteor Madness** actúa como puente entre los datos y la comprensión.  
Al combinar datos científicos precisos con visualizaciones inmersivas y accesibles, transforma la simulación de impactos de asteroides en una experiencia informativa y atractiva para todo tipo de usuarios.
