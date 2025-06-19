import { body, param } from "express-validator";

export const getTieneInventarioTiendaProductoValidation = [
    param("invTienIdInventarioTienda").isInt({ min: 1 }),
    param("prodIdProducto").isInt({ min: 1 })
];

export const createTieneInventarioTiendaProductoValidation = [
    body("invTienIdInventarioTienda").isInt({ min: 1 }).notEmpty(),
    body("prodIdProducto").isInt({ min: 1 }).notEmpty()
];

export const deleteTieneInventarioTiendaProductoValidation = [
    param("invTienIdInventarioTienda").isInt({ min: 1 }),
    param("prodIdProducto").isInt({ min: 1 })
];