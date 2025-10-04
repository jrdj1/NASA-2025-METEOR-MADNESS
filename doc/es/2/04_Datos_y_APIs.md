# 04 – Datos y APIs

## 1. Descripción General

El proyecto **Meteor Madness** se basa en conjuntos de datos abiertos de alta calidad, provenientes de fuentes científicas y gubernamentales reconocidas.  
Su núcleo combina la **API NEO de la NASA** con los datos geológicos y ambientales del **Servicio Geológico de los Estados Unidos (USGS)**.  
En conjunto, estas fuentes proporcionan los **parámetros espaciales** necesarios para simular trayectorias de asteroides y los **parámetros terrestres** indispensables para estimar las consecuencias de un impacto.

El objetivo es construir un flujo de datos unificado y coherente que alimente las capas de simulación y visualización con información confiable y previamente procesada.

---

## 2. Fuentes de Datos

### 2.1 NASA – API Near-Earth Object (NEO)
**URL Base:** [https://api.nasa.gov/neo/rest/v1/](https://api.nasa.gov/neo/rest/v1/)  
**Propósito:** Proporciona información en tiempo real sobre asteroides y cometas que se aproximan a la Tierra.  
**Tipo:** API REST en formato JSON (requiere clave gratuita de acceso de la NASA).

**Endpoints Principales:**
| Endpoint | Descripción |
|-----------|--------------|
| `/feed` | Recupera los NEOs dentro de un rango de fechas (máximo 7 días). |
| `/neo/{id}` | Devuelve datos orbitales y físicos detallados de un asteroide específico. |
| `/neo/browse` | Lista objetos conocidos con parámetros generales (tamaño, tipo de órbita, nivel de riesgo). |

**Parámetros Clave:**
- `name` – Nombre o designación del asteroide.  
- `absolute_magnitude_h` – Magnitud de brillo, usada para estimar su tamaño.  
- `estimated_diameter_min/max` – En kilómetros.  
- `is_potentially_hazardous_asteroid` – Indicador booleano de riesgo.  
- `close_approach_data` – Conjunto de datos anidados que incluye velocidad relativa, distancia mínima y cuerpo orbitado.

**Ejemplo de Solicitud:**
```
GET https://api.nasa.gov/neo/rest/v1/feed?start_date=2025-10-01&end_date=2025-10-07&api_key=DEMO_KEY
```

**Ejemplo de Respuesta:**
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

### 2.2 USGS – Conjuntos Geológicos y Ambientales
**Portal Base:** [https://www.usgs.gov/](https://www.usgs.gov/)  
**Propósito:** Proporciona datos de observación terrestre utilizados para modelar los efectos ambientales de impactos de asteroides.

**Tipos de Datos Utilizados:**
| Conjunto | Formato | Descripción |
|-----------|----------|-------------|
| Datos Globales de Elevación | GeoTIFF / Raster | Identifica terreno y vulnerabilidad costera. |
| Mapas de Peligros Sísmicos | Shapefile / GeoJSON | Estima la propagación del movimiento del suelo. |
| Zonas de Riesgo de Tsunamis | GeoJSON / KML | Evalúa el riesgo de impacto costero. |

**Procesamiento:**
- Descargados y procesados mediante **GDAL**, **GeoPandas** y **Rasterio**.  
- Simplificados y remuestreados para optimizar rendimiento web.  
- Convertidos a **GeoJSON** para uso directo con **Leaflet** y **D3.js**.

---

### 2.3 Datos Complementarios (Opcionales)
| Fuente | Tipo | Propósito |
|---------|------|-----------|
| NASA Earth Observatory | Imágenes satelitales | Contextualización visual (nubes, terreno). |
| NOAA | Datos oceánicos y atmosféricos | Correlación con modelos de propagación de tsunamis. |
| OpenStreetMap | Geodatos vectoriales | Capas de referencia y superposiciones educativas. |

---

## 3. Flujo de Procesamiento de Datos

El sistema sigue un flujo de datos de cuatro etapas antes de la simulación:

| Etapa | Operación | Herramientas / Métodos |
|--------|------------|----------------|
| **1. Adquisición** | Obtención de datos brutos desde las APIs de NASA y USGS. | Python (Requests, GDAL, GeoPandas) |
| **2. Normalización** | Conversión de unidades, transformación de coordenadas (WGS84) y estandarización temporal. | Pandas, NumPy |
| **3. Filtrado** | Extracción de campos relevantes (tamaño, velocidad, coordenadas, fecha). | Scripts personalizados |
| **4. Preparación de Salida** | Almacenamiento de datos procesados en JSON/GeoJSON para la capa de simulación. | Backend Flask |

---

## 4. Validación y Control de Calidad

Para garantizar la fiabilidad y la precisión científica:
- Validación automática de campos clave (`velocity`, `diameter`, `distance`).  
- Verificación cruzada entre datos NASA y catálogos de impactos conocidos.  
- Registro y caché de respuestas API para reproducibilidad.  
- Revisión manual de datos geográficos (USGS) para coherencia de sistemas de coordenadas (CRS).  

---

## 5. Almacenamiento y Acceso a Datos

- Almacenamiento temporal en memoria para simulaciones pequeñas.  
- Caché local mediante **SQLite** o archivos **JSON** para ejecuciones sin conexión.  
- Futuras versiones integrarán **PostgreSQL/PostGIS** para gestión avanzada de datos espaciales.

---

## 6. Licencias y Uso

Todos los conjuntos de datos y APIs utilizados son de acceso público bajo políticas de datos abiertos:
- **Política de Datos Abiertos de NASA:** [https://data.nasa.gov/](https://data.nasa.gov/)  
- **Política de Datos Abiertos de USGS:** [https://www.usgs.gov/products/data-and-tools/data-management](https://www.usgs.gov/products/data-and-tools/data-management)  

Se mantendrá la atribución correspondiente conforme a los términos de cada fuente.

---

## 7. Resumen

El ecosistema de datos de **Meteor Madness** garantiza:
- Autenticidad científica mediante fuentes verificadas de NASA y USGS.  
- Preprocesamiento estandarizado para asegurar precisión y eficiencia.  
- Compatibilidad con fines de análisis científico y visualización pública.

Esta base de datos constituye un pilar sólido, transparente y escalable para el modelado de impactos planetarios.
