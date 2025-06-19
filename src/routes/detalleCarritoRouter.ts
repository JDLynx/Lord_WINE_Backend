import { Router } from "express";
import { DetalleCarritoController } from "../controllers/DetalleCarritoController";
import { handleInputErrors } from "../middleware/validation";
import { getDetalleCarritoByIdValidation, createDetalleCarritoValidation, updateDetalleCarritoValidation, deleteDetalleCarritoValidation } from "../middleware/detalleCarrito";

const router = Router();

router.get("/", DetalleCarritoController.getAll);

router.get(
    "/:id",
    getDetalleCarritoByIdValidation,
    handleInputErrors,
    DetalleCarritoController.getById
);

router.post(
    "/",
    createDetalleCarritoValidation,
    handleInputErrors,
    DetalleCarritoController.create
);

router.put(
    "/:id",
    updateDetalleCarritoValidation,
    handleInputErrors,
    DetalleCarritoController.updateById
);

router.delete(
    "/:id",
    deleteDetalleCarritoValidation,
    handleInputErrors,
    DetalleCarritoController.deleteById
);

export default router;