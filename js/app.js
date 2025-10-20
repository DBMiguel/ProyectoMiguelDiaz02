/* 
   SIMULADOR INTERACTIVO DE PRÉSTAMOS - Proyecto Final
   Autor: Miguel Díaz
   Descripción: Simulador que calcula préstamos y los guarda
   usando localStorage, con una imagen de Pokémon.
    */

/* ===== VARIABLES GLOBALES ===== */

const app = document.getElementById('app');
const STORAGE_KEY = 'prestamos_simulados_v1';
let tasasData = null;
let prestamos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];



/* ===== FUNCIONES DE CARGA DE DATOS ===== */

/* Carga los datos de tasas desde un archivo local JSON */
async function fetchTasas() {
  const res = await fetch('data/tasas.json');
  if (!res.ok) throw new Error('No se pudo cargar tasas.json');
  return await res.json();
}

/* Obtiene solo el nombre de un Pokémon con su foto */
async function fetchPokemonMini(id) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      name: data.name,
      sprite: data.sprites.front_default || ''
    };
  } catch {
    return null;
  }
}


/* Datos de calculos para mi simulador de presramo  */

/* Calcula el total del préstamo con interés simple */
function calcularTotal(capital, plazoMeses, tasaAnual) {
  const interes = capital * (tasaAnual / 100) * (plazoMeses / 12);
  return Number(capital + interes).toFixed(2);
}

/* Aqui se guarda el arreglo de préstamos en localStorage */
function guardarLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prestamos));
}


/* CREACIÓN DE INTERFAZ (DOM)  */

  /* Crea el encabezado de la página */
function createHeader() {
  const header = document.createElement('div');
  header.className = 'header';
  header.innerHTML = `
    <div>
      <h1>Simulador Interactivo - Proyecto Final</h1>
    </div>
    <div>
      <button id="btnCargarDemo" class="ghost">Cargar demo</button>
      <button id="btnBorrarTodos" class="danger">Borrar todos</button>
    </div>
  `;
  return header;
}

/* Crea el formulario principal del simulador del credito*/
function createForm() {
  const formWrap = document.createElement('section');

  /* Datos de los planes de tasas */
  const options = tasasData.planes.map(plan => {
    return `<option value="${plan.id}">${plan.nombre} — ${plan.tasa}%</option>`;
  }).join('');

        /*  Estructura del formulario en codigo de HTML*/
      formWrap.innerHTML = `
    <form id="formPrestamo" aria-label="formulario de simulador">
      <div class="form-grid">
        <div>
          <label for="nombre">Nombre</label>
          <input id="nombre" required />
        </div>
        <div>
          <label for="capital">Monto ($)</label>
          <input id="capital" type="number" min="1" required />
        </div>
        <div>
          <label for="plazo">Plazo (meses)</label>
          <input id="plazo" type="number" min="1" required />
        </div>
        <div>
          <label for="plan">Plan / Tasa</label>
          <select id="plan">${options}</select>
        </div>
      </div>

      <div class="actions">
        <button type="submit">Calcular y Guardar</button>
        <button type="button" id="btnCalcular" class="ghost">Solo calcular</button>
      </div>
    </form>

    <div id="resultado" class="result" aria-live="polite"></div>
    <h2>Préstamos guardados</h2>
    <ul id="listaPrestamos" class="lista"></ul>
  `;
  return formWrap;
}

/* Crea mi Footer es decir el pie de página */
function createFooter() {
  const f = document.createElement('div');
  f.className = 'footer';
  f.innerHTML = `© ${new Date().getFullYear()} Simulador - Proyecto Final Miguel Díaz`;
  return f;
}

/* Mis datos visuales para el header, los form, y el footer */
function renderUI() {
  app.innerHTML = '';
  app.appendChild(createHeader());
  app.appendChild(createForm());
  app.appendChild(createFooter());

  setEventListeners();
  renderLista();
}


