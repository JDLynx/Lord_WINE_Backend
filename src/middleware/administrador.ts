import { body, param } from "express-validator";
import Administrador from "../models/administrador";

const idValidator = param("id").isInt({ min: 1 }).withMessage("El ID debe ser un número entero positivo");

export const getAdministradorByIdValidation = [idValidator];

export const createAdministradorValidation = [
  body("adminIdAdministrador")
    .notEmpty().withMessage("El ID del administrador no puede estar vacío")
    .isInt({ min: 1 }).withMessage("El ID debe ser un número entero positivo")
    .custom(async (value: number) => {
      const exists = await Administrador.findOne({ where: { adminIdAdministrador: value } });
      if (exists) throw new Error("Este ID ya está registrado");
      return true;
    }),
  body("adminNombre")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ max: 50 }).withMessage("El nombre no puede superar los 50 caracteres"),
  body("adminDireccion")
    .trim()
    .notEmpty().withMessage("La dirección es obligatoria")
    .isLength({ max: 50 }).withMessage("La dirección no puede superar los 50 caracteres"),
  body("adminTelefono")
    .trim()
    .notEmpty().withMessage("El teléfono es obligatorio")
    .isLength({ max: 50 }).withMessage("El teléfono no puede superar los 50 caracteres")
    .matches(/^\+?\d{7,15}$/).withMessage("El teléfono debe contener entre 7 y 15 dígitos"),
  body("adminCorreoElectronico")
    .trim()
    .notEmpty().withMessage("El correo electrónico es obligatorio")
    .isEmail().withMessage("Formato de correo inválido")
    .custom(async (value: string) => {
      const exists = await Administrador.findOne({ where: { adminCorreoElectronico: value } });
      if (exists) throw new Error("Este correo ya está registrado");
      return true;
    }),
  body("adminContrasena")
    .notEmpty().withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres")
];

export const updateAdministradorValidation = [
  body("adminIdAdministrador")
    .notEmpty().withMessage("El ID del administrador es obligatorio")
    .isInt({ min: 1 }).withMessage("El ID debe ser un número entero positivo"),
  body("adminNombre")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ max: 50 }),
  body("adminDireccion")
    .trim()
    .notEmpty().withMessage("La dirección es obligatoria")
    .isLength({ max: 50 }),
  body("adminTelefono")
    .trim()
    .notEmpty().withMessage("El teléfono es obligatorio")
    .isLength({ max: 50 })
    .matches(/^\+?\d{7,15}$/).withMessage("El teléfono debe contener entre 7 y 15 dígitos"),
  body("adminCorreoElectronico")
    .trim()
    .notEmpty().withMessage("El correo electrónico es obligatorio")
    .isEmail().withMessage("Formato de correo inválido"),
  body("adminContrasena")
    .optional()
    .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
];

export const deleteAdministradorValidation = [idValidator];

export const loginAdministradorValidation = [
  body("adminCorreoElectronico")
    .trim()
    .notEmpty().withMessage("El correo electrónico es obligatorio")
    .isEmail().withMessage("Correo inválido"),
  body("adminContrasena")
    .notEmpty().withMessage("La contraseña es obligatoria")
];

export const cambiarContrasenaValidation = [
  idValidator,
  body("currentPassword")
    .notEmpty().withMessage("La contraseña actual es obligatoria"),
  body("newPassword")
    .notEmpty().withMessage("La nueva contraseña es obligatoria")
    .isLength({ min: 6 }).withMessage("La nueva contraseña debe tener al menos 6 caracteres")
];