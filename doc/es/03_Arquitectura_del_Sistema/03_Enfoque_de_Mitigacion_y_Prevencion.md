# 🌍 Fase 3 — Estrategias de Mitigación y Prevención

## 🎯 Objetivo general
Diseñar un **motor de decisión inteligente** capaz de **proponer estrategias multidimensionales de defensa planetaria** frente a impactos de asteroides, combinando modelos científicos, optimización matemática y criterios sociales y políticos.

---

## 🔁 Pipeline general (orden actualizado)

1. Entrada de contexto
2. Análisis de consecuencias ambientales
3. Clasificación del escenario
4. Generación de estrategias candidatas
5. Evaluación y priorización (MCDA)
6. Optimización temporal y de recursos
7. Validación y robustez
8. Generación de salida explicativa

---

## 🧠 1 — Entrada de contexto

**Inputs principales:**
- `AsteroidState` (fase 1):
  - diámetro, masa, velocidad, trayectoria, energía cinética, tiempo hasta impacto.
- `ImpactReport` (fase 2):
  - tipo de impacto (oceánico / terrestre / atmosférico),
  - magnitud (MT TNT, radio afectado),
  - zonas vulnerables (densidad poblacional, topografía, costas, infraestructura),
  - efectos secundarios estimados (tsunamis, ondas de choque, incendios, caída de temperatura, aerosoles).
- `SystemConstraints`:
  - tiempo disponible, capacidad tecnológica, presupuesto, nivel de cooperación internacional.

---

## 🌪️ 2 — Análisis de consecuencias ambientales

**Objetivo:** integrar los resultados del análisis de impacto (Fase 2) para adaptar las estrategias al tipo de catástrofe meteorológica o medioambiental predominante.

**Ejemplos de correlación:**

| Tipo de impacto | Consecuencias principales | Estrategias prioritarias |
|------------------|---------------------------|---------------------------|

- | Oceánico | Tsunamis, inundaciones costeras | Evacuación costera, alerta temprana, refuerzo de diques |
- | Terrestre | Onda de choque, terremoto, incendios | Refuerzo estructural, planes de evacuación urbana, control de incendios |
- | Atmosférico | Desintegración parcial, onda térmica | Comunicación y educación pública, monitoreo continuo |
- | Global | Nube de polvo, caída de temperatura | Coordinación política global, plan alimentario, mitigación climática |

🔹 Este submódulo usa los resultados físicos y ambientales de la Fase 2 para **modular la clasificación posterior** y **ajustar las ponderaciones de riesgo**.

---

## ⚙️ 3 — Clasificación del escenario

**Objetivo:** determinar la *familia de estrategias* aplicables según consecuencias ambientales, tiempo y energía del impacto.

| Condición | Clasificación |
|------------|----------------|
- | Tiempo > 10 años y Δv < 1 km/s | **Desvío orbital viable** |
- | 5–10 años o Δv moderado | **Mitigación mixta (desvío + evacuación)** |
- | < 5 años o Δv alto | **Impacto inevitable → Preparación terrestre** |
- | Impacto atmosférico leve | **Monitoreo y comunicación pública** |

🔹 **Output:** `ScenarioType` = {“Desvío”, “Mixto”, “Terrestre”, “Monitoreo”}

---

## 🧩 4 — Generación de estrategias candidatas

**Objetivo:** listar estrategias posibles por *enfoque* y *nivel de viabilidad*.

### Categorías:
1. **Técnicas:** Impactador cinético, Tractor gravitacional, Explosión nuclear controlada, Ablación láser.  
2. **Políticas:** Consejo global, protocolo ONU, cooperación internacional, misión conjunta NASA–ESA–JAXA.  
3. **Sociales:** Educación pública, alerta temprana, simulacros, control de desinformación.  
4. **Económicas:** Protección de infraestructuras críticas, fondo internacional de resiliencia, diversificación de recursos.  
5. **Ambientales:** Evacuación, restauración post-impacto, mitigación de tsunamis.

**Ejemplo de plantilla JSON:**
```json
{
  "nombre": "Impactador cinético",
  "tipo": "técnica",
  "requisitos": { "tiempo_min": 3, "Δv_max": 1.5 },
  "criterios": { "eficacia": 0.9, "coste": 0.5, "riesgo": 0.6, "aceptacion": 0.7 }
}
```

---

## ⚖️ 5 — Evaluación y priorización (MCDA)

**Método:** análisis multicriterio (MCDA) — por ejemplo **TOPSIS** o **AHP**.  
Cada estrategia se evalúa según criterios ponderados y ajustados al tipo de catástrofe detectada.

| Criterio | Descripción | Peso base | Ajuste por tipo de impacto |
|-----------|--------------|-----------|-----------------------------|
- | Eficacia | Capacidad de reducir el riesgo | 0.35 | +0.10 si impacto global |
- | Tiempo de implementación | Velocidad de ejecución | 0.25 | +0.10 si tiempo < 5 años |
- | Riesgo operativo | Probabilidad de fallo | 0.15 | +0.10 si estrategia técnica |
- | Coste económico | Recursos requeridos | 0.10 | +0.05 si impacto local |
- | Aceptación social/política | Viabilidad pública y diplomática | 0.10 | +0.10 si estrategia política |
- | Impacto ambiental | Efectos ecológicos | 0.05 | +0.15 si impacto oceánico o global |

