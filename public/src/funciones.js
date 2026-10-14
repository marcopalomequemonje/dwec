//TABLA A
export const recargoDescuentoEstado = (producto) => {
    if (producto.estado === "nuevo-precintado"){
        return producto.precio * 0.25;
    }
    else if (producto.estado === "usado-como-nuevo"){
        return 0;
    }
    else if (producto.estado === "usado-caja-danada"){
        return producto.precio * (-0.15);
    }
    else if (producto.estado === "solo-cartucho"){
        return producto.precio * (-0.3)
    }
}

export const precioRealProducto = (producto) => {
    return producto.precio + recargoDescuentoEstado(producto);
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
    if (producto.stock<3){
        return "⚠ Stock bajo"
    }
    return "";
};

//2 BUSCAR PRODUCTO
export const buscarProducto = (id, catalogo) => {
    const p = catalogo.find (
        (producto) => producto.id === id
    );
    if (!p){
        return null;
    }
    return p;
}
//MOSTRAR PRODUCTO COMPLETO
export const mostrarProducto = (producto) => {
    console.log(" id: ",producto.id," titulo: ",producto.titulo," plataforma: ",producto.plataforma," estado: ",producto.estado," precio: ",producto.precioBase," stock: ",producto.stock)
}


























//COMO SE HACE A LO ANTIGUO
/*function descuentoPorVolumen(unidad) {
    if (unidad ===1) {
        return 0;
    } else if (unidad === 2 || unidad === 3) {
        return 0.05;
    } else {
        return 0.1;
    }
}*/