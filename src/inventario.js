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