import { body, param } from "express-validator";

export const getTrabajaEmpleadoTiendaFisicaValidation = [
    param("emplCodEmpleado").isInt({ min: 1 }),
    param("tiendIdTiendaFisica").isInt({ min: 1 })
];

export const createTrabajaEmpleadoTiendaFisicaValidation = [
    body("emplCodEmpleado").isInt({ min: 1 }).notEmpty(),
    body("tiendIdTiendaFisica").isInt({ min: 1 }).notEmpty()
];

export const deleteTrabajaEmpleadoTiendaFisicaValidation = [...getTrabajaEmpleadoTiendaFisicaValidation];