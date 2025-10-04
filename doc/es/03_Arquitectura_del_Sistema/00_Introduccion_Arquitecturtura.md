# 🚀 00 — Arquitectura General de la Aplicación

## 🌌 Visión general

La plataforma desarrollada en el marco del **NASA Space Apps Challenge 2025 – Meteor Madness** tiene como objetivo **transformar los datos científicos de NASA y USGS en conocimiento visual y estratégico**, permitiendo comprender y anticipar los efectos de un posible impacto de asteroide sobre la Tierra.

El sistema se concibe como una **arquitectura modular de tres fases principales** que interactúan de forma secuencial y dinámica:

1. **Análisis del asteroide**
2. **Análisis del impacto y consecuencias**
3. **Estrategias de mitigación y prevención**

Cada fase procesa la información proveniente de la anterior, generando un flujo continuo de datos, simulaciones y decisiones.
El resultado es una herramienta **interactiva, científica y educativa** que combina precisión técnica con accesibilidad para el público general.

---

## 🧭 Objetivo de la arquitectura

Convertir datos dispersos de distintas agencias (NASA, USGS) en una **cadena integrada de información procesable** que permita:

- Visualizar la trayectoria y energía del asteroide.
- Modelar los efectos físicos y medioambientales de un impacto.  
- Proponer estrategias de mitigación y respuesta basadas en evidencia.

---

## 🧩 Fase 1 — Análisis del Asteroide

**Propósito:**  
Recopilar y procesar datos orbitales y físicos del asteroide para modelar su trayectoria y determinar si existe riesgo de colisión con la Tierra.

**Fuentes de datos:**  
- [NASA NEO API](https://api.nasa.gov/neo/): diámetro, masa, velocidad, distancia mínima, elementos orbitales (a, e, i, Ω, ω, ν).  

**Procesos principales:**  
- Cálculo de energía cinética y masa estimada.  
- Simulación de la órbita (Kepler / propagación temporal).  
- Detección de intersección con la Tierra.  

**Outputs:**  
- `AsteroidState` → posición, velocidad, energía, probabilidad de impacto.  
- Visualización 3D en tiempo real (Three.js / CesiumJS).  

---

## 🌍 Fase 2 — Análisis del Impacto y Consecuencias

**Propósito:**  
Simular los efectos físicos, geográficos y ambientales del impacto en función de los parámetros del asteroide y la zona de colisión.

**Fuentes de datos:**  
- **USGS Datasets:** topografía, fallas sísmicas, zonas de tsunami, elevación, costas vulnerables.  
- Datos complementarios: densidad poblacional, infraestructura crítica (cuando estén disponibles).  

**Procesos principales:**  
- Cálculo de cráter y energía liberada (modelos π-scaling).  
- Estimación de efectos secundarios: ondas de choque, tsunamis, incendios, alteraciones atmosféricas.  
- Generación de mapas de riesgo en 2D y vistas 3D del área afectada.  

**Outputs:**  
- `ImpactReport`: magnitud del evento, radio afectado, energía TNT, tipo de impacto (oceánico / terrestre / atmosférico).  
- `CatastropheAnalysis`: consecuencias meteorológicas y medioambientales (tsunamis, incendios, variaciones climáticas).  
- Mapas interactivos (D3.js / Mapbox).  

---

## 🛰️ Fase 3 — Estrategias de Mitigación y Prevención

**Propósito:**  
Diseñar un **motor de decisión híbrido** capaz de generar estrategias multidimensionales (técnicas, políticas, sociales, económicas y ambientales) basadas en los resultados del análisis anterior.

**Procesos principales:**  
- Integración de datos de las fases previas (`AsteroidState` + `ImpactReport` + `CatastropheAnalysis`).  
- Clasificación del escenario según tipo de impacto, energía y consecuencias.  
- Generación de estrategias candidatas por enfoque.  
- Evaluación multicriterio (MCDA / TOPSIS / AHP).  
- Optimización temporal y de recursos (OR-Tools).  
- Simulación de robustez (Monte Carlo).  

**Outputs:**  
- `StrategySet`: ranking de estrategias.  
- `MitigationPlan`: plan de acción óptimo con cronograma.  
- `Narrative`: explicación textual adaptada a distintos niveles (científico / educativo).  

---

## 🔄 Interacción entre módulos

### Flujo de información

```
┌──────────────────────────┐
│      FASE 1              │
│  Análisis del Asteroide  │
└───────────┬──────────────┘
            ↓
┌──────────────────────────┐
│      FASE 2              │
│  Impacto y Consecuencias │
└───────────┬──────────────┘
            ↓
┌──────────────────────────┐
│      FASE 3              │
│ Mitigación y Prevención  │
└───────────┬──────────────┘
            ↓
     Visualización final
 (Mapas, simulaciones, UI)
```

**Relación entre fases:**

| De | Hacia | Dato transferido | Propósito |
|----|--------|------------------|------------|
- | Fase 1 | Fase 2 | `AsteroidState` | Define condiciones físicas del impacto |
- | Fase 2 | Fase 3 | `ImpactReport`, `CatastropheAnalysis` | Determina tipo de catástrofe y severidad |
- | Fase 3 | UI | `StrategySet`, `MitigationPlan`, `Narrative` | Presenta soluciones y explicaciones al usuario |

---

## 🧠 Integración y visualización final

El resultado final se presenta en una **plataforma web interactiva** que combina visualización 3D, mapas dinámicos y análisis explicativo.

---

© 2025 — NASA Space Apps Challenge  
**Proyecto:** *Meteor Madness*  
**Equipo:** *(nombre del equipo aquí)*
