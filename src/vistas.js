import { precioUnitario, tieneStockBajo } from "./reglas.js";

// Convierte UN producto en una línea de texto
export const formatearProducto = (producto) => {
  const { id, titulo, plataforma, categoria, estado, stock } = producto;
  const aviso = tieneStockBajo(producto) ? " ⚠️ Stock bajo" : "";
  return `#${id} ${titulo} (${plataforma}) · ${categoria} · ${estado} · ${formatearEuros(precioUnitario(producto))} · Stock: ${stock}${aviso}`;
};

// Vista Todo: map() convierte cada producto en una línea
export const listarCatalogo = (catalogo) =>
  catalogo.map(formatearProducto).join("\n") || "No hay productos que mostrar.";

// Vista por categoría: filter() se queda solo con esa categoría
export const filtrarPorCategoria = (catalogo, categoria) =>
  catalogo.filter((producto) => producto.categoria === categoria);

// Vista Stock bajo: filter() se queda con los de menos de 3 unidades
export const filtrarStockBajo = (catalogo) => catalogo.filter(tieneStockBajo);