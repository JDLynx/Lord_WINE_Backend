// middleware/administrador.ts
import { body, param } from "express-validator";
import Administrador from "../models/administrador"; // Asegúrate de que esta ruta sea correcta para tu proyecto

// --- Validaciones para obtener un administrador por su ID ---
export const getAdministradorByIdValidation = [
    param("id").isInt().withMessage("ID no válido") // Valida que el ID sea un entero
        .custom((value) => value > 0).withMessage("ID no válido"), // Y mayor a cero
];

// --- Validaciones para crear un nuevo administrador ---
export const createAdministradorValidation = [
    // Valida que el ID del admin no esté vacío ni repetido
    body("adminIdAdministrador")
        .notEmpty().withMessage("El ID del administrador no puede estar vacío")
        .custom(async (value) => {
            const exists = await Administrador.findOne({ where: { adminIdAdministrador: value } });
            if (exists) throw new Error("El ID del administrador ya está registrado");
            return true;
        }),
    // Valida nombre, dirección, teléfono (no vacíos y máximo 50 caracteres)
    body("adminNombre").notEmpty().withMessage("El nombre es obligatorio").isLength({ max: 50 }),
    body("adminDireccion").notEmpty().withMessage("La dirección es obligatoria").isLength({ max: 50 }),
    body("adminTelefono").notEmpty().withMessage("El teléfono es obligatorio").isLength({ max: 50 }),
    // Valida correo electrónico (único y con formato)
    body("adminCorreoElectronico")
        .notEmpty().withMessage("El correo electrónico es obligatorio")
        .isEmail().withMessage("Formato de correo inválido")
        .custom(async (value) => {
            const exists = await Administrador.findOne({ where: { adminCorreoElectronico: value } });
            if (exists) throw new Error("El correo electrónico ya está registrado");
            return true;
        }),
    // Valida que la contraseña tenga mínimo 4 caracteres
    body("adminContrasena")
        .notEmpty().withMessage("La contraseña es obligatoria")
        .isLength({ min: 4 }).withMessage("La contraseña debe tener al menos 4 caracteres"),
];

// --- Validaciones para actualizar un administrador por ID ---
export const updateAdministradorValidation = [
    body("adminIdAdministrador").notEmpty().withMessage("El ID del administrador es obligatorio"),
    body("adminNombre").notEmpty().withMessage("El nombre es obligatorio").isLength({ max: 50 }),
    body("adminDireccion").notEmpty().withMessage("La dirección es obligatoria").isLength({ max: 50 }),
    body("adminTelefono").notEmpty().withMessage("El teléfono es obligatorio").isLength({ max: 50 }),
    body("adminCorreoElectronico")
        .notEmpty().withMessage("El correo electrónico es obligatorio")
        .isEmail().withMessage("Formato de correo inválido"),
    // La contraseña puede ser opcional pero debe cumplir mínimo si se envía
    body("adminContrasena").optional().isLength({ min: 4 }).withMessage("La contraseña debe tener al menos 4 caracteres"),
];

// --- Validaciones para eliminar un administrador por ID ---
export const deleteAdministradorValidation = [
    param("id").isInt().withMessage("ID no válido").custom((value) => value > 0).withMessage("ID no válido"),
];

// --- Validaciones para el login de administrador ---
export const loginAdministradorValidation = [
    body("correo").notEmpty().withMessage("El correo es obligatorio").isEmail().withMessage("Correo inválido"),
    body("contrasena").notEmpty().withMessage("La contraseña es obligatoria"),
];