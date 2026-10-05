//tabla A
export const AJUSTE_ESTADO = {
  "nuevo-precintado": 1.25,
  "usado-como-nuevo": 1.0,
  "usado-caja-danada": 0.85,
  "solo-cartucho": 0.7,
};
//tabla B
export function multiplicadorVolumen(unidades) {
  if (unidades >= 4) {
    return 0.9;
  } else if (unidades >= 2) {
    return 0.95;
  } else {
    return 1;
  }
}

const redondear = (valor) => Math.round(valor * 100) / 100;

//Precio por unidad aplicando Tabla A y Tabla B
export function precioUnitario({precioBase, estado}, unidades = 1) {
    const precioConEstado = precioBase * AJUSTE_ESTADO[estado];
    return redondear(precioConEstado * multiplicadorVolumen(unidades));
}

//total
export const totalVenta = (producto, unidades) =>
    redondear(precioUnitario(producto, unidades) * unidades);

// tabla c: stock bajo 
export const UMBRAL_STOCK_BAJO = 3;

export const tieneStockBajo = ({ stock }) => stock < UMBRAL_STOCK_BAJO;