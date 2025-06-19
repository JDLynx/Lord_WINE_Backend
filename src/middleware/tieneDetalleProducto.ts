import { body, param } from "express-validator";

export const getTieneDetalleProductoValidation = [
    param("detIdDetalleCarrito").isInt({ min: 1 }),
    param("prodIdProducto").isInt({ min: 1 })
];

export const createTieneDetalleProductoValidation = [
    body("detIdDetalleCarrito").isInt({ min: 1 }).notEmpty(),
    body("prodIdProducto").isInt({ min: 1 }).notEmpty()
];

export const deleteTieneDetalleProductoValidation = [...getTieneDetalleProductoValidation];