import { Router } from "express";
import { TieneDetalleProductoController } from "../controllers/TieneDetalleProductoController";
import { handleInputErrors } from "../middleware/validation";
import {
    getTieneDetalleProductoValidation,
    createTieneDetalleProductoValidation,
    deleteTieneDetalleProductoValidation
} from "../middleware/tieneDetalleProducto";

const router = Router();

router.get("/", TieneDetalleProductoController.getAll);

router.get(
    "/:detIdDetalleCarrito/:prodIdProducto",
    getTieneDetalleProductoValidation,
    handleInputErrors,
    TieneDetalleProductoController.getByIds
);

router.post(
    "/",
    createTieneDetalleProductoValidation,
    handleInputErrors,
    TieneDetalleProductoController.create
);

router.delete(
    "/:detIdDetalleCarrito/:prodIdProducto",
    deleteTieneDetalleProductoValidation,
    handleInputErrors,
    TieneDetalleProductoController.deleteByIds
);

export default router;