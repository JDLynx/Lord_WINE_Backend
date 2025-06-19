import { body, param } from "express-validator";

const idValidator = param("id")
    .isInt({ min: 1 }).withMessage("El ID debe ser un número entero positivo");

export const getDetallePedidoByIdValidation = [idValidator];

export const createDetallePedidoValidation = [
    body("detaCantidad")
    .notEmpty().withMessage("La cantidad es obligatoria")
    .isInt({ min: 1 }),

    body("detaPrecioUnitario")
    .notEmpty().withMessage("El precio unitario es obligatorio")
    .isDecimal(),

    body("detaSubtotal")
    .notEmpty().withMessage("El subtotal es obligatorio")
    .isDecimal(),

    body("pedIdPedido")
    .notEmpty().withMessage("El ID del pedido es obligatorio")
    .isInt({ min: 1 }),

    body("prodIdProducto")
    .notEmpty().withMessage("El ID del producto es obligatorio")
    .isInt({ min: 1 })
];

export const updateDetallePedidoValidation = [
    ...createDetallePedidoValidation
];

export const deleteDetallePedidoValidation = [idValidator];