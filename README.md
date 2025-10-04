# WebGL Demo - Triángulo Rotatorio

Un proyecto simple de WebGL que muestra un triángulo de colores rotando.

## Características

- ✨ Triángulo rotatorio con colores RGB
- 🎨 Shaders personalizados (vertex y fragment)
- 📐 Matemáticas de matrices 4x4 implementadas desde cero
- 🚀 Sin dependencias externas (WebGL puro)

## Cómo ejecutar

### Opción 1: Servidor HTTP simple con Python

```bash
python3 -m http.server 8000
```

Luego abre tu navegador en: http://localhost:8000

### Opción 2: Servidor HTTP simple con Node.js

Primero instala http-server:

```bash
npm install -g http-server
```

Luego ejecuta:

```bash
http-server
```

### Opción 3: Abrir directamente

Si tu navegador lo permite, simplemente abre `index.html` directamente en el navegador.

## Estructura del proyecto

```
.
├── index.html    # Página principal con el canvas
├── main.js       # Código WebGL y lógica de renderizado
├── package.json  # Configuración del proyecto npm
└── README.md     # Este archivo
```

## Tecnologías

- HTML5
- JavaScript (ES6+)
- WebGL

## Notas

Este proyecto usa WebGL puro sin librerías externas. Incluye una implementación básica de operaciones de matrices 4x4 para las transformaciones 3D.
