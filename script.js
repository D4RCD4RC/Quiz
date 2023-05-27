/*
Juego de preguntas y
respuestas
Juego de preguntas y respuestas sobre películas
Descripción
● Se proporciona un JSON que contiene un array de 50 objetos que
representan preguntas sobre películas que contiene la pregunta,
una lista de respuestas y la respuesta correcta.
● La aplicación debe leer este JSON y procesar las preguntas y
posteriormente mostrar en la pantalla la primera pregunta junto a
la lista de respuestas con un botón para seleccionar una. Para ello
debe usar los métodos de DOM y gestión de eventos.
● Si la respuesta es correcta debe aumentar un contador de aciertos y
avanzar a la siguiente pregunta. Si es incorrecta simplemente
avanzar.
● Al finalizar las preguntas debe mostrar la puntuación final.

sin 'use strict'; porque varias variables no estan definidas ni como constante ni como let

json
https://gist.github.com/bertez/2528edb2ab7857dae29c39d1fb669d31


*/

let preguntas_aleatorias = true;
let mostrar_pantalla_juego_términado = true;
let reiniciar_puntos_al_reiniciar_el_juego = true;

window.onload = function () {
  base_preguntas = readText('./quiz.json');
  interprete_bp = JSON.parse(base_preguntas);
  escogerPreguntaAleatoria();
};

let pregunta;
let posibles_respuestas;
btn_correspondiente = [
  select_id('btn1'),
  select_id('btn2'),
  select_id('btn3'),
  select_id('btn4'),
];
let npreguntas = [];

let preguntas_hechas = 0;
let preguntas_correctas = 0;

const escogerPreguntaAleatoria = () => {
  let n;
  if (preguntas_aleatorias) {
    n = Math.floor(Math.random() * interprete_bp.length);
  } else {
    n = 0;
  }

  while (npreguntas.includes(n)) {
    n++;
    if (n >= interprete_bp.length) {
      n = 0;
    }
    if (npreguntas.length == interprete_bp.length) {
      if (mostrar_pantalla_juego_términado) {
        swal.fire({
          title: 'Juego finalizado',
          text:
            'Puntuación: ' + preguntas_correctas + '/' + (preguntas_hechas - 1),
          icon: 'success',
        });
      }
      if (reiniciar_puntos_al_reiniciar_el_juego) {
        preguntas_correctas = 0;
        preguntas_hechas = 0;
      }
      npreguntas = [];
    }
  }
  npreguntas.push(n);
  preguntas_hechas++;

  escogerPregunta(n);
};

const escogerPregunta = (n) => {
  pregunta = interprete_bp[n];
  select_id('categoria').innerHTML = pregunta.answer;
  select_id('pregunta').innerHTML = pregunta.question;
  select_id('numero').innerHTML = n;
  let pc = preguntas_correctas;
  if (preguntas_hechas > 1) {
    select_id('puntaje').innerHTML = pc + '/' + (preguntas_hechas - 1);
  } else {
    select_id('puntaje').innerHTML = '';
  }
  desordenarRespuestas(pregunta);
};
const desordenarRespuestas = (pregunta) => {
  posibles_respuestas = [
    pregunta.answers[0],
    pregunta.answers[1],
    pregunta.answers[2],
    pregunta.answers[3],
    pregunta.correct,
  ];

  select_id('btn1').innerHTML = posibles_respuestas[0];
  select_id('btn2').innerHTML = posibles_respuestas[1];
  select_id('btn3').innerHTML = posibles_respuestas[2];
  select_id('btn4').innerHTML = posibles_respuestas[3];
  select_id('categoria').innerHTML = posibles_respuestas[4];
};

let suspender_botones = false;

const oprimir_btn = (i) => {
  if (suspender_botones) {
    return;
  }
  suspender_botones = true;
  if (posibles_respuestas[i] === posibles_respuestas[4]) {
    preguntas_correctas++;
    btn_correspondiente[i].style.background = 'rgb(0,250,154)';
  } else {
    btn_correspondiente[i].style.background = 'rgb(235, 38, 81)';
  }
  for (let j = 0; j < 4; j++) {
    if (posibles_respuestas[j] == posibles_respuestas[4]) {
      btn_correspondiente[j].style.background = 'rgb(0,250,154)';
      break;
    }
  }
  setTimeout(() => {
    reiniciar();
    suspender_botones = false;
  }, 3000);
};

const reiniciar = () => {
  for (const btn of btn_correspondiente) {
    btn.style.background = 'white';
  }
  escogerPreguntaAleatoria();
};

function select_id(id) {
  return document.getElementById(id);
}

function style(id) {
  return select_id(id).style;
}

const readText = (ruta_local) => {
  var texto = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', ruta_local, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    texto = xmlhttp.responseText;
  }
  return texto;
};
