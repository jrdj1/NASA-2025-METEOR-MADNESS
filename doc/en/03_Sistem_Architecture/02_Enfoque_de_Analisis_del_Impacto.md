# 🌍 Fase 2 — Pipeline de Análisis del Impacto y Consecuencias

## 🎯 Objetivo
Transformar los parámetros físicos y orbitales del asteroide (Fase 1) en **consecuencias cuantificadas y visualizables** sobre la Tierra: punto/área de impacto, cráter, sobrepresión, radiación térmica, efectos sísmicos, **tsunamis** (si oceánico) y **impacto ambiental y humano**, generando productos listos para alimentar la Fase 3 (mitigación y prevención).

---

## 🧩 Entradas y Fuentes

- **Desde Fase 1** (`AsteroidState`, `Ephemeris`, `EncounterReport`, `UncertaintyBundle`): diámetro, masa, velocidad, ángulo de entrada, energía, punto/tiempo de entrada y dispersión.
- **Datasets geoespaciales (preferente USGS)**
  - **DEM/Elevación** (resolución regional): relieve, pendientes, líneas de costa.
  - **Fallas / sismicidad** (contexto de propagación de ondas).
  - **Zonas de tsunami** y batimetría (si disponible).
- **Capas complementarias (si se integran)**
  - Población (WorldPop/GEOSTAT), uso del suelo, infraestructura crítica (hospitales, puertos, energía, data centers).

---

## 🔁 Flujo general del pipeline

1. Ingesta geoespacial y preparación del contexto.
2. Clasificación del tipo de impacto (oceánico / terrestre / aéreo).
3. Cinemática del impacto y energía útil.
4. Modelos de consecuencias primarias (cráter, sobrepresión, térmica).
5. Modelos de consecuencias secundarias (sísmica, eyección, incendio).
6. Módulo de **tsunami** (si impacto oceánico).
7. Exposición y riesgo (población, infra, ambiente).
8. Incertidumbre y sensibilidad (Monte Carlo geoespacial).
9. Generación de productos: mapas, vectores y reportes.
10. Publicación de **ImpactReport** y **CatastropheAnalysis** → Fase 3.

---

## 🗺️ 1) Ingesta geoespacial y preparación

- Descarga/carga de DEM, costas, polígonos administrativos, batimetría.
- Reproyección estandarizada (`EPSG:4326` o proyectada regional).
- **Tiles**/mosaicos para rendimiento; *clipping* del AOI (Area of Interest) en torno al punto de impacto ±R km.
- Calidad de datos: resolución, vacíos (no-data), unificación vertical (m vs. pies).

**Salida parcial:** `EarthContext` (DEM recortado, costas, capas temáticas).

---

## 🧭 2) Clasificación del tipo de impacto

Reglas basadas en el **punto de intersección** y el contexto del DEM/batimetría:
- **Oceánico**: profundidad > umbral (p.ej. > 50 m a 5 km de la costa).
- **Terrestre**: altitud terrestre ≥ 0 m en AOI.
- **Aéreo** (airburst): objetos < ~50–60 m con **fragmentación atmosférica** → explotan en altura (estimación H_burst por balística simple).

**Salida parcial:** `ImpactType ∈ {oceanic, continental, airburst}`.

---

## 🧮 3) Cinemática del impacto y energía útil

- **Energía cinética** (de Fase 1): \( E = \tfrac{1}{2} m v^2 \).
- **Ángulo de entrada** (θ): incide en cráter/eyección y acoplamiento al medio.
- **Energía útil al medio** (coeficiente de acoplamiento \(k\) 0–1): fracción de E que se transfiere al suelo/agua/atmósfera.
- **Altura de burst** (si airburst) por modelo balístico simplificado.

**Salida parcial:** `ImpactKinetics` (E útil, θ, H_burst).

---

## 🕳️ 4) Consecuencias primarias (modelo base)

### 4.1 Cráter (si continental)
- **Escalado π-group** para diámetro/profundidad de cráter: \( D_c = f(E, \rho_t, g, θ) \).
- **Zonas de daño** por **sobrepresión** (isóbaras p.ej. 1 psi, 3 psi, 5 psi, 10 psi): proyección radial sobre el DEM.
- **Radiación térmica**: umbrales de ignición/lesión (isotermas aproximadas).

### 4.2 Airburst
- Radio de **sobrepresión** y **onda térmica** en función de H_burst y E útil.

**Salidas:** `CraterGeom` (vector), `OverpressureRaster/Isobands`, `ThermalRaster/Isotherms`.

---

## 🌊 5) Consecuencias secundarias

- **Sísmica local**: magnitud equivalente estimada (relación E→Mw) y **atenuación** con distancia (curvas empíricas).
- **Eyección de material**: radio de deposición (simplificado) y caída de proyectiles finos (si procede).
- **Incendios**: probabilidad/área potencial a partir de dosis térmica + uso del suelo.

**Salidas:** `SeismicEstimate`, `EjectaBuffer`, `FirePotential` (raster).

---

## 🌐 6) Módulo de Tsunami (si oceánico)

**Objetivo:** estimar **altura de ola** y extensión de **inundación costera**.

- **Fuente**: desplazamiento de columna de agua por transferencia de impulso \(E_u\) y geometría de entrada.
- **Propagación**: atenuación con batimetría simple (trayectorias de rayo o aproximación de aguas someras 1D/2D simplificada).
- **Inundación**: *run-up* sobre DEM costero; genera **polígonos de inundación** y mapas de profundidad.

