// src/routes/productoRouter.ts
import { Router } from "express";
import { ProductoController } from "../controllers/ProductoController";
import { handleInputErrors } from "../middleware/validation";
import { getProductoByIdValidation, createProductoValidation, updateProductoValidation, deleteProductoValidation } from "../middleware/producto";
import asyncHandler from 'express-async-handler'; // Importar asyncHandler

const router = Router();

router.get("/", asyncHandler(ProductoController.getAll)); // Envuelto con asyncHandler

router.get(
    "/:id",
    getProductoByIdValidation,
    handleInputErrors,
    asyncHandler(ProductoController.getById) // Envuelto con asyncHandler
);

router.post(
    "/",
    createProductoValidation,
    handleInputErrors,
    asyncHandler(ProductoController.create) // Envuelto con asyncHandler
);

router.put(
    "/:id",
    updateProductoValidation,
    handleInputErrors,
    asyncHandler(ProductoController.updateById) // Envuelto con asyncHandler
);

router.delete(
    "/:id",
    deleteProductoValidation,
    handleInputErrors,
    asyncHandler(ProductoController.deleteById) // Envuelto con asyncHandler
);

export default router;
