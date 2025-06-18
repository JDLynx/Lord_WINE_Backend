import { body, param } from "express-validator";
import Administrador from "../models/administrador";

// Valida que el parámetro "id" en la URL sea un número entero positivo
const idValidator = param("id")
    .isInt({ min: 1 }).withMessage("El ID debe ser un número entero positivo");

// Exporta la validación para obtener administrador por ID (usada en rutas tipo GET /:id)
export const getAdministradorByIdValidation = [idValidator];

// Validaciones para crear un nuevo administrador
export const createAdministradorValidation = [
  // Valida que el ID sea entero, positivo y único en la base de datos
    body("adminIdAdministrador")
    .notEmpty().withMessage("El ID del administrador no puede estar vacío")
    .isInt({ min: 1 }).withMessage("El ID debe ser un número entero positivo")
    .custom(async (value: number) => {
        const exists = await Administrador.findOne({ where: { adminIdAdministrador: value } });
        if (exists) throw new Error("Este ID ya está registrado");
        return true;
    }),

  // Valida el nombre: no vacío y máximo 50 caracteres
    body("adminNombre")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ max: 50 }).withMessage("El nombre no puede superar los 50 caracteres"),

  // Valida la dirección: no vacía y máximo 50 caracteres
    body("adminDireccion")
    .trim()
    .notEmpty().withMessage("La dirección es obligatoria")
    .isLength({ max: 50 }).withMessage("La dirección no puede superar los 50 caracteres"),

  // Valida el teléfono: no vacío, máximo 50 caracteres, y formato numérico válido
    body("adminTelefono")
    .trim()
    .notEmpty().withMessage("El teléfono es obligatorio")
    .isLength({ max: 50 }).withMessage("El teléfono no puede superar los 50 caracteres")
    .matches(/^\+?\d{7,15}$/).withMessage("El teléfono debe contener entre 7 y 15 dígitos"),

  // Valida el correo electrónico: no vacío, formato correcto, y que no esté registrado
    body("adminCorreoElectronico")
    .trim()
    .notEmpty().withMessage("El correo electrónico es obligatorio")
    .isEmail().withMessage("Formato de correo inválido")
    .custom(async (value: string) => {
        const exists = await Administrador.findOne({ where: { adminCorreoElectronico: value } });
        if (exists) throw new Error("Este correo ya está registrado");
        return true;
    }),

  // Valida la contraseña: no vacía y mínimo 6 caracteres
    body("adminContrasena")
    .notEmpty().withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres")
];

// Validaciones para actualizar un administrador existente
export const updateAdministradorValidation = [
  // El ID debe seguir siendo entero y positivo
    body("adminIdAdministrador")
    .notEmpty().withMessage("El ID del administrador es obligatorio")
    .isInt({ min: 1 }).withMessage("El ID debe ser un número entero positivo"),

  // Validación del nombre como en creación
    body("adminNombre")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ max: 50 }),

  // Validación de la dirección como en creación
    body("adminDireccion")
    .trim()
    .notEmpty().withMessage("La dirección es obligatoria")
    .isLength({ max: 50 }),

  // Validación del teléfono como en creación
    body("adminTelefono")
    .trim()
    .notEmpty().withMessage("El teléfono es obligatorio")
    .isLength({ max: 50 })
    .matches(/^\+?\d{7,15}$/).withMessage("El teléfono debe contener entre 7 y 15 dígitos"),

  // Validación del correo como en creación (sin verificación de existencia)
    body("adminCorreoElectronico")
    .trim()
    .notEmpty().withMessage("El correo electrónico es obligatorio")
    .isEmail().withMessage("Formato de correo inválido"),

  // La contraseña es opcional, pero si se envía debe tener al menos 6 caracteres
    body("adminContrasena")
    .optional()
    .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
];

// Validación para eliminar un administrador (requiere solo el ID por URL)
export const deleteAdministradorValidation = [idValidator];

// Validaciones para iniciar sesión de administrador
export const loginAdministradorValidation = [
  // Valida el campo del correo: no vacío y con formato válido
    body("adminCorreoElectronico")
    .trim()
    .notEmpty().withMessage("El correo electrónico es obligatorio")
    .isEmail().withMessage("Correo inválido"),

  // Valida la contraseña: no vacía
    body("adminContrasena")
    .notEmpty().withMessage("La contraseña es obligatoria")
];