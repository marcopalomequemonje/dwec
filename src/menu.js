import { catalogoInicial, CATEGORIAS } from "./catalogo.js";
import { listarCatalogo, filtrarPorCategoria, filtrarStockBajo, formatearProducto } from "./vistas.js";
import { buscarPorId, buscarPorTitulo } from "./inventario.js";

const MENU = `=== RETROSTOCK ===
1. Ver catálogo
2. Buscar producto
3. Registrar una venta
4. Reponer stock
5. Informe de caja
6. Salir`;

const SUBMENU_CATALOGO = `=== VER CATÁLOGO ===
1. Todo el catálogo
2. Filtrar por categoría
3. Solo productos con stock bajo`;

// Muestra las categorías numeradas y devuelve la elegida
const elegirCategoria = () => {
  const opciones = CATEGORIAS.map((cat, i) => `${i + 1}. ${cat}`).join("\n");
  const eleccion = prompt(`Elige una categoría:\n${opciones}`);
  return CATEGORIAS[Number(eleccion) - 1];
};

// Vista por categoría
const mostrarPorCategoria = (catalogo) => {
  const categoria = elegirCategoria();
  if (!categoria) {
    alert("Categoría no válida.");
    return;
  }
  console.log(`--- ${categoria} ---\n${listarCatalogo(filtrarPorCategoria(catalogo, categoria))}`);
};

// Opción 1 del menú: submenú con las 3 vistas
const verCatalogo = (catalogo) => {
  const vista = prompt(SUBMENU_CATALOGO);
  switch (vista) {
    case "1":
      console.log(`--- Catálogo completo ---\n${listarCatalogo(catalogo)}`);
      break;
    case "2":
      mostrarPorCategoria(catalogo);
      break;
    case "3":
      console.log(`--- Stock bajo ---\n${listarCatalogo(filtrarStockBajo(catalogo))}`);
      break;
    default:
      alert("Opción no válida.");
  }
};

export function iniciarMenu() {
  let catalogo = catalogoInicial;
  let opcion;

  do {
    opcion = prompt(MENU) ?? "6";

    switch (opcion) {
      case "1":
        verCatalogo(catalogo);
        break;
      case "2":
        console.log("Buscar producto: pendiente");
        break;
      case "3":
        console.log("Registrar venta: pendiente");
        break;
      case "4":
        console.log("Reponer stock: pendiente");
        break;
      case "5":
        console.log("Informe de caja: pendiente");
        break;
      case "6":
        console.log("Saliendo de RetroStock...");
        break;
      default:
        alert("Opción no válida. Elige un número del 1 al 6.");
    }
  } while (opcion !== "6");
}