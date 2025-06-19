import { body, param } from "express-validator";
import CarritoDeCompras from "../models/carrito_de_compras";

const idValidator = param("id")
    .isInt({ min: 1 }).withMessage("El ID debe ser un número entero positivo");

export const getCarritoByIdValidation = [idValidator];

export const createCarritoValidation = [
    body("carEstado")
    .trim()
    .notEmpty().withMessage("El estado es obligatorio")
    .isLength({ max: 50 }).withMessage("El estado no puede superar los 50 caracteres")
];

export const updateCarritoValidation = [
    body("carEstado")
    .trim()
    .notEmpty().withMessage("El estado es obligatorio")
    .isLength({ max: 50 }).withMessage("El estado no puede superar los 50 caracteres")
];

export const deleteCarritoValidation = [idValidator];