/* LIsta para guardar los préstamos simulados */

function renderLista() {
  const lista = document.getElementById('listaPrestamos');
  if (!lista) return;

  lista.innerHTML = '';

  /* SI en caso no hay préstamos, se muestra un mensaje simple */
  if (prestamos.length === 0) {
    lista.innerHTML = `<li class="small">No hay préstamos guardados.</li>`;
    return;
  }

  /* Muestra loos préstamos */
  prestamos.forEach(async (p, i) => {
    const li = document.createElement('li');

    /* MUestra la imagen del Pokémon)*/ 
    const thumb = document.createElement('div');
    thumb.className = 'pokemon-thumb';
    thumb.textContent = '...';

    /* Datos principales del préstamo */
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerHTML = `
      <strong>${p.nombre}</strong>
      <div class="small">
        Total: $${p.total} • ${p.plazo} meses • ${p.planNombre}
      </div>
    `;

     /* Botones de acción: Ver y Eliminar */
    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '.4rem';

    const verBtn = document.createElement('button');
    verBtn.className = 'ghost';
    verBtn.textContent = 'Datos del Crédito';
    verBtn.addEventListener('click', () => mostrarDetalle(p));

    const borrarBtn = document.createElement('button');
    borrarBtn.className = 'danger';
    borrarBtn.textContent = 'Eliminar';
    borrarBtn.addEventListener('click', () => confirmarEliminar(i));

    actions.appendChild(verBtn);
    actions.appendChild(borrarBtn);

    li.appendChild(thumb);
    li.appendChild(meta);
    li.appendChild(actions);
    lista.appendChild(li);

    /* Parte del codigo que permite cargar la imagen del pokemon */
    if (p.pokemonId) {
      const poke = await fetchPokemonMini(p.pokemonId);
      if (poke && poke.sprite) {
        thumb.innerHTML = `<img src="${poke.sprite}" alt="${poke.name}" width="48" height="48">`;
      } else {
        thumb.textContent = 'N/A';
      }
    } else {
      thumb.textContent = '—';
    }
  });
}


/* Interacciones del codigo */

function setEventListeners() {
  const form = document.getElementById('formPrestamo');
  const btnCalcular = document.getElementById('btnCalcular');
  const btnDemo = document.getElementById('btnCargarDemo');
  const btnBorrarTodos = document.getElementById('btnBorrarTodos');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await procesarGuardar(true);
  });

  /*  Botón "Solo calcular" (sin guardar) */
  btnCalcular.addEventListener('click', async () => {
    await procesarGuardar(false);
  });

  /*  Botón "Cargar demo" — rellena con datos por defecto */
  btnDemo.addEventListener('click', () => {
    const def = tasasData.simuladorDefault;
    document.getElementById('nombre').value = 'Ejemplo Usuario';
    document.getElementById('capital').value = def.capital;
    document.getElementById('plazo').value = def.plazo;
    document.getElementById('plan').value = def.planId;
    Swal.fire({ icon: 'success', text: 'Datos de demo cargados correctamente' });
  });

  /* Botón "Borrar todos" — limpia la lista completa */
  btnBorrarTodos.addEventListener('click', async () => {
    const confirm = await Swal.fire({
      title: '¿Borrar todos los préstamos?',
      text: 'Esta acción eliminará toda la lista guardada.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      prestamos = [];
      guardarLocal();
      renderLista();
      document.getElementById('resultado').innerHTML = '';
      Swal.fire({ icon: 'success', text: 'Todos los préstamos fueron eliminados' });
    }
  });
}


/* Actividades principales del codigo */

