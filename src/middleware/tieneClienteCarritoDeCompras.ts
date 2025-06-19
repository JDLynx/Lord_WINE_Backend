import { body, param } from "express-validator";

export const getTieneClienteCarritoDeComprasValidation = [
    param("clCodCliente").isInt({ min: 1 }),
    param("carIdCarritoDeCompras").isInt({ min: 1 })
];

export const createTieneClienteCarritoDeComprasValidation = [
    body("clCodCliente").isInt({ min: 1 }).notEmpty(),
    body("carIdCarritoDeCompras").isInt({ min: 1 }).notEmpty()
];

export const deleteTieneClienteCarritoDeComprasValidation = [
    param("clCodCliente").isInt({ min: 1 }),
    param("carIdCarritoDeCompras").isInt({ min: 1 })
];