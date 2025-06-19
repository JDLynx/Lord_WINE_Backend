import { Router } from "express";
import { CarritoDeComprasController } from "../controllers/CarritoDeComprasController";
import { handleInputErrors } from "../middleware/validation";
import { getCarritoByIdValidation, createCarritoValidation, updateCarritoValidation, deleteCarritoValidation } from "../middleware/carritoDeCompras";

const router = Router();

router.get("/", CarritoDeComprasController.getAll);

router.get(
    "/:id",
    getCarritoByIdValidation,
    handleInputErrors,
    CarritoDeComprasController.getById
);

router.post(
    "/",
    createCarritoValidation,
    handleInputErrors,
    CarritoDeComprasController.create
);

router.put(
    "/:id",
    updateCarritoValidation,
    handleInputErrors,
    CarritoDeComprasController.updateById
);

router.delete(
    "/:id",
    deleteCarritoValidation,
    handleInputErrors,
    CarritoDeComprasController.deleteById
);

export default router;