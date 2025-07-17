// src/routes/carritoDeComprasRouter.ts
import { Router } from "express";
import { CarritoDeComprasController } from "../controllers/CarritoDeComprasController";
import { handleInputErrors } from "../middleware/validation";
// Importaciones de validación existentes (pueden ser para CRUD general, no para las nuevas rutas de cliente)
import { getCarritoByIdValidation, createCarritoValidation, updateCarritoValidation, deleteCarritoValidation } from "../middleware/carritoDeCompras";
// Importación de los nuevos middlewares de autenticación
import { authenticateToken, isClient } from "../middleware/AuthMiddleware";
import asyncHandler from 'express-async-handler'; // Importación añadida

const router = Router();

// --- Rutas Específicas para el Carrito del Cliente Autenticado ---
// Estas rutas requieren que el cliente esté autenticado

// GET /api/carritos/client-cart - Obtener el carrito del cliente autenticado
router.get(
    "/client-cart",
    authenticateToken, // Primero autenticar el token
    isClient,           // Luego verificar que sea un cliente
    asyncHandler(CarritoDeComprasController.getCart) // Envuelto con asyncHandler
);

// POST /api/carritos/add - Añadir un producto al carrito o incrementar su cantidad
router.post(
    "/add",
    authenticateToken,
    isClient,
    // Puedes añadir validaciones de `body` aquí si lo deseas (e.g., para productId y quantity)
    // body('productId').isInt().withMessage('Product ID must be an integer'),
    // body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
    // handleInputErrors,
    asyncHandler(CarritoDeComprasController.addToCart) // Envuelto con asyncHandler
);

// PUT /api/carritos/update/:productId - Actualizar la cantidad de un producto en el carrito
router.put(
    "/update/:productId",
    authenticateToken,
    isClient,
    // Puedes añadir validaciones de `param` y `body` aquí
    // param('productId').isInt().withMessage('Product ID must be an integer'),
    // body('newQuantity').isInt({ min: 0 }).withMessage('New quantity must be a non-negative integer'),
    // handleInputErrors,
    asyncHandler(CarritoDeComprasController.updateCartItem) // Envuelto con asyncHandler
);

// DELETE /api/carritos/remove/:productId - Eliminar un producto del carrito
router.delete(
    "/remove/:productId",
    authenticateToken,
    isClient,
    // Puedes añadir validaciones de `param` aquí
    // param('productId').isInt().withMessage('Product ID must be an integer'),
    // handleInputErrors,
    asyncHandler(CarritoDeComprasController.removeCartItem) // Envuelto con asyncHandler
);

// DELETE /api/carritos/clear - Vaciar completamente el carrito del cliente
router.delete(
    "/clear",
    authenticateToken,
    isClient,
    asyncHandler(CarritoDeComprasController.clearCart) // Envuelto con asyncHandler
);


// --- Rutas de CRUD Genéricas (Mantener si son para administración o propósitos generales) ---
// Estas rutas no están protegidas por el middleware `isClient` por defecto.
// Si deseas que también requieran autenticación de administrador, deberías añadir un middleware `isAdmin` similar.

router.get("/", asyncHandler(CarritoDeComprasController.getAll)); // Envuelto con asyncHandler

router.get(
    "/:id",
    getCarritoByIdValidation,
    handleInputErrors,
    asyncHandler(CarritoDeComprasController.getById) // Envuelto con asyncHandler
);

router.post(
    "/",
    createCarritoValidation,
    handleInputErrors,
    asyncHandler(CarritoDeComprasController.create) // Envuelto con asyncHandler
);

router.put(
    "/:id",
    updateCarritoValidation,
    handleInputErrors,
    asyncHandler(CarritoDeComprasController.updateById) // Envuelto con asyncHandler
);

router.delete(
    "/:id",
    deleteCarritoValidation,
    handleInputErrors,
    asyncHandler(CarritoDeComprasController.deleteById) // Envuelto con asyncHandler
);

export default router;
