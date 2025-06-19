import { Router } from "express";
import { InventarioTiendaController } from "../controllers/InventarioTiendaController";
import { handleInputErrors } from "../middleware/validation";
import { getInventarioTiendaByIdValidation, createInventarioTiendaValidation, updateInventarioTiendaValidation, deleteInventarioTiendaValidation } from "../middleware/inventarioTienda";

const router = Router();

router.get("/", InventarioTiendaController.getAll);

router.get(
    "/:id",
    getInventarioTiendaByIdValidation,
    handleInputErrors,
    InventarioTiendaController.getById
);

router.post(
    "/",
    createInventarioTiendaValidation,
    handleInputErrors,
    InventarioTiendaController.create
);

router.put(
    "/:id",
    updateInventarioTiendaValidation,
    handleInputErrors,
    InventarioTiendaController.updateById
);

router.delete(
    "/:id",
    deleteInventarioTiendaValidation,
    handleInputErrors,
    InventarioTiendaController.deleteById
);

export default router;