// Pedimos un texto inicial
let palabra = prompt("Escribe una palabra (o ESC para salir):");

// Mientras no se escriba "ESC", repetimos el ciclo
while (palabra !== "ESC") {
    console.log("Tú escribiste: " + palabra);
    alert("Tú escribiste: " + palabra);

    // Pedimos otra palabra para la siguiente repetición
    palabra = prompt("Escribe otra palabra (o ESC para salir):");
}

console.log("Programa terminado");
alert("Programa terminado");
