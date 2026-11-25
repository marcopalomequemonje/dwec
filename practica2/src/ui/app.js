// app.js — Bloque B · ✍️ B4, B5 y B6. Conecta el modelo (el tablero) con la página: pinta, escucha y avisa.
// Usa tus piezas: crearTarjeta/pintarLista, leerFormulario/mostrarErrores y delegar.
// La estructura de la página (ids, data-*) está en index.html y NO se cambia: la usan los tests.
import { ErrorTablero } from "../modelo/errores.js";
import { delegar } from "./delegacion.js";
import { leerFormulario, mostrarErrores } from "./formulario.js";
import { pintarLista } from "./tarjeta.js";

/** Botones de cada tarjeta según su columna: [texto, data-accion] */
const ACCIONES = {
  "Por hacer": [["Empezar →", "empezar"]],
  "En curso": [
    ["← Volver", "volver"],
    ["✓ Completar", "completar"],
  ],
  Hecho: [],
};

// ✍️ B6 · validar(datos) → { campo: "mensaje" } con los errores (objeto vacío si todo está bien)
//   - titulo: obligatorio y como mucho 80 caracteres
//   - cadaDias (si viene): entero mayor que 0. Si es correcto pero no hay limite, el error va
//     en «limite»: una tarea que se repite necesita fecha límite
export function validar(datos) {
  //SI AL FINAL ESTA VACIO NO HAY ERRORES
  const errores = {};

  //?? "" POR SI VIENE undefined, Y trim QUITA LOS ESPACIOS
  const titulo = (datos.titulo ?? "").trim();
  if (titulo === "") {
    errores.titulo = "El título es obligatorio";
  } else if (titulo.length > 80) {
    errores.titulo = "El título no puede pasar de 80 caracteres";
  }

  //SOLO SI VIENE, SI NO ES UNA TAREA NORMAL
  if (datos.cadaDias !== undefined) {
    //isInteger DA false CON DECIMALES Y CON NaN
    if (!Number.isInteger(datos.cadaDias) || datos.cadaDias <= 0) {
      errores.cadaDias = "Tiene que ser un número entero mayor que 0";
    } else if (!datos.limite) {
      //VA EN limite PORQUE ES LO QUE FALTA
      errores.limite = "Una tarea que se repite necesita fecha límite";
    }
  }

  return errores;
}

/**
 * Arranca la interfaz dentro de raiz (el <main id="app">). Los listeners se ponen UNA vez aquí;
 * pintar() solo cambia nodos, así que repintar no los duplica.
 * opciones.hoy: fecha fija para los tests · opciones.alCambiar(tablero): tras cada cambio (UD6)
 */
