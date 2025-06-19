import { Router } from "express";
import { TieneClienteCarritoDeComprasController } from "../controllers/TieneClienteCarritoDeComprasController";
import { handleInputErrors } from "../middleware/validation";
import { getTieneClienteCarritoDeComprasValidation, createTieneClienteCarritoDeComprasValidation, deleteTieneClienteCarritoDeComprasValidation } from "../middleware/tieneClienteCarritoDeCompras";

const router = Router();

router.get("/", TieneClienteCarritoDeComprasController.getAll);

router.get(
    "/:clCodCliente/:carIdCarritoDeCompras",
    getTieneClienteCarritoDeComprasValidation,
    handleInputErrors,
    TieneClienteCarritoDeComprasController.getByIds
);

router.post(
    "/",
    createTieneClienteCarritoDeComprasValidation,
    handleInputErrors,
    TieneClienteCarritoDeComprasController.create
);

router.delete(
    "/:clCodCliente/:carIdCarritoDeCompras",
    deleteTieneClienteCarritoDeComprasValidation,
    handleInputErrors,
    TieneClienteCarritoDeComprasController.deleteByIds
);

export default router;