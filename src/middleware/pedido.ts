import { body, param } from "express-validator";

const idParamValidator = param("id")
    .isInt({ gt: 0 })
    .withMessage("El ID de pedido debe ser un número entero positivo");

export const getPedidoByIdValidation = [idParamValidator];

export const deletePedidoValidation = [idParamValidator];

export const createPedidoValidation = [
    body("pedFecha")
    .notEmpty().withMessage("La fecha es obligatoria")
    .isISO8601().withMessage("La fecha debe estar en formato ISO 8601 (YYYY-MM-DD)"),

    body("pedTotal")
    .notEmpty().withMessage("El total es obligatorio")
    .isInt({ min: 0 }).withMessage("El total debe ser un número entero mayor o igual a 0"),

    body("pedEstado")
    .trim()
    .notEmpty().withMessage("El estado es obligatorio")
    .isLength({ max: 50 }).withMessage("El estado no puede superar los 50 caracteres"),

    body("clCodCliente")
    .notEmpty().withMessage("El código del cliente es obligatorio")
    .isInt({ gt: 0 }).withMessage("El código del cliente debe ser un número entero positivo"),

    body("emplCodEmpleado")
    .notEmpty().withMessage("El código del empleado es obligatorio")
    .isInt({ gt: 0 }).withMessage("El código del empleado debe ser un número entero positivo"),

    body("serIdServicioEmpresarial")
    .notEmpty().withMessage("El ID del servicio empresarial es obligatorio")
    .isInt({ gt: 0 }).withMessage("El ID del servicio empresarial debe ser un número entero positivo")
];

export const updatePedidoValidation = [
    idParamValidator,
    body("pedEstado")
        .optional()
        .trim()
        .notEmpty().withMessage("El estado no puede estar vacío si se proporciona")
        .isLength({ max: 50 }).withMessage("El estado no puede superar los 50 caracteres"),
    body("emplCodEmpleado")
        .optional()
        .isInt({ gt: 0 }).withMessage("El código del empleado debe ser un número entero positivo si se proporciona")
        .custom((value, { req }) => {
            if (value === '') {
                return true;
            }
            return true;
        })
];

export const createPedidoFromCartValidation = [
    body("clCodCliente")
        .notEmpty().withMessage("El código del cliente es obligatorio")
        .isInt({ gt: 0 }).withMessage("El código del cliente debe ser un número entero positivo"),

    body("serIdServicioEmpresarial")
        .notEmpty().withMessage("El ID del servicio empresarial es obligatorio")
        .isInt({ gt: 0 }).withMessage("El ID del servicio empresarial debe ser un número entero positivo"),

    body("items")
        .notEmpty().withMessage("El carrito no puede estar vacío")
        .isArray().withMessage("El carrito debe ser un arreglo de items"),

    body("items.*.prodIdProducto")
        .notEmpty().withMessage("El ID del producto es obligatorio")
        .isInt({ gt: 0 }).withMessage("El ID del producto debe ser un número entero positivo"),
    
    body("items.*.cantidad")
        .notEmpty().withMessage("La cantidad es obligatoria")
        .isInt({ gt: 0 }).withMessage("La cantidad debe ser un número entero positivo")
];