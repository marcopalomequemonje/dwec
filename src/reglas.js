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