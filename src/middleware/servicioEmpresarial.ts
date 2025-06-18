import { body, param } from "express-validator";

const idParamValidator = param("id")
  .isInt({ gt: 0 })
  .withMessage("El ID debe ser un número entero positivo");

export const getServicioByIdValidation = [idParamValidator];

export const deleteServicioValidation = [idParamValidator];

const servicioBaseValidation = [
  body("serNombre")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ max: 50 }).withMessage("El nombre no puede superar los 50 caracteres"),

  body("serDescripcion")
    .trim()
    .notEmpty().withMessage("La descripción es obligatoria"),

  body("serPrecio")
    .notEmpty().withMessage("El precio es obligatorio")
    .isDecimal({ decimal_digits: "0,2", locale: "en-US" })
    .withMessage("El precio debe ser un número decimal con hasta 2 decimales")
    .custom((value) => parseFloat(value) >= 0)
    .withMessage("El precio debe ser mayor o igual a 0")
];

export const createServicioValidation = [...servicioBaseValidation];

export const updateServicioValidation = [
  idParamValidator,
  ...servicioBaseValidation
];