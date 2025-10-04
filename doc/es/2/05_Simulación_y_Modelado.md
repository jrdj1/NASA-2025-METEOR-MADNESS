# 05 – Simulación y Modelado

## 1. Descripción General

El **motor de simulación y modelado** de *Meteor Madness* constituye el núcleo científico de la plataforma.  
Combina principios simplificados de **mecánica orbital**, **física de impactos** y **modelado geofísico** para simular trayectorias de asteroides, estimar la energía de impacto y visualizar efectos secundarios como la propagación sísmica y la generación de tsunamis.

El objetivo no es realizar cálculos astrofísicos de alta fidelidad, sino ofrecer una simulación **científicamente fundamentada, computacionalmente eficiente** y **didácticamente útil**, adecuada para su ejecución en tiempo real dentro de un entorno web.

---

## 2. Marco de Modelado

El proceso de simulación integra tres dominios científicos principales:

| Dominio | Propósito | Parámetros Ejemplo |
|----------|------------|--------------------|
| **Mecánica Orbital** | Calcular el movimiento del asteroide y su trayectoria de aproximación a la Tierra. | Semieje mayor, excentricidad, inclinación, anomalía verdadera |
| **Física del Impacto** | Calcular la energía liberada, el tamaño del cráter y la propagación de ondas de choque. | Masa, velocidad, densidad, ángulo de impacto |
| **Efectos Ambientales** | Estimar respuestas sísmicas e hidrodinámicas. | Aceleración del suelo, profundidad del agua, elevación costera |

Estos dominios se modelan secuencialmente para generar resultados coherentes que alimentan el sistema de visualización.

---

## 3. Modelo de Mecánica Orbital

### 3.1 Parámetros de Entrada
Desde la **API NEO de NASA** se obtienen los siguientes elementos orbitales:
- Semieje mayor (*a*)  
- Excentricidad (*e*)  
- Inclinación (*i*)  
- Argumento del periapsis (*ω*)  
- Longitud del nodo ascendente (*Ω*)  
- Anomalía verdadera (*ν*)

### 3.2 Ecuaciones Utilizadas
La posición del asteroide respecto a la Tierra se calcula mediante las ecuaciones clásicas keplerianas:

\[
r = \frac{a(1 - e^2)}{1 + e \cos(ν)}
\]

La velocidad se aproxima como:

\[
v = \sqrt{μ \left(\frac{2}{r} - \frac{1}{a}\right)}
\]
donde \( μ = GM_{☉} \) es el parámetro gravitacional estándar del Sol.

La posición tridimensional se obtiene rotando el plano orbital mediante los valores de inclinación, nodo y argumento del periapsis.

### 3.3 Simplificaciones
- El modelo asume un **sistema de dos cuerpos (Sol–asteroide)**, ignorando perturbaciones planetarias.  
- La posición de la Tierra se considera fija durante intervalos cortos (<10 días).  
- Los efectos de fricción atmosférica se modelan en la etapa de impacto.

---

## 4. Energía de Impacto y Modelado de Cráteres

### 4.1 Estimación de Energía Cinética
La energía total liberada se calcula mediante:

\[
E = \frac{1}{2} m v^2
\]
donde:
- \( m = \frac{4}{3} \pi r^3 ρ \) (asteroide esférico)  
- \( ρ = 3000 kg/m³ \) (densidad promedio)  
- \( v \) = velocidad de impacto (km/s → m/s)

Conversión a **equivalente TNT**:
\[
E_{TNT} = \frac{E}{4.184×10^{15}}
\]

### 4.2 Escalado del Cráter
El diámetro del cráter se estima mediante la relación empírica Holsapple–Schmidt:

\[
D = k \left( \frac{E}{ρ_t g} \right)^{1/4}
\]
donde:
- \( k = 1.8 \) para superficies rocosas  
- \( ρ_t = 2500 kg/m³ \) (densidad del terreno)  
- \( g = 9.81 m/s² \)

### 4.3 Efectos Secundarios
- **Ondas Sísmicas:** magnitud estimada \( M_s = 0.67 \log(E) - 3.2 \)  
- **Altura del Tsunami:** \( H = α (E / d^2)^{1/3} \), donde *d* es la distancia y *α* un factor de ajuste.  
- **Onda de Choque Atmosférica:** modelo exponencial simple con decaimiento radial.

---

## 5. Flujo de Simulación

| Etapa | Descripción | Resultado |
|--------|--------------|------------|
| **1. Entrada** | Recuperación y validación de datos del NEO (tamaño, velocidad, trayectoria). | Conjunto normalizado |
| **2. Trayectoria** | Cálculo de aproximación orbital mediante parámetros keplerianos. | Posición y velocidad relativas |
| **3. Impacto** | Estimación de energía cinética y tamaño del cráter. | Energía, diámetro, magnitud sísmica |
| **4. Efectos Ambientales** | Aplicación de modelos simplificados para propagación sísmica y tsunamis. | Resultados geoespaciales |
| **5. Exportación** | Envío de datos estructurados (JSON) a la capa de visualización. | Datos listos para renderizado |

---

## 6. Herramientas y Librerías

- **Python:** NumPy, SciPy, Pandas – cálculos numéricos y físicos.  
- **Astropy:** para constantes astronómicas y mecánica orbital.  
- **Matplotlib / Plotly:** validación visual de resultados.  
- **Flask/Django:** exposición de resultados vía API.  

---

## 7. Limitaciones y Suposiciones

- Modelo orbital simplificado de dos cuerpos (sin perturbaciones).  
- Densidad promedio constante del asteroide (3000 kg/m³).  
- Tierra tratada como esfera estática.  
- No se modela la entrada atmosférica detallada.  
- Modelos de tsunami y sismo calibrados para fines educativos, no predictivos.

---

## 8. Resumen

El marco de simulación de **Meteor Madness** equilibra **realismo científico** y **eficiencia computacional**.  
Al simplificar dinámicas orbitales e impactos manteniendo coherencia física, permite una visualización interactiva, educativa y científicamente fiable de los escenarios de impacto de asteroides.
