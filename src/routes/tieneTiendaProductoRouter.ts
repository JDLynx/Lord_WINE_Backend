import { Router } from "express";
import { TieneTiendaProductoController } from "../controllers/TieneTiendaProductoController";
import { handleInputErrors } from "../middleware/validation";
import { getTieneTiendaProductoValidation, createTieneTiendaProductoValidation, deleteTieneTiendaProductoValidation } from "../middleware/tieneTiendaProducto";

const router = Router();

router.get("/", TieneTiendaProductoController.getAll);

router.get(
    "/:prodIdProducto/:tiendIdTiendaFisica",
    getTieneTiendaProductoValidation,
    handleInputErrors,
    TieneTiendaProductoController.getByIds
);

router.post(
    "/",
    createTieneTiendaProductoValidation,
    handleInputErrors,
    TieneTiendaProductoController.create
);

router.delete(
    "/:prodIdProducto/:tiendIdTiendaFisica",
    deleteTieneTiendaProductoValidation,
    handleInputErrors,
    TieneTiendaProductoController.deleteByIds
);

export default router;