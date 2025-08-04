import { Router } from "express";
import { ProductoController } from "../controllers/ProductoController";
import { handleInputErrors } from "../middleware/validation";
import { getProductoByIdValidation, createProductoValidation, updateProductoValidation, deleteProductoValidation } from "../middleware/producto";
import asyncHandler from 'express-async-handler';

const router = Router();

router.get("/", asyncHandler(ProductoController.getAll));

router.get(
    "/:id",
    getProductoByIdValidation,
    handleInputErrors,
    asyncHandler(ProductoController.getById)
);

router.post(
    "/",
    createProductoValidation,
    handleInputErrors,
    asyncHandler(ProductoController.create)
);

router.put(
    "/:id",
    updateProductoValidation,
    handleInputErrors,
    asyncHandler(ProductoController.updateById)
);

router.delete(
    "/:id",
    deleteProductoValidation,
    handleInputErrors,
    asyncHandler(ProductoController.deleteById)
);

export default router;