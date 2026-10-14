//TABLA A
export const recargoDescuentoEstado = (producto) => {
    if (producto.estado === "nuevo-precintado") {
        return producto.precioBase * 0.25;
    }
    else if (producto.estado === "usado-como-nuevo") {
        return 0;
    }
    else if (producto.estado === "usado-caja-danada") {
        return producto.precioBase * (-0.15);
    }
    else if (producto.estado === "solo-cartucho") {
        return producto.precioBase * (-0.3);
    }
}

export const precioRealProducto = (producto) => {
    return producto.precioBase + recargoDescuentoEstado(producto);
}

//TABLA B
export const descuentoPorVolumen = (unidad) => {
    if (unidad >= 4) {
        return 0.1;
    } else if (unidad >= 2) {
        return 0.05;
    } else {
        return 0;
    }
}

//FUNCION TABLA C
export const umbralStockBajo = (producto) => {
    if (producto.stock < 3) {
        return "⚠ Stock bajo";
    }
    return "";
};

//2 BUSCAR PRODUCTO
export const buscarProducto = (id, catalogo) => {
    const p = catalogo.find(
        (producto) => producto.id === id
    );
    if (!p) {
        return null;
    }
    return p;
}

//MOSTRAR PRODUCTO COMPLETO
export const mostrarProducto = (producto) => {
    console.log(" id: ", producto.id, " titulo: ", producto.titulo, " plataforma: ", producto.plataforma, " estado: ", producto.estado, " precio: ", producto.precioBase, " stock: ", producto.stock);
}

//3 REGISTRAR UNA VENTA
export const registrarVenta = (catalogo, producto, cantidad) => {
    if (!producto) {
        return "no existe este producto";
    } else if (producto.stock >= cantidad) {
        // precio de 1 unidad ya con la Tabla A
        const precioEstado = precioRealProducto(producto);
        // descuento de la Tabla B según la cantidad
        const descuento = descuentoPorVolumen(cantidad);
        const rebaja = precioEstado * descuento;
        const precioUnidad = precioEstado - rebaja;
        const total = precioUnidad * cantidad;
        // catálogo nuevo (map recorre todos y devuelve un array del mismo tamaño)
        const nuevoCatalogo = catalogo.map((p) => {
            if (p.id === producto.id) {
                return { ...p, stock: p.stock - cantidad };
            } else {
                return p;
            }
        });
        return {nuevoCatalogo, total};

    } else {
        return "stock insuficiente";
    }
}

//4 REPONER STOCK
export const reponerStock = (catalogo, producto, cantidad) => {
    if (!producto) {
        return "no existe este producto";
    } else if (cantidad <= 0) {
        return "cantidad no válida";
    } else {
        const nuevoCatalogo = catalogo.map((p) =>
            p.id === producto.id ? { ...p, stock: p.stock + cantidad } : p
        );
        return nuevoCatalogo;
    }
}
//COMO SE HACE A LO ANTIGUO
/*function descuentoPorVolumen(unidad) {
    if (unidad === 1) {
        return 0;
    } else if (unidad === 2 || unidad === 3) {
        return 0.05;
    } else {
        return 0.1;
    }
}*/