async function procesarGuardar(guardar = true) {
  /* Obtiene los valores del formulario */
  const nombre = document.getElementById('nombre').value.trim();
  const capital = Number(document.getElementById('capital').value);
  const plazo = Number(document.getElementById('plazo').value);
  const planId = document.getElementById('plan').value;

  
  if (!nombre || !capital || !plazo) {
    await Swal.fire({ icon: 'error', text: 'Por favor completa todos los campos.' });
    return;
  }

  /* Se selecciona el plan o la tasa */
  const plan = tasasData.planes.find(p => p.id === planId);
  const tasa = plan ? plan.tasa : 0;
  const total = calcularTotal(capital, plazo, tasa);

  /* Aqui para tener un dato aleatorio de un pokemon, pense en un numero aleatorio de 0 y 1, dicho resultado que se pueda multiplizar por 150  y con math.floor me pueda quitar los numeros decimales para tener un numero entre 1 al 150) */
  const pokemonId = Math.floor(Math.random() * 150) ;
  const pokemon = await fetchPokemonMini(pokemonId);

  /* Aqui se guarda digamos en un paquete o la linea donde se van guardar cada credito simulado */
  const prestamo = {
    id: Date.now(),
    nombre,
    capital,
    plazo,
    planId,
    planNombre: plan ? plan.nombre : 'Sin plan',
    tasa,
    total,
    pokemonId,
    pokemonName: pokemon ? pokemon.name : null
  };

  mostrarResultado(prestamo);

 /* Codigo para guardar el credito simulado solo si dio click en guardar */
  if (guardar) {
    prestamos.push(prestamo);
    guardarLocal();
    renderLista();
    await Swal.fire({ icon: 'success', text: 'Préstamo guardado con éxito' });
    document.getElementById('formPrestamo').reset();
  } else {
    
          await Swal.fire({ icon: 'info', html: `<strong>Total estimado:</strong> $${total}` });
         }
}


/*  Resultados finales */

/* Muestra el resultado del préstamo recién calculado */
function mostrarResultado(prestamo) {
  const cont = document.getElementById('resultado');
  cont.innerHTML = `
    <h3>Resultado</h3>
    <p><strong>${prestamo.nombre}</strong>, total aproximado: 
    <strong>$${prestamo.total}</strong> en <strong>${prestamo.plazo}</strong> meses 
    (tasa ${prestamo.tasa}% — ${prestamo.planNombre}).</p>
    ${prestamo.pokemonName ? `<p class="small">Tu "mascota financiera" es: <strong>${prestamo.pokemonName}</strong></p>` : ''}
  `;
}

/* En la ventana emergente de la libreria SweetAlert mostrará la informacio del crédito simulado con los datos capturados*/
async function mostrarDetalle(p) {
  const poke = p.pokemonId ? await fetchPokemonMini(p.pokemonId) : null;
  const html = `
    <p><strong>${p.nombre}</strong></p>
    <p class="small">
      Capital: $${p.capital} • Plazo: ${p.plazo} meses <br>
      Plan: ${p.planNombre} • Tasa: ${p.tasa}% <br>
      Total aprox: $${p.total}
    </p>
    ${poke ? `<img src="${poke.sprite}" alt="${poke.name}" width="120">` : ''}
  `;
  Swal.fire({
    title: 'Detalle del préstamo',
    html,
    showCloseButton: true
  });
}


/* Codigo de l boton para eliminar el prestamo */

async function confirmarEliminar(idx) {
  const r = await Swal.fire({
    title: 'Eliminar préstamo',
    text: '¿Deseas eliminar este préstamo?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar'
  });

  if (r.isConfirmed) {
    prestamos.splice(idx, 1);
    guardarLocal();
    renderLista();
    Swal.fire({ icon: 'success', text: 'Préstamo eliminado correctamente' });
  }
}


/*  Función principal: carga tasas, construye la interfaz de los datos capturados */
async function init() {
  try {
    tasasData = await fetchTasas();
  } catch (err) {
    await Swal.fire({ icon: 'error', text: 'Error cargando datos: ' + err.message });
    tasasData = { planes: [], simuladorDefault: {} };
  }

  renderUI(); 
}

/* Ejecuta la app al cargar y los datos almacenados en data/tasas.json */
init();
