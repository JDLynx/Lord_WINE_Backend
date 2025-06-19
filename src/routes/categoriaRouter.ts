import { Router } from "express";
import { CategoriaController } from "../controllers/CategoriaController";
import { handleInputErrors } from "../middleware/validation";
import { getCategoriaByIdValidation, createCategoriaValidation, updateCategoriaValidation, deleteCategoriaValidation } from "../middleware/categoria";

const router = Router();

router.get("/", CategoriaController.getAll);

router.get(
    "/:id",
    getCategoriaByIdValidation,
    handleInputErrors,
    CategoriaController.getById
);

router.post(
    "/",
    createCategoriaValidation,
    handleInputErrors,
    CategoriaController.create
);

router.put(
    "/:id",
    updateCategoriaValidation,
    handleInputErrors,
    CategoriaController.updateById
);

router.delete(
    "/:id",
    deleteCategoriaValidation,
    handleInputErrors,
    CategoriaController.deleteById
);

export default router;