export function iniciarApp(raiz, tablero, { hoy = null, alCambiar = () => {} } = {}) {
  const form = raiz.querySelector("#form-alta");
  const aviso = raiz.querySelector("#aviso");
  const columnas = raiz.querySelector("#columnas");
  const resumen = raiz.querySelector("#resumen");

  // ✍️ B4 · pintar(): deja la página igual que el modelo cada vez que se llama, y NO pone listeners
  //   - cada columna ([data-columna="…"]): sus tareas en el orden de ordenadas(), con pintarLista en su
  //     .lista, y en cada .tarjeta sus botones según ACCIONES: <button type="button" data-accion="…">
  //   - el .contador de cada columna: (n), o (n/límite) en la que tiene límite WIP
  //   - [data-dato="progreso"]: hechas ÷ total en %, redondeado (con el tablero vacío, 0 %)
  //   - [data-dato="vencidas"]: las vencidas de tablero.resumen(ahora)
  //   La fecha de hoy: const ahora = hoy ?? new Date();  (los tests pasan una fija)
  function pintar() {
    //CREAMOS ESTA VARIABLE PARA LA FECHA Y SI NOS VIENE VACIA LE PONEMOS LA DE HOY POR DEFECTO
    const ahora = hoy ?? new Date();
    //RECORREMOS CADA COLUMNA DEL TABLERO 
    for (const columna of tablero.columnas) {
      //BUSCAMOS EN LA PAGINA LA .lista DE ESTA COLUMNA Y PINTAMOS SUS TAREAS ORDENADAS CON PINTARLISTA
      const lista = columnas.querySelector(`[data-columna="${columna.nombre}"] .lista`);
      pintarLista(lista, columna.ordenadas(), ahora);
 
      //BOTONES: MIRAMOS EN ACCIONES CUALES LLEVA ESTA COLUMNA
      const acciones = ACCIONES[columna.nombre];
      //RECORREMOS LAS TARJETAS QUE ACABA DE PINTAR PINTARLISTA
      for (const tarjeta of lista.querySelectorAll(".tarjeta")) {
        //CADA ACCION ES UN ARRAY: EN LA POSICION 0 EL TEXTO Y EN LA 1 EL NOMBRE
        for (const accion of acciones) {
          const boton = document.createElement("button");
          boton.type = "button";
          boton.dataset.accion = accion[1];
          boton.textContent = accion[0];
          tarjeta.append(boton);
        }
      }

      //CONTADOR: SI TIENE LIMITE (n/limite), SI NO SOLO (n). EN MI COLUMNA SE LLAMA limiteWip Y ES null SI NO HAY
      const contador = columnas.querySelector(`[data-columna="${columna.nombre}"] .contador`);
      const n = columna.tareas.length;
      if (columna.limiteWip) {
        contador.textContent = `(${n}/${columna.limiteWip})`;
      } else {
        contador.textContent = `(${n})`;
      }
    }
 
    //SACAMOS LOS DATOS DEL RESUMEN DEL BLOQUE A
    const datos = tablero.resumen(ahora);
 
    //PROGRESO: EMPIEZA EN 0 PORQUE SI NO HAY TAREAS 0/0 DA NaN
    const total = datos.porHacer + datos.enCurso + datos.hecho;
    let porcentaje = 0;
    if (total > 0) {
      porcentaje = Math.round((datos.hecho / total) * 100);
    }
    resumen.querySelector('[data-dato="progreso"]').textContent = `${porcentaje} %`;
 
    //VENCIDAS
    resumen.querySelector('[data-dato="vencidas"]').textContent = datos.vencidas;
  }
 
  function avisar(mensaje) {
    aviso.textContent = mensaje;
    aviso.hidden = mensaje === "";
  }

  // ✍️ B5 · UN listener, puesto UNA vez aquí (nunca dentro de pintar): clic en los botones de las
  //   tarjetas, con delegar sobre `columnas`. empezar → «En curso», volver → «Por hacer», completar.
  //   Tras cada cambio que sale bien: avisar(""), pintar() y alCambiar(tablero).
  //   Si el tablero lanza un ErrorTablero → avisar(error.message) y no se repinta.
  //   Cualquier otro error → se relanza (es un fallo del programa).
  //   Pista: una función cambiar(accion) con el try/catch te sirve también para el B6.

  //accion ES UNA FUNCION CON EL CAMBIO, ASI EL try/catch LO ESCRIBO UNA VEZ PARA EL B5 Y EL B6
  function cambiar(accion) {
    //INTENTA HACERLO, SI PETA SALTA AL catch
    try {
      accion();
      //SI LLEGA AQUI HA IDO BIEN
      avisar("");
      pintar();
      alCambiar(tablero);
    } catch (error) {
      //instanceof MIRA SI EL ERROR ES DE ESE TIPO (COLUMNA LLENA O MOVIMIENTO PROHIBIDO)
      if (error instanceof ErrorTablero) {
        avisar(error.message);
      } else {
        //CUALQUIER OTRO ES UN FALLO MIO, LO VUELVO A LANZAR PARA NO ESCONDERLO
        throw error;
      }
    }
  }

  //UN SOLO LISTENER EN #columnas CON MI delegar DEL B3, ASI NO SE PIERDE AL REPINTAR
  delegar(columnas, "click", "[data-accion]", (boton) => {
    //SUBO DEL BOTON A SU TARJETA
    const tarjeta = boton.closest(".tarjeta");
    //dataset DA TEXTO Y MIS IDS SON NUMEROS
    const id = Number(tarjeta.dataset.id);
    const accion = boton.dataset.accion;

    //LE PASO EL CAMBIO COMO FUNCION, SE EJECUTA DENTRO DEL try
    cambiar(() => {
      if (accion === "empezar") {
        tablero.mover(id, "En curso");
      } else if (accion === "volver") {
        tablero.mover(id, "Por hacer");
      } else if (accion === "completar") {
        tablero.completar(id);
      }
    });
  });

  // ✍️ B6 · submit de `form`: preventDefault, leerFormulario, validar y mostrarErrores. Si hay errores,
  //   no se crea nada. Si no, tablero.crearTarea(datos) (como un cambio más) y form.reset().
  form.addEventListener("submit", (evento) => {
    //QUE NO RECARGUE LA PAGINA
    evento.preventDefault();

    const datos = leerFormulario(form);
    const errores = validar(datos);
    //MI mostrarErrores DEL B2
    mostrarErrores(form, errores);

    //SI EL OBJETO TIENE ALGUNA CLAVE HAY ERRORES
    if (Object.keys(errores).length > 0) {
      return;
    }

    //CREAR LA TAREA ES UN CAMBIO MAS, ASI REPINTA IGUAL QUE LOS BOTONES
    cambiar(() => {
      tablero.crearTarea(datos);
      //VACIA EL FORMULARIO
      form.reset();
    });
  });

  pintar();
  return { pintar };
}