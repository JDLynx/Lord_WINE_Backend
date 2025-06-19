import { body, param } from "express-validator";

const idValidator = param("id").isInt({ min: 1 }).withMessage("El ID debe ser un número entero positivo");

export const getInventarioGeneralByIdValidation = [idValidator];

export const createInventarioGeneralValidation = [
    body("invGenCantidadTotal").isInt({ min: 0 }).withMessage("La cantidad total es obligatoria y debe ser un entero positivo o cero")
];

export const updateInventarioGeneralValidation = [
    body("invGenCantidadTotal").isInt({ min: 0 }).withMessage("La cantidad total es obligatoria y debe ser un entero positivo o cero")
];

export const deleteInventarioGeneralValidation = [idValidator];