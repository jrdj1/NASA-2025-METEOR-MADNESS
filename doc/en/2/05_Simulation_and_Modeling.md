# 05 – Simulation and Modeling

## 1. Overview

The **simulation and modeling engine** of *Meteor Madness* represents the scientific core of the platform.  
It combines simplified orbital mechanics, impact physics, and geophysical modeling to simulate asteroid trajectories, estimate impact energy, and visualize secondary effects such as seismic propagation and tsunami generation.

The goal is not to perform high-fidelity astrophysical computations, but to offer a **scientifically grounded, computationally efficient**, and **educationally valuable** simulation suitable for real-time web applications.

---

## 2. Modeling Framework

The simulation process integrates three main scientific domains:

| Domain | Purpose | Example Parameters |
|---------|----------|--------------------|
| **Orbital Mechanics** | Compute asteroid motion and approach trajectory relative to Earth. | Semi-major axis, eccentricity, inclination, true anomaly |
| **Impact Physics** | Calculate energy release, crater dimensions, and shock propagation. | Mass, velocity, density, angle of impact |
| **Environmental Effects** | Estimate seismic and hydrodynamic responses. | Ground acceleration, water depth, coastal elevation |

These domains are modeled sequentially to produce coherent outputs that feed into the visualization system.

---

## 3. Orbital Mechanics Model

### 3.1 Input Parameters
From the **NASA NEO API**, the following orbital elements are retrieved:
- Semi-major axis (*a*)  
- Eccentricity (*e*)  
- Inclination (*i*)  
- Argument of periapsis (*ω*)  
- Longitude of ascending node (*Ω*)  
- True anomaly (*ν*)

### 3.2 Equations Used
The asteroid’s position relative to Earth is derived using classical Keplerian orbital mechanics:

\[
r = \frac{a(1 - e^2)}{1 + e \cos(ν)}
\]

Velocity is approximated as:

\[
v = \sqrt{μ \left(\frac{2}{r} - \frac{1}{a}\right)}
\]
where \( μ = GM_{☉} \) is the standard gravitational parameter for the Sun.

The position in 3D space is computed by rotating the orbital plane using the inclination, node, and argument of periapsis.

### 3.3 Simplifications
- The simulation assumes a **two-body system (Sun–asteroid)**, ignoring perturbations from other planets.  
- Earth’s position is fixed during short-term simulation intervals (<10 days).  
- Effects of atmospheric drag are modeled separately in the impact stage.

---

## 4. Impact Energy and Crater Modeling

### 4.1 Kinetic Energy Estimation
The total energy released upon impact is computed using:

\[
E = \frac{1}{2} m v^2
\]
where:
- \( m = \frac{4}{3} \pi r^3 ρ \) (assuming spherical asteroid)  
- \( ρ \) = density (default 3000 kg/m³)  
- \( v \) = impact velocity (km/s → m/s)  

Energy is converted to **TNT equivalent**:
\[
E_{TNT} = \frac{E}{4.184×10^{15}}
\]

### 4.2 Crater Scaling
Crater diameter is estimated using the empirical Holsapple–Schmidt relation:

\[
D = k \left( \frac{E}{ρ_t g} \right)^{1/4}
\]
where:
- \( k \) = empirical constant (~1.8 for rocky surfaces)  
- \( ρ_t \) = target density (2500 kg/m³)  
- \( g \) = gravity (9.81 m/s²)

### 4.3 Secondary Effects
- **Seismic Waves:** Estimated magnitude \( M_s = 0.67 \log(E) - 3.2 \)  
- **Tsunami Height:** \( H = α (E / d^2)^{1/3} \), where *d* = distance to impact zone, *α* = scaling factor.  
- **Atmospheric Shockwave:** Simplified exponential decay model applied radially from the impact site.

---

## 5. Simulation Workflow

| Step | Description | Output |
|------|--------------|---------|
| **1. Input Parsing** | Fetch and validate NEO data (size, speed, trajectory). | Normalized dataset |
| **2. Trajectory Simulation** | Compute orbital approach using Keplerian parameters. | Relative position and velocity |
| **3. Impact Calculation** | Estimate kinetic energy and crater size. | Energy, diameter, seismic equivalent |
| **4. Environmental Modeling** | Apply simplified models for seismic and tsunami propagation. | Geospatial effects |
| **5. Visualization Export** | Send structured data (JSON) to visualization layer. | Ready-to-render results |

---

## 6. Tools and Libraries

- **Python:** NumPy, SciPy, Pandas – numerical and physical computation.  
- **Astropy:** for astronomical constants and orbital mechanics.  
- **Matplotlib / Plotly:** internal validation plots.  
- **Flask/Django:** API exposure of simulation results.  

---

## 7. Limitations and Assumptions

- Simplified two-body orbital model (no planetary perturbations).  
- Constant average asteroid density (3000 kg/m³).  
- Earth considered as a static sphere without rotation.  
- Atmospheric entry not explicitly modeled (energy approximated at ground impact).  
- Seismic and tsunami models calibrated for educational purposes, not for emergency forecasting.

---

## 8. Summary

The **Meteor Madness** simulation framework combines scientific realism and computational efficiency.  
By simplifying complex orbital and impact dynamics while preserving core physical accuracy, the model enables real-time, web-based visualization of asteroid impact scenarios that remain both **educational and scientifically credible**.
