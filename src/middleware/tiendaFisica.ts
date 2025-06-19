import { body, param } from "express-validator";

const idValidator = param("id")
    .isInt({ min: 1 }).withMessage("El ID debe ser un número entero positivo");

export const getTiendaFisicaByIdValidation = [idValidator];

export const createTiendaFisicaValidation = [
    body("tiendNombre")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ max: 50 }),

    body("tiendDireccion")
    .trim()
    .notEmpty().withMessage("La dirección es obligatoria")
    .isLength({ max: 50 }),

    body("tiendTelefono")
    .trim()
    .notEmpty().withMessage("El teléfono es obligatorio")
    .isLength({ max: 50 })
    .matches(/^\+?\d{7,15}$/).withMessage("El teléfono debe tener entre 7 y 15 dígitos"),

    body("adminCodAdministrador")
    .notEmpty().withMessage("El administrador es obligatorio")
    .isInt({ min: 1 })
];

export const updateTiendaFisicaValidation = [
    ...createTiendaFisicaValidation
];

export const deleteTiendaFisicaValidation = [idValidator];