import { body, param } from 'express-validator';

const idParamValidator = param('id')
    .isInt({ gt: 0 })
    .withMessage('El ID debe ser un número entero positivo');

export const getEmpleadoByIdValidation = [idParamValidator];

export const deleteEmpleadoValidation = [idParamValidator];

export const createEmpleadoValidation = [
    body('emplIdEmpleado')
        .trim()
        .notEmpty().withMessage('El ID del empleado es obligatorio')
        .isString().withMessage('El ID debe ser una cadena de texto'),

    body('emplNombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 50 }).withMessage('El nombre no puede superar los 50 caracteres'),

    body('emplDireccion')
        .trim()
        .notEmpty().withMessage('La dirección es obligatoria')
        .isLength({ max: 50 }).withMessage('La dirección no puede superar los 50 caracteres'),

    body('emplTelefono')
        .trim()
        .notEmpty().withMessage('El teléfono es obligatorio')
        .isLength({ max: 50 }).withMessage('El teléfono no puede superar los 50 caracteres')
        .matches(/^\+?\d{7,15}$/).withMessage('El teléfono debe contener entre 7 y 15 dígitos'),

    body('emplCorreoElectronico')
        .trim()
        .notEmpty().withMessage('El correo electrónico es obligatorio')
        .isEmail().withMessage('Formato de correo inválido'),

    body('emplContrasena')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

    body('adminCodAdministrador')
        .notEmpty().withMessage('El ID del administrador es obligatorio')
        .isInt({ gt: 0 }).withMessage('El ID del administrador debe ser un número entero positivo')
];

export const updateEmpleadoValidation = [
    idParamValidator,

    body('emplIdEmpleado')
        .trim()
        .notEmpty().withMessage('El ID del empleado es obligatorio')
        .isString().withMessage('El ID debe ser una cadena de texto'),

    body('emplNombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 50 }).withMessage('El nombre no puede superar los 50 caracteres'),

    body('emplDireccion')
        .trim()
        .notEmpty().withMessage('La dirección es obligatoria')
        .isLength({ max: 50 }).withMessage('La dirección no puede superar los 50 caracteres'),

    body('emplTelefono')
        .trim()
        .notEmpty().withMessage('El teléfono es obligatorio')
        .isLength({ max: 50 }).withMessage('El teléfono no puede superar los 50 caracteres')
        .matches(/^\+?\d{7,15}$/).withMessage('El teléfono debe contener entre 7 y 15 dígitos'),

    body('emplCorreoElectronico')
        .trim()
        .notEmpty().withMessage('El correo electrónico es obligatorio')
        .isEmail().withMessage('Formato de correo inválido'),

    body('emplContrasena')
        .optional()
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

    body('adminCodAdministrador')
        .notEmpty().withMessage('El ID del administrador es obligatorio')
        .isInt({ gt: 0 }).withMessage('El ID del administrador debe ser un número entero positivo')
];