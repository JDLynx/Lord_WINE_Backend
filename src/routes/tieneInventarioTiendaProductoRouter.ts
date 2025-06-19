import { Router } from "express";
import { TieneInventarioTiendaProductoController } from "../controllers/TieneInventarioTiendaProductoController";
import { handleInputErrors } from "../middleware/validation";
import { getTieneInventarioTiendaProductoValidation, createTieneInventarioTiendaProductoValidation, deleteTieneInventarioTiendaProductoValidation } from "../middleware/tieneInventarioTiendaProducto";

const router = Router();

router.get("/", TieneInventarioTiendaProductoController.getAll);

router.get(
    "/:invTienIdInventarioTienda/:prodIdProducto",
    getTieneInventarioTiendaProductoValidation,
    handleInputErrors,
    TieneInventarioTiendaProductoController.getByIds
);

router.post(
    "/",
    createTieneInventarioTiendaProductoValidation,
    handleInputErrors,
    TieneInventarioTiendaProductoController.create
);

router.delete(
    "/:invTienIdInventarioTienda/:prodIdProducto",
    deleteTieneInventarioTiendaProductoValidation,
    handleInputErrors,
    TieneInventarioTiendaProductoController.deleteByIds
);

export default router;