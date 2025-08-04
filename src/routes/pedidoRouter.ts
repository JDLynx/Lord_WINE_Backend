import { Router } from "express";
import { PedidoControllers } from "../controllers/PedidoController";
import { handleInputErrors } from "../middleware/validation";
import { getPedidoByIdValidation, createPedidoValidation, updatePedidoValidation, deletePedidoValidation } from "../middleware/pedido";

const router = Router();

router.get("/", PedidoControllers.getPedidosAll);

router.get("/:id",
    getPedidoByIdValidation,
    handleInputErrors,
    PedidoControllers.getPedidoById
);

router.post("/",
    createPedidoValidation,
    handleInputErrors,
    PedidoControllers.crearPedido
);

router.put("/:id",
    updatePedidoValidation,
    handleInputErrors,
    PedidoControllers.actualizarPedidoId
);

router.delete("/:id",
    deletePedidoValidation,
    handleInputErrors,
    PedidoControllers.eliminarPedidoId
);

export default router;