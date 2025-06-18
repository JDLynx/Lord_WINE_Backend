import { body, param } from "express-validator";
import Cliente from "../models/cliente";

const idValidator = param("id")
    .isInt({ gt: 0 }).withMessage("El ID debe ser un número entero positivo");

export const getClienteByIdValidation = [idValidator];

export const createClienteValidation = [
    body("clIdCliente")
    .notEmpty().withMessage("La identificación es obligatoria")
    .isInt({ gt: 0 }).withMessage("La identificación debe ser un número entero positivo"),

    body("clNombre")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ max: 50 }).withMessage("El nombre no puede superar los 50 caracteres"),

    body("clDireccion")
    .trim()
    .notEmpty().withMessage("La dirección es obligatoria")
    .isLength({ max: 50 }).withMessage("La dirección no puede superar los 50 caracteres"),

    body("clTelefono")
    .trim()
    .notEmpty().withMessage("El teléfono es obligatorio")
    .isLength({ max: 50 }).withMessage("El teléfono no puede superar los 50 caracteres")
    .matches(/^\+?\d{7,15}$/).withMessage("El teléfono debe contener entre 7 y 15 dígitos"),

    body("clCorreoElectronico")
    .trim()
    .notEmpty().withMessage("El correo es obligatorio")
    .isEmail().withMessage("Formato de correo inválido")
    .custom(async (value: string) => {
        const exists = await Cliente.findOne({ where: { clCorreoElectronico: value } });
        if (exists) throw new Error("Este correo ya está registrado");
        return true;
    }),

    body("clContrasena")
    .notEmpty().withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres")
];

export const updateClienteValidation = [
    body("clIdCliente")
    .notEmpty().withMessage("La identificación es obligatoria")
    .isInt({ gt: 0 }).withMessage("La identificación debe ser un número entero positivo"),

    body("clNombre")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ max: 50 }),

    body("clDireccion")
    .trim()
    .notEmpty().withMessage("La dirección es obligatoria")
    .isLength({ max: 50 }),

    body("clTelefono")
    .trim()
    .notEmpty().withMessage("El teléfono es obligatorio")
    .isLength({ max: 50 })
    .matches(/^\+?\d{7,15}$/).withMessage("El teléfono debe contener entre 7 y 15 dígitos"),

    body("clCorreoElectronico")
    .trim()
    .notEmpty().withMessage("El correo es obligatorio")
    .isEmail().withMessage("Formato de correo inválido"),

    body("clContrasena")
    .optional()
    .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres")
];

export const deleteClienteValidation = [idValidator];

export const loginClienteValidation = [
    body("correo")
    .trim()
    .notEmpty().withMessage("El correo es obligatorio")
    .isEmail().withMessage("Formato de correo inválido"),

    body("contrasena")
    .notEmpty().withMessage("La contraseña es obligatoria")
];