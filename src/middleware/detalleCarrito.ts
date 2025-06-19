import { body, param } from "express-validator";

const idValidator = param("id").isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo");

export const getDetalleCarritoByIdValidation = [idValidator];

export const createDetalleCarritoValidation = [
    body("detCantidad").isInt({ min: 1 }).withMessage("La cantidad es obligatoria y debe ser un entero positivo"),
    body("detSubtotal").isDecimal().withMessage("El subtotal es obligatorio y debe ser un decimal"),
    body("carIdCarritoDeCompras").isInt({ min: 1 }).withMessage("El ID del carrito es obligatorio y debe ser un entero positivo")
];

export const updateDetalleCarritoValidation = [
    body("detCantidad").isInt({ min: 1 }).withMessage("La cantidad es obligatoria y debe ser un entero positivo"),
    body("detSubtotal").isDecimal().withMessage("El subtotal es obligatorio y debe ser un decimal"),
    body("carIdCarritoDeCompras").isInt({ min: 1 }).withMessage("El ID del carrito es obligatorio y debe ser un entero positivo")
];

export const deleteDetalleCarritoValidation = [idValidator];