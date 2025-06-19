import { Router } from "express";
import { DetallePedidoController } from "../controllers/DetallePedidoController";
import { handleInputErrors } from "../middleware/validation";
import { getDetallePedidoByIdValidation, createDetallePedidoValidation, updateDetallePedidoValidation, deleteDetallePedidoValidation } from "../middleware/detallePedido";

const router = Router();

router.get("/", DetallePedidoController.getAll);

router.get(
    "/:id",
    getDetallePedidoByIdValidation,
    handleInputErrors,
    DetallePedidoController.getById
);

router.post(
    "/",
    createDetallePedidoValidation,
    handleInputErrors,
    DetallePedidoController.create
);

router.put(
    "/:id",
    updateDetallePedidoValidation,
    handleInputErrors,
    DetallePedidoController.updateById
);

router.delete(
    "/:id",
    deleteDetallePedidoValidation,
    handleInputErrors,
    DetallePedidoController.deleteById
);

export default router;