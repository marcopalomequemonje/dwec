/*import { catalogo } from "./datos.js";
import { buscarProducto, mostrarProducto } from "./funciones.js";

const catalogoCopia = [...catalogo];
const p1 = buscarProducto(2, catalogoCopia);
if (p1 === null){
    console.log("Producto no encontrado");
}
else{
    mostrarProducto(p1);
}*/

// main.js
import { catalogo } from "./datos.js";
import {
    buscarProducto,
    mostrarProducto,
    umbralStockBajo,
    registrarVenta,
    reponerStock,
} from "./funciones.js";

// copia que iremos SUSTITUYENDO (nunca modificando) tras cada venta/reposición
let catalogoActual = catalogo;
let opcion;

do {
    // prompt devuelve texto → Number lo pasa a número
    opcion = Number(prompt(
        "RETROSTOCK\n" +
        "1. Ver catálogo\n" +
        "2. Buscar producto\n" +
        "3. Registrar venta\n" +
        "4. Reponer stock\n" +
        "0. Salir"
    ));

    switch (opcion) {
        case 1:
            // recorro todos y muestro cada uno con su aviso de stock bajo
            catalogoActual.forEach((p) => {
                mostrarProducto(p);
                console.log(umbralStockBajo(p));
            });
            break;

        case 2: {
            const id = Number(prompt("Id del producto:"));
            const producto = buscarProducto(id, catalogoActual);
            // ternario: dos caminos simples
            producto ? mostrarProducto(producto) : console.log("No existe ese producto");
            break;
        }

        case 3: {
            const id = Number(prompt("Id del producto:"));
            const cantidad = Number(prompt("Cantidad:"));
            const producto = buscarProducto(id, catalogoActual);
            const resultado = registrarVenta(catalogoActual, producto, cantidad);

            // si devuelve texto → es un error
            if (typeof resultado === "string") {
                console.log(resultado);
            } else {
                // sustituyo el catálogo por el NUEVO
                catalogoActual = resultado.nuevoCatalogo;
                console.log("Venta OK. Total: " + resultado.total.toFixed(2) + " €");
            }
            break;
        }

        case 4: {
            const id = Number(prompt("Id del producto:"));
            const cantidad = Number(prompt("Unidades a reponer:"));
            const producto = buscarProducto(id, catalogoActual);
            const resultado = reponerStock(catalogoActual, producto, cantidad);

            if (typeof resultado === "string") {
                console.log(resultado);
            } else {
                catalogoActual = resultado;
                console.log("Stock repuesto");
            }
            break;
        }

        case 0:
            console.log("Adiós");
            break;

        default:
            console.log("Opción no válida");
    }
} while (opcion !== 0);