**Salidas:** `TsunamiHeights` (raster), `InundationPolygons` (vector), `ArrivalTimes` (si se calcula).

---

## 👥 7) Exposición y riesgo

- **Población expuesta**: intersección de isóbaras/tsunami con capa poblacional; conteos y densidades.
- **Infra crítica**: hospitales, puertos, energía, centros de datos; listas y buffers de riesgo.
- **Indicadores** (ejemplos): población expuesta por umbral de sobrepresión, km² inundados, activos críticos afectados.

**Salidas:** `ExposureReport` (tablas) y `RiskIndicators` (métricas).

---

## 🎲 8) Incertidumbre y sensibilidad (Monte Carlo geoespacial)

- Muestrear incertidumbres de Fase 1 (D, ρ, v, θ) + incertidumbre DEM/batimetría.
- Propagar N simulaciones (N=200–1000) y **agregar percentiles** por celda (para rasters) y por métrica (para tablas).
- Generar **mapas de banda de confianza** (P05, P50, P95) y barras de error en KPIs.

**Salidas:** `GeoUncertainty` (rasters percentiles) y `KPI_Uncertainty` (tablas).

---

## 🗂️ 9) Productos cartográficos y reportes

- **Rasters**: sobrepresión, térmica, tsunami (altura/profundidad), prob. incendio, P05/50/95.  
- **Vectores**: cráter, isóbaras/isotermas, inundación, AOI, infra afectada.  
- **Reportes**: `ImpactReport` y `CatastropheAnalysis` (JSON + PDF opcional).

**Esquema de `ImpactReport` (resumen):**
```json
{
  "impact_type": "continental|oceanic|airburst",
  "impact_point": {"lat": ..., "lon": ..., "t_iso": "..."},
  "crater": {"diameter_m": ..., "depth_m": ...},
  "overpressure": {"isobands": [1,3,5,10], "areas_km2": {...}},
  "thermal": {"thresholds": ["burn1","ignite"], "areas_km2": {...}},
  "seismic": {"Mw_equiv": ..., "notes": "..."},
  "tsunami": {"max_height_m": ..., "inundation_km2": ...}
}
```

**Esquema de `CatastropheAnalysis` (resumen):**
```json
{
  "primary_effects": ["overpressure","thermal","crater","tsunami"],
  "secondary_effects": ["seismic","ejecta","fire"],
  "exposure": {"population": {...}, "critical_infra": {...}},
  "kpis": {"people_exposed_p5_p50_p95": {...}, "km2_inundated": {...}},
  "notes": "assumptions, data_quality, limitations"
}
```

---

## 🧠 Pseudocódigo General

```python
def analyze_impact(asteroid_state, encounter_report, earth_context):
    # 1. Contexto geoespacial
    dem, coast, bathy = prepare_geo_context(earth_context)

    # 2. Tipo de impacto
    impact_type = classify_impact(encounter_report, dem, bathy)

    # 3. Cinemática y energía útil
    kinetics = compute_impact_kinetics(asteroid_state, impact_type)

    # 4. Consecuencias primarias
    prim = primary_effects(impact_type, kinetics, dem)

    # 5. Consecuencias secundarias
    sec = secondary_effects(impact_type, kinetics, dem, prim)

    # 6. Tsunami (si oceánico)
    tsunami = tsunami_module(impact_type, kinetics, bathy, dem)

    # 7. Exposición y riesgo
    exposure = compute_exposure(prim, sec, tsunami, earth_context.layers)

    # 8. Incertidumbre
    geo_unc = geo_monte_carlo(asteroid_state, dem, bathy, N=500)

    # 9. Reportes
    impact_report = build_impact_report(impact_type, prim, sec, tsunami)
    catastrophe = build_catastrophe_analysis(prim, sec, exposure, geo_unc)
    return impact_report, catastrophe
```

---

## 📡 API Interna Propuesta

| Endpoint | Método | Descripción |
|-----------|--------|-------------|
| `/api/impact/analyze` | POST | Ejecuta pipeline completo de impacto → `ImpactReport`, `CatastropheAnalysis`. |
| `/api/impact/maps` | GET | Devuelve URLs de tiles/rasters/vector de resultados. |
| `/api/impact/exposure` | GET | Indicadores de exposición y riesgo (tabulares). |
| `/api/impact/uncertainty` | GET | Mapas/estadísticos de incertidumbre. |

---

## 🖥️ Productos UI (mínimos)

- **Mapa 2D** (Mapbox/D3): cráter/isóbaras/isotermas o inundación tsunami.  
- **Panel de KPIs**: MT TNT, diámetros, áreas, población expuesta, infra afectada.  
- **Selector de incertidumbre**: P05/P50/P95.  
- **Descargas**: GeoJSON/COG/PNG + reportes JSON/PDF.

---

## ✅ Criterios de aceptación

- Coherencia física con entradas de Fase 1; explica supuestos y unidades.  
- Resultados reproducibles y **explicables** (documentación de modelos y límites).  
- Salidas en formatos estándar (GeoJSON/COG/PMTiles) y contratos JSON definidos.  
- Rendimiento: AOI regional procesable en minutos con *tiles* pre-generados.

---

© 2025 — NASA Space Apps Challenge  
**Proyecto:** *Meteor Madness*  
**Equipo:** *(nombre del equipo aquí)*
