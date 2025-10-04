# 03 – System Architecture

## 1. Overview

The system architecture of the **Meteor Madness** platform is designed following a **modular, service-oriented approach** that ensures flexibility, scalability, and maintainability.  
It is structured into three primary layers — **Data Layer**, **Simulation Layer**, and **Visualization Layer** — each responsible for specific functions and interconnected through a lightweight API architecture.

This modular design allows independent updates, seamless integration of new datasets or algorithms, and efficient resource management during simulation and rendering.

---

## 2. Architecture Diagram

The following logical structure represents the high-level flow of data and interactions within the system:

    ┌────────────────────┐
    │     NASA NEO API   │
    └─────────┬──────────┘
              │
    ┌─────────▼──────────┐
    │       Data Layer    │
    │  (Data Retrieval &  │
    │   Preprocessing)    │
    └─────────┬──────────┘
              │
    ┌─────────▼──────────┐
    │   Simulation Layer  │
    │ (Physics & Impact   │
    │   Calculations)     │
    └─────────┬──────────┘
              │
    ┌─────────▼──────────┐
    │ Visualization Layer│
    │ (3D, Maps & UI)    │
    └─────────┬──────────┘
              │
    ┌─────────▼──────────┐
    │    End User (Web)   │
    └────────────────────┘


---

## 3. Components Description

### 3.1 Data Layer
- **Purpose:** To aggregate, clean, and standardize heterogeneous datasets from space (NASA) and Earth (USGS) sources.  
- **Main Sources:**
  - NASA **NEO API** for asteroid orbital parameters (e.g., semi-major axis, eccentricity, velocity).  
  - USGS datasets for topography, seismic zones, and coastal elevation.  
- **Functions:**
  - API connection and data fetching.  
  - Unit conversion and coordinate normalization.  
  - Temporary storage in structured formats (JSON, GeoJSON).  
  - Basic preprocessing for simulation input.  

### 3.2 Simulation Layer
- **Purpose:** To process the input data and perform the physical calculations for orbital motion and impact consequences.  
- **Key Features:**
  - Orbital mechanics solver based on **Keplerian equations**.  
  - Impact energy estimation using `E = ½·m·v²`.  
  - Crater scaling and seismic propagation models.  
  - Modular functions for future inclusion of advanced physics (n-body approximations, atmospheric models).  
- **Technologies:** Python (NumPy, SciPy, Pandas) integrated via Flask/Django backend.

### 3.3 Visualization Layer
- **Purpose:** To provide dynamic, real-time rendering of the asteroid’s trajectory and Earth impact scenarios.  
- **Key Features:**
  - 3D rendering of orbits using **Three.js**.  
  - 2D data visualization (impact zones, heatmaps, tsunami areas) with **D3.js** and **Leaflet**.  
  - UI built in **HTML5/CSS3/JavaScript** or **React** for responsiveness.  
  - Interactive controls: sliders, dropdowns, and time scrubbing.  
- **Output:** Interactive dashboard with synchronized visual and numerical data.

---

## 4. Communication Between Layers

Communication is handled via **RESTful API endpoints**, ensuring loose coupling and modularity.  
The backend (Flask/Django) manages:
- Requests from the visualization layer (user input).  
- Data retrieval from external APIs.  
- Physics simulations and result serialization (JSON).  

The frontend consumes this API and updates the visualizations in real time.  
This approach allows for **distributed deployment** (e.g., separate servers for backend and frontend) and ensures compatibility with cloud-based scaling in the future.

---

## 5. Data Flow Summary

1. **Input Stage:** User selects asteroid parameters or retrieves data from NASA’s API.  
2. **Processing Stage:** Simulation engine calculates trajectories, energy, and impact consequences.  
3. **Output Stage:** Visualization layer displays the results interactively in 2D and 3D.  
4. **Optional:** Users can adjust mitigation parameters and re-run simulations instantly.

---

## 6. Scalability and Extensibility

The system architecture is designed for **future expansion**:
- Integration of additional data layers (e.g., population density, infrastructure risk).  
- Deployment on scalable cloud infrastructure (e.g., AWS, Azure, or GCP).  
- Possibility of containerization using Docker for modular development.  
- Extension into augmented reality (AR) environments for educational outreach.

---

## 7. Security and Data Integrity

- All API calls use HTTPS with secure keys for NASA endpoints.  
- Local caching minimizes API overload.  
- Input validation prevents malformed user queries or injections.  
- Data sources are versioned and documented for traceability.

---

## 8. Summary

The **Meteor Madness** system architecture achieves a balance between **scientific accuracy**, **computational efficiency**, and **visual accessibility**.  
Its modular design allows the seamless integration of external datasets and advanced simulations, positioning it as a foundation for long-term research, education, and planetary defense awareness.

