// Busca un producto por su id exacto
export const buscarPorId = (catalogo, id) =>
    catalogo.find((producto) => producto.id === id);

// Busca el primer producto cuyo título contenga el texto
export const buscarPorTitulo = (catalogo, texto) =>
    catalogo.find((producto) => producto.titulo.includes(texto));

// Recibe el catálogo, el id del producto y una función con el cambio a hacer.
// Devuelve un catálogo nuevo: el producto con ese id cambiado y los demás igual.
export const actualizarProducto = (catalogo, id, transformar) =>
    catalogo.map((producto) => (producto.id === id ? transformar(producto) : producto));

// Para vender: hace una copia del producto con el stock restado.
// Así el catálogo original no se modifica.
export const venderProducto = (catalogo, id, unidades) =>
    actualizarProducto(catalogo, id, (producto) => ({
        ...producto,
        stock: producto.stock - unidades,
    }));

// Para reponer: hace una copia del producto con el stock sumado.
// Usa la misma función que vender, pero sumando en vez de restar.
export const reponerProducto = (catalogo, id, unidades) =>
    actualizarProducto(catalogo, id, (producto) => ({
        ...producto,
        stock: producto.stock + unidades,
    }));

// Closure: guarda las ventas de la sesión en una variable privada.
// Desde fuera solo se puede usar con registrar, contar y obtenerVentas.
export function crearRegistroVentas() {
    let ventas = [];

    return {
        // Añade una venta (creando un array nuevo, sin push)
        registrar: function (venta) {
            ventas = [...ventas, venta];
        },
        // Dice cuántas ventas se han hecho
        contar: function () {
            return ventas.length;
        },
        // Devuelve una copia de las ventas, para que nadie pueda cambiar la original
        obtenerVentas: function () {
            return [...ventas];
        },
    };
}