// ================================
// Variables globales
// ================================
let preguntas = [];           // Array con todas las preguntas del JSON
let preguntaActual = null;    // Pregunta mostrada actualmente
let botonesRespuesta = [];    // Array con los botones
let preguntasHechas = 0;
let preguntasCorrectas = 0;
let preguntasMostradas = [];  // Índices ya mostrados
let respuestasDesordenadas = []; // Array de respuestas para mostrar
let fallos = 0;               // Contador de fallos
const MAX_FALLOS = 5;

// ================================
// Inicialización
// ================================
window.addEventListener("DOMContentLoaded", async () => {
  // Cargar JSON
  const res = await fetch("./quiz.json");
  preguntas = await res.json();

  // Seleccionar botones
  botonesRespuesta = [
    document.getElementById("btn1"),
    document.getElementById("btn2"),
    document.getElementById("btn3"),
    document.getElementById("btn4")
  ];

  // Agregar eventos a botones
  botonesRespuesta.forEach((btn, idx) => {
    btn.addEventListener("click", () => responder(idx));
  });

  // Botón reiniciar
  document.getElementById("btnReiniciar").addEventListener("click", reiniciarJuego);

  // Mostrar primera pregunta
  mostrarPreguntaAleatoria();
});

// ================================
// Funciones principales
// ================================
function mostrarPreguntaAleatoria() {
  if (preguntasMostradas.length === preguntas.length) {
    Swal.fire({
      title: "Juego finalizado",
      text: `Puntuación: ${preguntasCorrectas}/${preguntasHechas}`,
      icon: "success"
    });
    return;
  }

  // Elegir pregunta aleatoria no repetida
  let idx;
  do {
    idx = Math.floor(Math.random() * preguntas.length);
  } while (preguntasMostradas.includes(idx));

  preguntasMostradas.push(idx);
  preguntasHechas++;
  preguntaActual = preguntas[idx];

  // Mostrar pregunta
  document.getElementById("pregunta").innerText = preguntaActual.question;
  document.getElementById("categoria").innerText = "";
  document.getElementById("numero").innerText = preguntasHechas;
  document.getElementById("puntaje").innerText = `${preguntasCorrectas}/${preguntasHechas - 1}`;

  // Mezclar respuestas
  respuestasDesordenadas = [...preguntaActual.answers];
  respuestasDesordenadas.push(preguntaActual.correct);
  respuestasDesordenadas.sort(() => Math.random() - 0.5);

  // Mostrar en botones
  botonesRespuesta.forEach((btn, i) => btn.innerText = respuestasDesordenadas[i]);
}

// ================================
// Responder una pregunta
// ================================
let bloquearBotones = false;

function responder(idx) {
  if (bloquearBotones) return;
  bloquearBotones = true;

  const correcto = respuestasDesordenadas[idx] === preguntaActual.correct;

  if (correcto) {
    botonesRespuesta[idx].style.background = "rgb(0,250,154)";
    preguntasCorrectas++;
  } else {
    botonesRespuesta[idx].style.background = "rgb(235,38,81)";
    fallos++;
  }

  // Mostrar la respuesta correcta
  const indexCorrecta = respuestasDesordenadas.indexOf(preguntaActual.correct);
  botonesRespuesta[indexCorrecta].style.background = "rgb(0,250,154)";
  document.getElementById("categoria").innerText = "Respuesta correcta: " + preguntaActual.correct;

  // Actualizar puntaje
  document.getElementById("puntaje").innerText = `${preguntasCorrectas}/${preguntasHechas}`;

  setTimeout(() => {
    reiniciarPregunta();
    bloquearBotones = false;

    // Reinicio automático después de 5 fallos
    if (fallos >= MAX_FALLOS) {
      Swal.fire({
        title: "¡Has fallado 5 veces!",
        text: "Vamos a reiniciar la ronda de preguntas",
        icon: "warning"
      }).then(() => {
        reiniciarJuego();
      });
    }
  }, 2000);
}

// ================================
// Reiniciar colores y mostrar siguiente pregunta
// ================================
function reiniciarPregunta() {
  botonesRespuesta.forEach(btn => btn.style.background = "#fff");
  mostrarPreguntaAleatoria();
}

// ================================
// Reiniciar juego completo
// ================================
function reiniciarJuego() {
  preguntasHechas = 0;
  preguntasCorrectas = 0;
  fallos = 0;
  preguntasMostradas = [];
  botonesRespuesta.forEach(btn => btn.style.background = "#fff");
  document.getElementById("categoria").innerText = "";
  document.getElementById("puntaje").innerText = "";
  mostrarPreguntaAleatoria();
}
