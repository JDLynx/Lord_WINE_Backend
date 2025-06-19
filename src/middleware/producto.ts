import { body, param } from "express-validator";

const idValidator = param("id")
    .isInt({ min: 1 }).withMessage("El ID debe ser un número entero positivo");

export const getProductoByIdValidation = [idValidator];

export const createProductoValidation = [
    body("prodNombre")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ max: 50 }),

    body("prodDescripcion")
    .trim()
    .notEmpty().withMessage("La descripción es obligatoria"),

    body("prodPrecio")
    .notEmpty().withMessage("El precio es obligatorio")
    .isDecimal().withMessage("El precio debe ser un número decimal"),

    body("adminCodAdministrador")
    .notEmpty().withMessage("El administrador es obligatorio")
    .isInt({ min: 1 }),

    body("categIdCategoria")
    .notEmpty().withMessage("La categoría es obligatoria")
    .isInt({ min: 1 })
];

export const updateProductoValidation = [
    ...createProductoValidation
];

export const deleteProductoValidation = [idValidator];