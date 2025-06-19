import { body, param } from "express-validator";

const idValidator = param("id").isInt({ min: 1 }).withMessage("El ID debe ser un número entero positivo");

export const getInventarioTiendaByIdValidation = [idValidator];

export const createInventarioTiendaValidation = [
    body("invTienCantidadDisponible").isInt({ min: 0 }).withMessage("La cantidad disponible es obligatoria y debe ser un entero positivo o cero"),
    body("invGenIdInventarioGeneral").isInt({ min: 1 }).withMessage("El ID de inventario general es obligatorio y debe ser un entero positivo")
];

export const updateInventarioTiendaValidation = [
    ...createInventarioTiendaValidation
];

export const deleteInventarioTiendaValidation = [idValidator];