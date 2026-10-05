// Busca un producto por su id exacto
export const buscarPorId = (catalogo, id) =>
  catalogo.find((producto) => producto.id === id);

// Busca el primer producto cuyo título contenga el texto (sin importar mayúsculas)
export const buscarPorTitulo = (catalogo, texto) =>
  catalogo.find((producto) =>
    producto.titulo.toLowerCase().includes(texto.toLowerCase()),
  );