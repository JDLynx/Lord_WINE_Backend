import { body, param } from "express-validator";
import Categoria from "../models/categoria";

const idValidator = param("id")
    .isInt({ min: 1 }).withMessage("El ID debe ser un número entero positivo");

export const getCategoriaByIdValidation = [idValidator];

export const createCategoriaValidation = [
    body("catNombre")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ max: 50 }).withMessage("El nombre no puede superar los 50 caracteres")
];

export const updateCategoriaValidation = [
    body("catNombre")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ max: 50 }).withMessage("El nombre no puede superar los 50 caracteres")
];

export const deleteCategoriaValidation = [idValidator];