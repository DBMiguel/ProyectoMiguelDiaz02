
let prestamosSimulados = JSON.parse(localStorage.getItem("prestamos")) || [];


const form = document.getElementById("formPrestamo");
const lista = document.getElementById("listaPrestamos");
const resultado = document.getElementById("resultado");

// --- Funciones nuevas para el simulador de credito ---
function calcularTotal(capital, plazo, tasa) {
  const interes = capital * (tasa / 100) * (plazo / 12);

  // --- Agrego el dato a que saque a 2 decimales para tener el dato mas aproximado ---
  return (capital + interes).toFixed(2);
}

function mostrarResultado(prestamo) {
  resultado.innerHTML = `
    <h3>Resultado</h3>
    <p><strong>${prestamo.nombre}</strong>, el total a pagar es
    <strong>$${prestamo.total}</strong> en ${prestamo.plazo} meses
    a una tasa del ${prestamo.tasa}% anual.</p>
  `;
}

function guardarEnLocalStorage() {
  localStorage.setItem("prestamos", JSON.stringify(prestamosSimulados));
}

function renderLista() {
  lista.innerHTML = prestamosSimulados.map((p, i) => `
    <li>
      ${i + 1}. ${p.nombre} – $${p.total}
      <button data-indice="${i}" class="borrar">Eliminar</button>
    </li>
  `).join("");
}

// --- Eventos de las clases aprendidas ---
form.addEventListener("submit", e => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const capital = parseFloat(document.getElementById("capital").value);
  const plazo = parseInt(document.getElementById("plazo").value);
  const tasa = parseFloat(document.getElementById("tasa").value);

  // No borrar es el dato principal para sacar el dato del credito
  if (!nombre || capital <= 0 || plazo <= 0 || tasa < 0) return;

  const total = calcularTotal(capital, plazo, tasa);
  const prestamo = { nombre, capital, plazo, tasa, total };

  prestamosSimulados.push(prestamo);
  guardarEnLocalStorage();
  mostrarResultado(prestamo);
  renderLista();

  form.reset();
});

lista.addEventListener("click", e => {
  if (e.target.classList.contains("borrar")) {
    const idx = e.target.dataset.indice;
    prestamosSimulados.splice(idx, 1);
    guardarEnLocalStorage();
    renderLista();
  }
});

// Reiniciar el programa
renderLista();