🔹 **Output:** `StrategyRanking` = lista ordenada con puntuación total.

---

## 🧮 6 — Optimización temporal y de recursos

**Objetivo:** encontrar la **combinación óptima** de estrategias simultáneas.

**Restricciones:**
- Presupuesto total ≤ `budget_max`
- Tiempo hasta impacto ≥ `t_min_ejecución`
- Recursos disponibles (`cohetes`, `infraestructura`, `equipos humanos`)

**Solver recomendado:** OR-Tools o PuLP  
🔹 **Output:** `MitigationPlan` = conjunto óptimo de estrategias ejecutables + cronograma.

---

## 📊 7 — Validación y robustez (Monte Carlo)

**Objetivo:** probar la estabilidad del plan ante incertidumbres.  
- Variar aleatoriamente parámetros del impacto (diámetro, densidad, ángulo, distribución del daño).  
- Recalcular resultados N veces (e.g., N = 1000).  
- Evaluar cuántas veces una estrategia es “top 1”.

🔹 **Output:** `RobustnessScore` ∈ [0, 1]

---

## 🧾 8 — Generación de salida explicativa

**Outputs finales:**
- `TopStrategy`: estrategia principal recomendada.  
- `StrategySet`: ranking completo con puntuaciones.  
- `Timeline`: cronograma detallado de ejecución.  
- `Narrative`: explicación textual generada automáticamente (IA opcional).

**Ejemplo:**
```json
{
  "escenario": "Mitigación mixta",
  "estrategia_recomendada": "Impactador cinético + alerta pública internacional",
  "justificación": "Tiempo suficiente (7 años) y energía manejable. La combinación reduce el riesgo global en un 73%.",
  "robustez": 0.84,
  "plan": {
    "2025-2028": "Desarrollo y lanzamiento de misión cinética",
    "2028-2032": "Monitoreo, campañas educativas y protocolos de evacuación"
  }
}
```

---

## 🔌 Integración con la plataforma

**Inputs:** `AsteroidState`, `ImpactReport`, `CatastropheAnalysis` (de Fase 2)  
**Outputs:** `StrategySet`, `MitigationPlan`, `Narrative`

**Usos:**
- Visualización en UI (ranking y cronograma)
- Chatbot educativo (resúmenes automáticos)
- Exportación de informes PDF/JSON
- Retroalimentación al módulo de simulación (ajuste dinámico de impactos)

---

## 🔍 Diagrama del pipeline

```
┌───────────────────────────────┐
│ Datos del asteroide + impacto │
│ (NASA / USGS / Fase 2)        │
└──────────────┬────────────────┘
               ↓
┌───────────────────────────────┐
│ Análisis de consecuencias     │
│ meteorológicas y ambientales  │
└──────────────┬────────────────┘
               ↓
┌───────────────────────────────┐
│ Clasificación del escenario   │
│ (según consecuencias + Δv + t)│
└──────────────┬────────────────┘
               ↓
┌───────────────────────────────┐
│ Generador de estrategias      │
│ (Técnicas / Sociales / etc.)  │
└──────────────┬────────────────┘
               ↓
┌───────────────────────────────┐
│ Evaluación multicriterio      │
│ (MCDA / TOPSIS / AHP)         │
└──────────────┬────────────────┘
               ↓
┌───────────────────────────────┐
│ Optimización y robustez       │
│ (OR-Tools + Monte Carlo)      │
└──────────────┬────────────────┘
               ↓
┌───────────────────────────────┐
│ Estrategia final + Plan +     │
│ Narrativa explicativa         │
└───────────────────────────────┘
```

---

## 🧮 Pseudocódigo resumido del módulo

```python
def motor_mitigacion(asteroid_state, impact_report, constraints):
    consecuencias = analizar_consecuencias(impact_report)
    escenario = clasificar_escenario(asteroid_state, consecuencias)
    estrategias = generar_estrategias(escenario, consecuencias)
    ranking = evaluar_MCDA(estrategias, consecuencias)
    plan_optimo = optimizar(ranking, constraints)
    robustez = monte_carlo(plan_optimo)
    salida = generar_salida(escenario, plan_optimo, robustez, consecuencias)
    return salida
```

---

## 💡 Valor añadido

- Integra de forma directa la **evaluación de catástrofes meteorológicas y medioambientales** (fase 2).  
- Clasificación de escenarios basada en consecuencias reales y no solo en parámetros orbitales.  
- Modelo **explicable, híbrido y científico**, sin depender únicamente de IA entrenada.  
- Genera resultados **interpretables y reproducibles**.  
- Escalable a diferentes escenarios y regiones del mundo.  
- Listo para integrar módulos de IA generativa en fases futuras (explicación, redacción, comunicación).

---

© 2025 — NASA Space Apps Challenge  
**Proyecto:** *Meteor Madness*  
**Equipo:** *(nombre del equipo aquí)*
