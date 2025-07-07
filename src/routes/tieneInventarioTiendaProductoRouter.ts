import { Router } from "express";
import { TieneInventarioTiendaProductoController } from "../controllers/TieneInventarioTiendaProductoController";
import { handleInputErrors } from "../middleware/validation";
import {
    getTieneInventarioTiendaProductoValidation,
    createTieneInventarioTiendaProductoValidation,
    deleteTieneInventarioTiendaProductoValidation,
    updateTieneInventarioTiendaProductoValidation
} from "../middleware/tieneInventarioTiendaProducto";

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

router.put(
    "/:invTienIdInventarioTienda/:prodIdProducto",
    updateTieneInventarioTiendaProductoValidation,
    handleInputErrors,
    TieneInventarioTiendaProductoController.update
);

router.delete(
    "/:invTienIdInventarioTienda/:prodIdProducto",
    deleteTieneInventarioTiendaProductoValidation,
    handleInputErrors,
    TieneInventarioTiendaProductoController.deleteByIds
);

export default router;