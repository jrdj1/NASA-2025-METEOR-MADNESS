# 02 – Concepto de Solución

## 1. Descripción General

Nuestra propuesta, desarrollada para el **NASA Space Apps Challenge 2025: Meteor Madness**, consiste en una **plataforma web interactiva de simulación y visualización**, diseñada para cerrar la brecha entre los datos científicos en bruto y la comprensión humana.  
La herramienta permite explorar, simular y visualizar escenarios de impacto de asteroides sobre la Tierra utilizando datos reales provenientes de la **API NEO de la NASA** y de los conjuntos de datos geológicos y ambientales del **USGS**.

La solución traduce parámetros científicos complejos —como trayectorias orbitales, energías de impacto y respuestas geológicas— en representaciones visuales claras, dinámicas y educativas. Está dirigida tanto a científicos como a docentes, responsables de políticas públicas y al público general, facilitando un punto de acceso accesible al conocimiento sobre defensa planetaria.

---

## 2. Idea Central

La idea principal del proyecto es la **integración de la mecánica celeste con el modelado de impactos terrestres** dentro de un entorno interactivo unificado.  
Actualmente, la mayoría de herramientas existentes:
- Se centran únicamente en el seguimiento orbital (por ejemplo, *NASA Eyes on Asteroids*), o  
- Ofrecen estimaciones simplificadas de impacto (como calculadoras de cráteres),  

pero no permiten **combinar factores orbitales, físicos y ambientales** en simulaciones interactivas y en tiempo real.

Nuestra herramienta propone un **ecosistema basado en datos**, donde los usuarios pueden:
- Seleccionar o importar información de asteroides desde la API de la NASA.  
- Ajustar parámetros como velocidad, tamaño o ángulo de impacto.  
- Simular el impacto resultante mediante modelos físicos simplificados.  
- Visualizar los efectos: formación de cráteres, propagación sísmica o generación de tsunamis.  
- Probar **estrategias de mitigación**, observando cómo los cambios de trayectoria afectan la probabilidad de impacto con la Tierra.

---

## 3. Objetivos

### 3.1 Objetivo General
Desarrollar una plataforma científicamente sólida y visualmente intuitiva que permita **modelar, simular y comprender los fenómenos de impacto de asteroides** y las estrategias de mitigación asociadas, de manera realista y accesible.

### 3.2 Objetivos Específicos
1. **Integración de Datos:** Combinar los conjuntos de datos de NASA y USGS en una estructura unificada y consultable.  
2. **Simulación Física:** Implementar algoritmos que calculen movimiento orbital, energía cinética, dimensiones del cráter y efectos ambientales.  
3. **Capa de Visualización:** Crear visualizaciones 2D y 3D interactivas para trayectorias orbitales, zonas de impacto y resultados de mitigación.  
4. **Interacción del Usuario:** Permitir la manipulación de parámetros (tamaño, velocidad, vector de desviación) mediante una interfaz intuitiva.  
5. **Soporte Educativo:** Incluir superposiciones explicativas, leyendas y *tooltips* que faciliten la interpretación de resultados científicos.

---

## 4. Enfoque Metodológico

El sistema sigue un enfoque **modular y centrado en los datos**, compuesto por tres capas principales:

| Capa | Descripción |
|------|--------------|
| **Capa de Datos** | Recopila y preprocesa la información proveniente de la API NEO de la NASA y de los conjuntos abiertos del USGS. Gestiona la normalización de coordenadas, conversión de unidades y mapeo geoespacial. |
| **Capa de Simulación** | Utiliza principios simplificados de mecánica orbital y física de impactos para modelar escenarios (energía liberada, escalado de cráteres, estimación de ondas sísmicas). |
| **Capa de Visualización** | Emplea tecnologías web como **Three.js**, **D3.js** y **Leaflet** para representar trayectorias 3D, áreas de impacto y mapas de calor dinámicos. |

Cada capa está desacoplada y se comunica mediante una API RESTful, garantizando flexibilidad y escalabilidad para futuras extensiones.

---

## 5. Innovación y Propuesta de Valor

La plataforma propuesta introduce múltiples innovaciones frente a herramientas existentes:

- **Integración en tiempo real de datos NASA y USGS.**  
- **Motor de simulación unificado**, que conecta dinámica orbital y modelado geofísico.  
- **Visualización interactiva y educativa**, comprensible incluso para no expertos.  
- **Diseño basado en escenarios**, que permite explorar condiciones hipotéticas (“¿qué pasaría si?”) y estrategias de desviación.  
- **Arquitectura modular y de código abierto**, pensada para ampliarse por comunidades científicas y educativas.

Al combinar rigor científico, tecnologías modernas de visualización y accesibilidad, esta solución busca hacer de la **defensa planetaria** un tema comprensible, atractivo y útil para todos.

---

## 6. Usuarios y Casos de Uso

| Tipo de Usuario | Caso de Uso Ejemplo |
|-----------------|---------------------|
| **Investigadores** | Evaluar energía cinética o efectos de cráteres usando parámetros reales de NEOs. |
| **Educadores** | Demostrar conceptos de defensa planetaria mediante simulaciones didácticas. |
| **Responsables Políticos** | Visualizar impactos regionales potenciales y evaluar estrategias de preparación. |
| **Público General** | Explorar trayectorias de asteroides y comprender cómo funcionan las estrategias de mitigación. |

---

## 7. Resultados Esperados

Al finalizar el hackathon, el proyecto busca entregar:
- Un **prototipo funcional** de la herramienta web de simulación.  
- Un **pipeline de integración de datos** entre fuentes de NASA y USGS.  
- Un **panel visual interactivo** que represente al menos un escenario completo de impacto (por ejemplo, “Impactor-2025”).  
- **Documentación técnica** con detalle de la arquitectura, algoritmos y uso de datasets.

Este concepto sienta las bases de una plataforma abierta y escalable, que puede ampliarse tras el hackathon para fines de investigación, educación o divulgación científica.

