# Simulador Interactivo - Proyecto Final

Aplicación web que permite simular préstamos, calcular el total con interés simple, guardar simulaciones en `localStorage` y mostrar una "mascota financiera" (Imagen de Pokémon) para cada simulación.

## Estructura del proyecto

- 🌐[Index.html](index.html)
- 🟨[Script.js](script.js)
- 📋[Estructura.txt](Estructura.txt)
- 📁 css/   - [style.css](css/style.css)
- 📁data/   - [tasas.json](data/tasas.json)
- 📁js/     - [app.js](js/app.js)



## Funcionalidad principal
- Cargar tasas y configuración por defecto desde [data/tasas.json](data/tasas.json).
- Interfaz dinámica construida en [js/app.js](js/app.js).
- Calcular total del préstamo con interés simple usando la función [`js/app.js.calcularTotal`](js/app.js).
- Guardar y recuperar préstamos desde `localStorage` mediante [`js/app.js.guardarLocal`](js/app.js) y la constante `STORAGE_KEY` en [`js/app.js`](js/app.js).
- Mostrar lista de préstamos, detalle y eliminar funciones: 
  ([`js/app.js.renderLista`]
  (js/app.js), [`js/app.js.mostrarDetalle`]
  (js/app.js), [`js/app.js.confirmarEliminar`]
  (js/app.js)).
- Obtener mini datos de Pokémon desde la API externa con [`js/app.js.fetchPokemonMini`](js/app.js).
- Manejo del flujo y eventos UI en [`js/app.js.setEventListeners`](js/app.js) y [`js/app.js.procesarGuardar`](js/app.js).
- Inicialización y carga de tasas en [`js/app.js.init`](js/app.js).

## Arquitectura y diseño
- HTML minimalista: [index.html](index.html) carga el módulo principal `js/app.js`.
- CSS modular en [css/style.css](css/style.css) para estilos de layout, lista y formulario.
- Lógica JS contenida en [js/app.js](js/app.js):
  - Separación clara: funciones de carga de datos, cálculo, persistencia y renderizado.
  - Uso de `async/await` para llamadas fetch (archivo local y API externa).
  - Uso de SweetAlert2 (CDN en [index.html](index.html)) para diálogos y notificaciones.
- Datos de configuración (planes y simulador por defecto) en [data/tasas.json](data/tasas.json).

## Archivos y símbolos importantes (referencias)
- [index.html](index.html)
- [css/style.css](css/style.css)
- [data/tasas.json](data/tasas.json)
- [js/app.js](js/app.js) — funciones clave:
  - [`js/app.js.fetchTasas`](js/app.js)
  - [`js/app.js.fetchPokemonMini`](js/app.js)
  - [`js/app.js.calcularTotal`](js/app.js)
  - [`js/app.js.guardarLocal`](js/app.js)
  - [`js/app.js.createHeader`](js/app.js)
  - [`js/app.js.createForm`](js/app.js)
  - [`js/app.js.createFooter`](js/app.js)
  - [`js/app.js.renderUI`](js/app.js)
  - [`js/app.js.renderLista`](js/app.js)
  - [`js/app.js.setEventListeners`](js/app.js)
  - [`js/app.js.procesarGuardar`](js/app.js)
  - [`js/app.js.mostrarResultado`](js/app.js)
  - [`js/app.js.mostrarDetalle`](js/app.js)
  - [`js/app.js.confirmarEliminar`](js/app.js)
  - [`js/app.js.init`](js/app.js)
- [script.js](script.js) — script demo independiente (prompt/alert).
