# 🚀 Fase 1 — Pipeline de Análisis del Asteroide

## 🎯 Objetivo
Obtener, validar y propagar los parámetros orbitales y físicos de uno o varios **Near-Earth Objects (NEOs)** para:

1. Visualizar sus trayectorias.  
2. Estimar magnitudes clave (masa, energía).  
3. Detectar posibles intersecciones con la Tierra y evaluar la viabilidad de estrategias de mitigación (Δv).

---

## 🧩 Entradas y Fuentes

- **Entradas de usuario:** ID/fecha objetivo, selección de NEO(s), o parámetros manuales (diámetro, densidad, velocidad, epoch).  
- **NASA NEO API:** elementos orbitales keplerianos (a, e, i, Ω, ω, M/ν), tamaño, velocidad, MOID/miss distance, ventanas de aproximación.  
- **Catálogo auxiliar (opcional):** densidad por tipo de asteroide (C/S/M) para estimar masa.

---

## 🔁 Flujo general del pipeline

1. Ingesta y almacenamiento en caché.
2. Normalización y validación de datos.
3. Estimación de propiedades físicas.
4. Propagación orbital.
5. Detección de aproximaciones o intersecciones.
6. Estimación de Δv y ventanas de oportunidad.
7. Análisis de incertidumbre (Monte Carlo ligero).
8. Generación de salida para la Fase 2.

---

## ⚙️ 1) Ingesta y Caching

- Obtiene datos de la NASA NEO API.
- Aplica límites de tasa, reintentos y guarda copias locales (caché).
- Incluye metadatos de origen (timestamp, versión de API).

**Output parcial:** `RawNeoRecord[]`

---

## 📏 2) Normalización y Validación

- Conversión de unidades: km → m, km/s → m/s, grados → radianes.  
- Validación de rangos físicos:  
  - `0 < e < 1`  
  - `a > 0`  
  - `0 ≤ i ≤ π`  
- Cálculo de promedios si existen rangos de diámetro.  
- Corrección de inconsistencias menores (clamp).  

**Output parcial:** `NeoStateRaw` (datos limpios y consistentes)

---

## 🧮 3) Estimaciones Físicas

- **Diámetro efectivo (D)**: media ponderada si hay rango.  
- **Densidad (ρ)**: según tipo (C/S/M) o valor por defecto (3000 kg/m³).  
- **Masa:**  
  \( m = ρ \cdot \frac{π}{6} D^3 \)  
- **Energía cinética:**  
  \( E = \frac{1}{2} m v^2 \)  
  Convertida a megatones TNT (1 MT = 4.184×10¹⁵ J).  

**Output parcial:** `PhysicalEstimate`

---

## 🛰️ 4) Propagación Orbital (Efemérides)

- Modelo **kepleriano** (dos cuerpos).  
- Propagación en pasos Δt (por ejemplo, 6 horas).  
- Conversión a sistemas de referencia ECI/ECEF para proyección sobre la Tierra.  

**Output parcial:** `Ephemeris[]` → posiciones y velocidades temporales.

---

## 🌍 5) Detección de aproximaciones e intersecciones

- Cálculo de **distancia mínima** entre trayectoria del NEO y la Tierra.  
- Identificación de **encuentros cercanos** (mínimos locales).  
- Si existe intersección: estimación del punto y tiempo de entrada atmosférica.  

**Output parcial:**  
`EncounterReport` → { `min_distance`, `t_min`, `intersection_flag` }

---

## 🔧 6) Estimación de Δv y ventanas de mitigación

- Simula variaciones pequeñas de velocidad (Δv) para analizar desviaciones orbitales.  
- Calcula **ventanas de lanzamiento** y tiempos de vuelo estimados.  
- Define una métrica de **"desviabilidad"** entre 0–1 basada en tiempo disponible y Δv necesario.  

**Output parcial:**  
`MitigationKinematics` → { `delta_v_req_est`, `windows`, `deviability_score` }

---

## 🎲 7) Análisis de Incertidumbre (Monte Carlo Ligero)

- Variación aleatoria de parámetros (diámetro, densidad, elementos orbitales).  
- Propagación rápida (N = 500–1000 muestras).  
- Obtención de bandas de confianza: P05, P50, P95 para distancia mínima, energía y tiempo de impacto.  

**Output parcial:** `UncertaintyBundle`

---

## 📦 8) Empaquetado y Salida hacia la Fase 2

**Contrato de datos:**

```json
{
  "AsteroidState": {
    "id": "neo_XXXX",
    "epoch_iso": "2025-10-04T00:00:00Z",
    "elements": {"a_m": ..., "e": ..., "i_rad": ..., "Omega_rad": ..., "omega_rad": ..., "M0_rad": ...},
    "diameter_m": ..., "density_kgm3": ..., "mass_kg": ...,
    "velocity_ms": ..., "energy_J": ..., "energy_MT": ...
  },
  "Ephemeris": [{"t": "...", "r_ecI_m":[...], "v_ecI_ms":[...]}],
  "EncounterReport": {"min_distance_km": ..., "t_min_iso": "...", "intersection_flag": true},
  "MitigationKinematics": {"delta_v_req_est_ms": ..., "windows": [...], "deviability_score": 0.0-1.0},
  "UncertaintyBundle": {"miss_distance_km": {"p05":...,"p50":...,"p95":...}}
}
```

---

## 🧠 Pseudocódigo General

```python
def analyze_asteroid(neo_id_or_params, horizon_days=3650):
    raw = fetch_neo(neo_id_or_params)
    state = normalize_and_validate(raw)
    phys = estimate_physics(state)
    eph = propagate_orbit(state, horizon_days)
    enc = detect_encounters(eph)
    kin = estimate_mitigation_kinematics(state, enc)
    unc = monte_carlo_uncertainty(state)
    return package_output(state, eph, enc, kin, unc)
```

---

## 📡 API Interna Propuesta

| Endpoint | Método | Descripción |
|-----------|---------|-------------|
| `/api/asteroids/{id}` | GET | Retorna el estado del asteroide (`AsteroidState`). |
| `/api/asteroids/{id}/ephemeris` | GET | Genera efemérides con parámetros de tiempo. |
| `/api/asteroids/{id}/encounters` | GET | Reporta aproximaciones cercanas o impactos. |
| `/api/asteroids/whatif-dv` | POST | Simula desviaciones por Δv. |
| `/api/asteroids/{id}/uncertainty` | GET | Devuelve análisis de incertidumbre. |

---

## 🖥️ Interfaz Gráfica (UI)

- **Visualización 3D:** órbita del asteroide y trayectoria con escala de tiempo.  
- **Panel físico:** masa, velocidad, energía y rango de incertidumbre.  
- **Panel de encuentros:** distancia mínima, fecha y nivel de riesgo.  
- **Controles “what-if”:** aplicar Δv y ver desviación resultante.  

---

## ✅ Criterios de Aceptación

- Precisión aceptable (error ≤ 2% en horizonte de 10 años).  
- Soporte para asteroides sin datos completos (valores por defecto explicables).  
- Compatibilidad directa con la Fase 2 (`ImpactReport`).  
- Visualización y simulación reproducibles y explicables.

---

© 2025 — NASA Space Apps Challenge  
**Proyecto:** *Meteor Madness*  
**Equipo:** *(nombre del equipo aquí)*
