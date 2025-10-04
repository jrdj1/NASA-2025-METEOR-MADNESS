# 03 – Arquitectura del Sistema

## 1. Descripción General

La arquitectura del sistema de **Meteor Madness** se ha diseñado siguiendo un enfoque **modular y orientado a servicios**, que garantiza flexibilidad, escalabilidad y facilidad de mantenimiento.  
Está estructurada en tres capas principales —**Capa de Datos**, **Capa de Simulación** y **Capa de Visualización**—, cada una con responsabilidades específicas e interconectadas mediante una arquitectura API ligera.

Este diseño modular permite actualizaciones independientes, integración de nuevos conjuntos de datos o algoritmos, y una gestión eficiente de los recursos durante la simulación y el renderizado.

---

## 2. Diagrama de Arquitectura

El siguiente esquema representa el flujo lógico de datos y las interacciones generales dentro del sistema:

    ┌────────────────────┐
    │     NASA NEO API   │
    └─────────┬──────────┘
              │
    ┌─────────▼──────────┐
    │     Capa de Datos   │
    │ (Obtención y        │
    │  Preprocesamiento)  │
    └─────────┬──────────┘
              │
    ┌─────────▼──────────┐
    │  Capa de Simulación│
    │ (Cálculos Físicos  │
    │   e Impacto)       │
    └─────────┬──────────┘
              │
    ┌─────────▼──────────┐
    │ Capa de Visualización│
    │ (3D, Mapas y UI)   │
    └─────────┬──────────┘
              │
    ┌─────────▼──────────┐
    │ Usuario Final (Web)│
    └────────────────────┘


---

## 3. Descripción de Componentes

### 3.1 Capa de Datos
- **Propósito:** Agregar, limpiar y estandarizar datos heterogéneos provenientes de fuentes espaciales (NASA) y terrestres (USGS).  
- **Fuentes Principales:**
  - API **NEO de NASA** para parámetros orbitales del asteroide (semieje mayor, excentricidad, velocidad, etc.).  
  - Conjuntos de datos del **USGS** sobre topografía, zonas sísmicas y elevación costera.  
- **Funciones:**
  - Conexión y recuperación de datos vía API.  
  - Conversión de unidades y normalización de coordenadas.  
  - Almacenamiento temporal en formatos estructurados (JSON, GeoJSON).  
  - Preprocesamiento básico para el motor de simulación.  

### 3.2 Capa de Simulación
- **Propósito:** Procesar los datos de entrada y realizar los cálculos físicos relativos a la trayectoria orbital y a las consecuencias del impacto.  
- **Características Principales:**
  - Resolución de mecánica orbital basada en **ecuaciones keplerianas**.  
  - Estimación de energía de impacto mediante `E = ½·m·v²`.  
  - Modelos de escalado de cráteres y propagación sísmica.  
  - Funciones modulares para futura integración de modelos más complejos (n-cuerpos, atmósfera).  
- **Tecnologías:** Python (NumPy, SciPy, Pandas) integradas en un backend con Flask o Django.

### 3.3 Capa de Visualización
- **Propósito:** Proporcionar una representación visual dinámica y en tiempo real de la trayectoria del asteroide y sus escenarios de impacto en la Tierra.  
- **Características Principales:**
  - Renderizado 3D de órbitas mediante **Three.js**.  
  - Visualización 2D de zonas de impacto, mapas de calor o tsunamis con **D3.js** y **Leaflet**.  
  - Interfaz construida en **HTML5/CSS3/JavaScript** o **React**, adaptada a dispositivos móviles.  
  - Controles interactivos: deslizadores, menús y línea temporal.  
- **Resultado:** Panel de control interactivo con sincronización entre datos visuales y numéricos.

---

## 4. Comunicación entre Capas

La comunicación se gestiona mediante **endpoints RESTful**, asegurando un bajo acoplamiento y alta modularidad.  
El backend (Flask/Django) gestiona:
- Solicitudes desde la capa de visualización (entrada del usuario).  
- Recuperación de datos externos desde las APIs.  
- Simulaciones físicas y serialización de resultados en formato JSON.  

El frontend consume esta API y actualiza las visualizaciones en tiempo real.  
Este enfoque permite un **despliegue distribuido** (servidores separados para backend y frontend) y compatibilidad con infraestructura en la nube.

---

## 5. Flujo de Datos

1. **Entrada:** El usuario selecciona los parámetros del asteroide o los recupera desde la API de NASA.  
2. **Procesamiento:** El motor de simulación calcula trayectorias, energía y consecuencias del impacto.  
3. **Salida:** La capa de visualización muestra los resultados en formato 2D y 3D.  
4. **Reiteración:** El usuario puede modificar parámetros de mitigación y volver a ejecutar la simulación.

---

## 6. Escalabilidad y Extensibilidad

La arquitectura está diseñada para **crecer de forma progresiva**:
- Incorporación de nuevas capas de datos (densidad poblacional, infraestructura crítica).  
- Despliegue en servicios cloud (AWS, Azure, GCP).  
- Uso de **Docker** para entornos modulares y reproducibles.  
- Posible extensión hacia entornos de realidad aumentada (AR) con fines educativos.

---

## 7. Seguridad e Integridad de Datos

- Todas las llamadas a API utilizan HTTPS y claves seguras.  
- Se implementa caché local para reducir carga sobre las APIs externas.  
- Validación de entradas para prevenir consultas malformadas o inyecciones.  
- Versionado y documentación de fuentes de datos para trazabilidad.

---

## 8. Resumen

La arquitectura de **Meteor Madness** logra un equilibrio entre **precisión científica**, **eficiencia computacional** y **accesibilidad visual**.  
Su diseño modular permite integrar sin esfuerzo nuevos conjuntos de datos y simulaciones avanzadas, constituyendo la base para una plataforma duradera en investigación, educación y concienciación sobre defensa planetaria.

