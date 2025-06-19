import { Router } from "express";
import { ProductoController } from "../controllers/ProductoController";
import { handleInputErrors } from "../middleware/validation";
import { getProductoByIdValidation, createProductoValidation, updateProductoValidation, deleteProductoValidation } from "../middleware/producto";

const router = Router();

router.get("/", ProductoController.getAll);

router.get(
    "/:id",
    getProductoByIdValidation,
    handleInputErrors,
    ProductoController.getById
);

router.post(
    "/",
    createProductoValidation,
    handleInputErrors,
    ProductoController.create
);

router.put(
    "/:id",
    updateProductoValidation,
    handleInputErrors,
    ProductoController.updateById
);

router.delete(
    "/:id",
    deleteProductoValidation,
    handleInputErrors,
    ProductoController.deleteById
);

export default router;