import { Router } from "express";
import { CarritoDeComprasController } from "../controllers/CarritoDeComprasController";
import { handleInputErrors } from "../middleware/validation";
import { getCarritoByIdValidation, createCarritoValidation, updateCarritoValidation, deleteCarritoValidation } from "../middleware/carritoDeCompras";
import { authenticateToken, isClient } from "../middleware/AuthMiddleware";
import asyncHandler from 'express-async-handler';

const router = Router();

router.get(
    "/client-cart",
    authenticateToken,
    isClient,
    asyncHandler(CarritoDeComprasController.getCart)
);

router.post(
    "/add",
    authenticateToken,
    isClient,
    asyncHandler(CarritoDeComprasController.addToCart)
);

router.put(
    "/update/:productId",
    authenticateToken,
    isClient,
    asyncHandler(CarritoDeComprasController.updateCartItem)
);

router.delete(
    "/remove/:productId",
    authenticateToken,
    isClient,
    asyncHandler(CarritoDeComprasController.removeCartItem)
);

router.delete(
    "/clear",
    authenticateToken,
    isClient,
    asyncHandler(CarritoDeComprasController.clearCart)
);


router.get("/", asyncHandler(CarritoDeComprasController.getAll));

router.get(
    "/:id",
    getCarritoByIdValidation,
    handleInputErrors,
    asyncHandler(CarritoDeComprasController.getById)
);

router.post(
    "/",
    createCarritoValidation,
    handleInputErrors,
    asyncHandler(CarritoDeComprasController.create)
);

router.put(
    "/:id",
    updateCarritoValidation,
    handleInputErrors,
    asyncHandler(CarritoDeComprasController.updateById)
);

router.delete(
    "/:id",
    deleteCarritoValidation,
    handleInputErrors,
    asyncHandler(CarritoDeComprasController.deleteById)
);

export default router;
