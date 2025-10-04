# 04 – Data and APIs

## 1. Overview

The **Meteor Madness** project relies on high-quality, open-access datasets from trusted governmental and scientific sources.  
Its foundation lies in combining **NASA’s Near-Earth Object (NEO) API** with **U.S. Geological Survey (USGS)** environmental and geological datasets.  
Together, these data sources provide both the **space parameters** necessary to simulate asteroid trajectories and the **Earth parameters** required to estimate impact consequences.

The goal is to create a unified and consistent data pipeline that feeds the simulation and visualization layers with reliable, preprocessed information.

---

## 2. Data Sources

### 2.1 NASA – Near-Earth Object (NEO) API
**Base URL:** [https://api.nasa.gov/neo/rest/v1/](https://api.nasa.gov/neo/rest/v1/)  
**Purpose:** Provides real-time information about asteroids and comets that approach Earth.  
**Type:** JSON REST API (requires free API key from NASA).  

**Main Endpoints:**
| Endpoint | Description |
|-----------|--------------|
| `/feed` | Retrieves NEOs within a given date range (up to 7 days). |
| `/neo/{id}` | Returns detailed orbital and physical data for a specific asteroid. |
| `/neo/browse` | Lists known objects with general parameters (size, orbit type, hazard level). |

**Key Parameters:**
- `name` – Asteroid name or designation.  
- `absolute_magnitude_h` – Brightness magnitude, used to estimate size.  
- `estimated_diameter_min/max` – In kilometers.  
- `is_potentially_hazardous_asteroid` – Boolean flag.  
- `close_approach_data` – Nested array containing relative velocity, miss distance, and orbiting body.

**Example Request:**
```
GET https://api.nasa.gov/neo/rest/v1/feed?start_date=2025-10-01&end_date=2025-10-07&api_key=DEMO_KEY
```

**Example Response Snippet:**
```json
{
  "element_count": 72,
  "near_earth_objects": {
    "2025-10-03": [
      {
        "name": "2025 AB",
        "nasa_jpl_url": "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2025%20AB",
        "estimated_diameter": { "kilometers": { "min": 0.12, "max": 0.25 } },
        "is_potentially_hazardous_asteroid": true,
        "close_approach_data": [
          {
            "relative_velocity": { "kilometers_per_second": "18.2" },
            "miss_distance": { "kilometers": "342000" },
            "orbiting_body": "Earth"
          }
        ]
      }
    ]
  }
}
```

---

### 2.2 USGS – Geological and Environmental Datasets
**Base Portal:** [https://www.usgs.gov/](https://www.usgs.gov/)  
**Purpose:** Provides Earth observation data for modeling the environmental impact of asteroid collisions.

**Data Types Used:**
| Dataset | Format | Description |
|----------|---------|-------------|
| Global Elevation Data | GeoTIFF / Raster | Used to identify terrain and coastal vulnerability. |
| Seismic Hazard Maps | Shapefile / GeoJSON | Used to estimate propagation of ground motion. |
| Tsunami Hazard Zones | GeoJSON / KML | Used to evaluate coastal impact risk. |

**Processing:**
- Downloaded and preprocessed using **GDAL**, **GeoPandas**, and **Rasterio**.  
- Simplified and resampled to improve browser rendering performance.  
- Converted to **GeoJSON** for direct use with **Leaflet** and **D3.js**.

---

### 2.3 Optional / Complementary Data
| Source | Type | Purpose |
|---------|------|----------|
| NASA Earth Observatory | Satellite imagery | For contextual visualization (clouds, terrain). |
| NOAA | Oceanic and atmospheric data | To correlate tsunami propagation models. |
| OpenStreetMap | Vector geodata | Used for regional overlays and educational layers. |

---

## 3. Data Processing Pipeline

The system follows a 4-stage data flow before simulation:

| Stage | Operation | Tools / Methods |
|--------|------------|----------------|
| **1. Acquisition** | Fetching raw data from APIs (NASA NEO, USGS). | Python (Requests, GDAL, GeoPandas) |
| **2. Normalization** | Unit conversion, coordinate transformation (WGS84), timestamp standardization. | Pandas, NumPy |
| **3. Filtering** | Extracting relevant fields (e.g., size, velocity, latitude/longitude). | Custom scripts |
| **4. Output Preparation** | Saving preprocessed data in JSON/GeoJSON for simulation layer. | Flask backend |

---

## 4. Data Validation and Quality Control

To ensure reliability and scientific accuracy:
- API requests include validation of key fields (`velocity`, `diameter`, `distance`).  
- Cross-verification between NASA data and known impact catalogs (where available).  
- Logging and caching of API responses for reproducibility.  
- Manual checks of geographic data (USGS) to verify CRS (Coordinate Reference System) consistency.  

---

## 5. Data Storage and Access

- Temporary in-memory storage for small simulations.  
- Local caching using **SQLite** or **JSON files** for offline runs.  
- Future versions may integrate a **PostgreSQL/PostGIS** database for spatial data management.

---

## 6. Licensing and Use Terms

All datasets and APIs used are publicly available under open data policies:
- **NASA Open Data Policy:** [https://data.nasa.gov/](https://data.nasa.gov/)  
- **USGS Open Data Policy:** [https://www.usgs.gov/products/data-and-tools/data-management](https://www.usgs.gov/products/data-and-tools/data-management)  

Proper attribution will be maintained in accordance with each source’s licensing terms.

---

## 7. Summary

The data ecosystem behind **Meteor Madness** ensures:
- Scientific authenticity via verified NASA and USGS sources.  
- Standardized preprocessing for accuracy and efficiency.  
- Compatibility with both scientific analysis and public visualization.

This data foundation supports a robust, transparent, and extensible simulation tool for planetary impact modeling.
