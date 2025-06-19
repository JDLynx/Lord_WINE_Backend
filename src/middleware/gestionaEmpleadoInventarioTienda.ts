import { body, param } from "express-validator";

export const getGestionaEmpleadoInventarioTiendaValidation = [
    param("emplCodEmpleado").isInt({ min: 1 }),
    param("invTienIdInventarioTienda").isInt({ min: 1 })
];

export const createGestionaEmpleadoInventarioTiendaValidation = [
    body("emplCodEmpleado").isInt({ min: 1 }).notEmpty(),
    body("invTienIdInventarioTienda").isInt({ min: 1 }).notEmpty()
];

export const deleteGestionaEmpleadoInventarioTiendaValidation = [
    param("emplCodEmpleado").isInt({ min: 1 }),
    param("invTienIdInventarioTienda").isInt({ min: 1 })
];