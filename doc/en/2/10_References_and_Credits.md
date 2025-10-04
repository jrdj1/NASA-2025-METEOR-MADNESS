# 10 – References and Credits

## 1. Overview

This document compiles the **scientific references, datasets, and acknowledgements** used in the development of *Meteor Madness* during the NASA Space Apps Challenge 2025.  
It ensures transparency, traceability, and recognition of all data providers, contributors, and supporting organizations.

---

## 2. Primary Data Sources

### NASA – Near-Earth Object (NEO) Program
- **API:** [https://api.nasa.gov/neo/rest/v1/](https://api.nasa.gov/neo/rest/v1/)  
- **Purpose:** Orbital and physical data of near-Earth asteroids and comets.  
- **Owner:** NASA’s Planetary Defense Coordination Office (PDCO).  

### U.S. Geological Survey (USGS)
- **Portal:** [https://www.usgs.gov/](https://www.usgs.gov/)  
- **Purpose:** Earth-based geophysical and environmental datasets used for impact modeling.  
- **Data Types:** Elevation (GeoTIFF), seismic hazard zones (GeoJSON), tsunami maps (KML).  

### Additional Open Datasets
- **NASA Earth Observatory:** Satellite imagery for terrain context.  
- **NOAA:** Atmospheric and oceanographic data for tsunami modeling.  
- **OpenStreetMap:** Global vector geodata for mapping overlays.  

---

## 3. Scientific References

| Reference | Description |
|------------|-------------|
| Holsapple, K. A. (1993). "The scaling of impact processes in planetary sciences." *Annual Review of Earth and Planetary Sciences, 21*, 333–373. | Basis for crater size scaling equations. |
| Schmidt, R. M., & Housen, K. R. (1987). "Some recent advances in the scaling of impact and explosion cratering." *Int. J. Impact Eng.*, 5(1–4), 543–560. | Experimental crater scaling laws. |
| Collins, G. S., Melosh, H. J., & Marcus, R. A. (2005). "Earth Impact Effects Program: A Web-based calculator for impact effects." *Meteoritics & Planetary Science, 40*(6), 817–840. | Reference for energy and atmospheric entry modeling. |
| NASA Planetary Defense Coordination Office. (2025). *Planetary Defense Strategy Document.* | Contextual framework for planetary defense. |
| USGS Natural Hazards Program Reports (2024). | Used for seismic and tsunami hazard comparisons. |

---

## 4. Tools and Libraries

- **Python:** NumPy, SciPy, Pandas, Astropy, Matplotlib, Flask.  
- **Web:** Three.js, D3.js, Leaflet, Plotly, React.  
- **Geospatial:** GDAL, GeoPandas, Rasterio.  
- **Design:** Figma, Adobe Illustrator (UI mockups).  

---

## 5. Contributors

| Role | Contributor |
|------|--------------|
| **Project Lead / Full-Stack Developer** | Jorge Rafael de Julián Vicedo |
| **Data Scientist / Simulation Engineer** | [Name Placeholder] |
| **Frontend Developer / Visualization** | [Name Placeholder] |
| **Scientific Advisor (Astrophysics)** | [Name Placeholder] |
| **UX/UI Designer** | [Name Placeholder] |

---

## 6. Acknowledgements

Special thanks to:
- **NASA Space Apps Challenge 2025** organizers for providing the opportunity and challenge context.  
- **NASA PDCO and USGS** for open access to high-quality datasets.  
- **University collaborators and mentors** for technical guidance.  
- **Open-source community** for maintaining libraries and APIs used in development.  

---

## 7. Licensing

This project and all associated documentation are released under the **MIT License**.  
All external datasets and APIs retain their respective licenses under NASA, USGS, or open data agreements.

> © 2025 Meteor Madness Team. Created for the NASA Space Apps Challenge 2025.
