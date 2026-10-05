const MENU = `=== RETROSTOCK ===
1. Ver catálogo
2. Buscar producto
3. Registrar una venta
4. Reponer stock
5. Informe de caja
6. Salir`;

export function iniciarMenu() {
  let opcion;

  do {
    opcion = prompt(MENU) ?? "6";

    switch (opcion) {
      case "1":
        console.log("Ver catálogo");
        break;
      case "2":
        console.log("Buscar producto");
        break;
      case "3":
        console.log("Registrar venta");
        break;
      case "4":
        console.log("Reponer stock");
        break;
      case "5":
        console.log("Informe de caja");
        break;
      case "6":
        console.log("Saliendo de RetroStock...");
        break;
      default:
        alert("Opción no válida. Elige un número del 1 al 6.");
    }
  } while (opcion !== "6");
}