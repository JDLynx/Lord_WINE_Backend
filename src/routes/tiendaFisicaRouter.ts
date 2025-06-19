import { Router } from "express";
import { TiendaFisicaController } from "../controllers/TiendaFisicaController";
import { handleInputErrors } from "../middleware/validation";
import { getTiendaFisicaByIdValidation, createTiendaFisicaValidation, updateTiendaFisicaValidation, deleteTiendaFisicaValidation } from "../middleware/tiendaFisica";

const router = Router();

router.get("/", TiendaFisicaController.getAll);

router.get(
    "/:id",
    getTiendaFisicaByIdValidation,
    handleInputErrors,
    TiendaFisicaController.getById
);

router.post(
    "/",
    createTiendaFisicaValidation,
    handleInputErrors,
    TiendaFisicaController.create
);

router.put(
    "/:id",
    updateTiendaFisicaValidation,
    handleInputErrors,
    TiendaFisicaController.updateById
);

router.delete(
    "/:id",
    deleteTiendaFisicaValidation,
    handleInputErrors,
    TiendaFisicaController.deleteById
);

export default router;