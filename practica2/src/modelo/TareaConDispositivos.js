import { Tarea } from "./Tarea.js";
import { PruebasFallidasError } from "./errores.js";

export class TareaConDispositivos extends Tarea {
  #dispositivos = new Map();

  constructor(titulo, prioridad, limite, dispositivos) {
    super(titulo, prioridad, limite)
    for (const nombre of dispositivos) {
      this.#dispositivos.set(nombre, null)
    }
  }

  get dispositivos() {
    const copia = [];
    for (const [nombre, fallos] of this.#dispositivos) {
      copia.push({ nombre: nombre, fallos: fallos });
    }
    return copia;
  }

  probar(nombre, fallos) {
    if (!(this.#dispositivos.has(nombre))) {
      throw new RangeError(`El nombre no esta en la lista ${nombre}`);
    }

    if (!Number.isInteger(fallos) || fallos < 0) {
      throw new RangeError("No válido, fallos tiene que ser un int y mayor que 0");
    }
    this.#dispositivos.set(nombre, fallos);
  }

  comprobarPaso(desde, hasta) {
    if (hasta !== "Hecho") return;            // la regla es para DARLA POR HECHA
    const fallidos = this.#dispositivos
    .filter((d) => d.fallos !== 0)
    .map((d) => d.nombre);
    if (fallidos.length > 0) throw new PruebasFallidasError(fallidos);
  }
}
