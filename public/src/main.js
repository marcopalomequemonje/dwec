import { catalogo } from "./datos.js";
import { buscarProducto, mostrarProducto } from "./funciones.js";

const catalogoCopia = [...catalogo];
const p1 = buscarProducto(2, catalogoCopia);
if (p1 === null){
    console.log("Producto no encontrado");
}
else{
    mostrarProducto(p1);
}