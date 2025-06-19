import { body, param } from "express-validator";

export const getTieneTiendaProductoValidation = [
    param("prodIdProducto").isInt({ min: 1 }),
    param("tiendIdTiendaFisica").isInt({ min: 1 })
];

export const createTieneTiendaProductoValidation = [
    body("prodIdProducto").isInt({ min: 1 }).notEmpty(),
    body("tiendIdTiendaFisica").isInt({ min: 1 }).notEmpty()
];

export const deleteTieneTiendaProductoValidation = [...getTieneTiendaProductoValidation];