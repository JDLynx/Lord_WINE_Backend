import { Router } from "express";
import { InventarioGeneralController } from "../controllers/InventarioGeneralController";
import { handleInputErrors } from "../middleware/validation";
import { getInventarioGeneralByIdValidation, createInventarioGeneralValidation, updateInventarioGeneralValidation, deleteInventarioGeneralValidation } from "../middleware/inventarioGeneral";

const router = Router();

router.get("/", InventarioGeneralController.getAll);

router.get(
    "/:id",
    getInventarioGeneralByIdValidation,
    handleInputErrors,
    InventarioGeneralController.getById
);

router.post(
    "/",
    createInventarioGeneralValidation,
    handleInputErrors,
    InventarioGeneralController.create
);

router.put(
    "/:id",
    updateInventarioGeneralValidation,
    handleInputErrors,
    InventarioGeneralController.updateById
);

router.delete(
    "/:id",
    deleteInventarioGeneralValidation,
    handleInputErrors,
    InventarioGeneralController.deleteById
);

export default router;