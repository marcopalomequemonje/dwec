import { catalogoInicial, CATEGORIAS } from "./catalogo.js";
import { listarCatalogo, filtrarPorCategoria, filtrarStockBajo, formatearProducto, formatearEuros } from "./vistas.js";
import { buscarPorId, buscarPorTitulo, venderProducto, reponerProducto, crearRegistroVentas } from "./inventario.js";
import { precioUnitario, totalVenta } from "./reglas.js";

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

const SUBMENU_BUSCAR = `=== BUSCAR PRODUCTO ===
1. Por id
2. Por título`;

// Opción 2 del menú: buscar por id o por título parcial
const buscarProducto = (catalogo) => {
    const modo = prompt(SUBMENU_BUSCAR);
    let encontrado;

    if (modo === "1") {
        const id = Number(prompt("Escribe el id del producto:"));
        encontrado = buscarPorId(catalogo, id);
    } else if (modo === "2") {
        const texto = prompt("Escribe parte del título:")?.trim() ?? "";
        if (!texto) {
            alert("No has escrito nada.");
            return;
        }
        encontrado = buscarPorTitulo(catalogo, texto);
    } else {
        alert("Opción no válida.");
        return;
    }

    console.log(encontrado ? formatearProducto(encontrado) : "No se ha encontrado ningún producto.");
};

// Muestra los productos numerados y devuelve el elegido
const elegirProducto = (catalogo) => {
    const opciones = catalogo
        .map((producto, i) => `${i + 1}. ${producto.titulo} (stock: ${producto.stock})`)
        .join("\n");
    const eleccion = prompt(`Elige un producto:\n${opciones}`);
    return catalogo[Number(eleccion) - 1];
};

// Pide las unidades. Devuelve el número si es válido, o null si no lo es
const pedirCantidad = () => {
    const cantidad = Number(prompt("¿Cuántas unidades?"));
    return Number.isInteger(cantidad) && cantidad > 0 ? cantidad : null;
};


// Opción 3 del menú: registra una venta y devuelve el catálogo actualizado
const registrarVenta = (catalogo, registro) => {
    const producto = elegirProducto(catalogo);
    if (!producto) {
        alert("Producto no válido.");
        return catalogo;
    }

    const unidades = pedirCantidad();
    if (!unidades) {
        alert("Cantidad no válida.");
        return catalogo;
    }

    if (unidades > producto.stock) {
        alert(`No hay stock suficiente. Solo quedan ${producto.stock} unidades.`);
        return catalogo;
    }

    const precio = precioUnitario(producto, unidades);
    const total = totalVenta(producto, unidades);

    registro.registrar({ id: producto.id, titulo: producto.titulo, unidades, total });

    console.log(`--- Venta registrada ---
${producto.titulo} x ${unidades}
Precio unitario final: ${formatearEuros(precio)}
Total de la venta: ${formatearEuros(total)}
Stock restante: ${producto.stock - unidades}`);

    return venderProducto(catalogo, producto.id, unidades);
};


// Opción 4 del menú: repone stock y devuelve el catálogo actualizado
const reponerStock = (catalogo) => {
    const producto = elegirProducto(catalogo);
    if (!producto) {
        alert("Producto no válido.");
        return catalogo;
    }

    const unidades = pedirCantidad();
    if (!unidades) {
        alert("Cantidad no válida.");
        return catalogo;
    }

    console.log(`--- Stock repuesto ---
${producto.titulo}: ${producto.stock} → ${producto.stock + unidades} unidades`);

    return reponerProducto(catalogo, producto.id, unidades);
};


export function iniciarMenu() {
    let catalogo = catalogoInicial;
    const registro = crearRegistroVentas();
    let opcion;

    do {
        opcion = prompt(MENU) ?? "6";

        switch (opcion) {
            case "1":
                verCatalogo(catalogo);
                break;
            case "2":
                buscarProducto(catalogo);
                break;
            case "3":
                catalogo = registrarVenta(catalogo, registro);
                break;
            case "4":
                catalogo = reponerStock(catalogo);
                break;
            case "5":
                console.log("Informe de caja: No se hacerlo");
                break;
            case "6":
                console.log(`Saliendo de RetroStock... Ventas realizadas en esta sesión: ${registro.contar()}`);
                break;
            default:
                alert("Opción no válida. Elige un número del 1 al 6.");
        }
    } while (opcion !== "6");
}