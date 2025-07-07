import { body, param } from "express-validator";

export const getTieneInventarioTiendaProductoValidation = [
    param("invTienIdInventarioTienda").isInt({ min: 1 }).withMessage("El ID de inventario de tienda debe ser un número entero positivo."),
    param("prodIdProducto").isInt({ min: 1 }).withMessage("El ID de producto debe ser un número entero positivo.")
];

export const createTieneInventarioTiendaProductoValidation = [
    body("invTienIdInventarioTienda").isInt({ min: 1 }).notEmpty().withMessage("El ID de inventario de tienda es requerido y debe ser un número entero positivo."),
    body("prodIdProducto").isInt({ min: 1 }).notEmpty().withMessage("El ID de producto es requerido y debe ser un número entero positivo."),
    body("invTienProdCantidad")
        .isInt({ min: 0 })
        .withMessage("La cantidad debe ser un número entero no negativo.")
        .notEmpty()
        .withMessage("La cantidad es requerida.")
];

export const updateTieneInventarioTiendaProductoValidation = [
    param("invTienIdInventarioTienda").isInt({ min: 1 }).withMessage("El ID de inventario de tienda debe ser un número entero positivo."),
    param("prodIdProducto").isInt({ min: 1 }).withMessage("El ID de producto debe ser un número entero positivo."),
    body("invTienProdCantidad")
        .isInt({ min: 0 })
        .withMessage("La cantidad debe ser un número entero no negativo.")
        .notEmpty()
        .withMessage("La cantidad es requerida para la actualización.")
];

export const deleteTieneInventarioTiendaProductoValidation = [
    param("invTienIdInventarioTienda").isInt({ min: 1 }).withMessage("El ID de inventario de tienda debe ser un número entero positivo."),
    param("prodIdProducto").isInt({ min: 1 }).withMessage("El ID de producto debe ser un número entero positivo.")
];