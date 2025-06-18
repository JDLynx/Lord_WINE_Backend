import { Router } from "express";
import { PedidoControllers } from "../controllers/PedidoController";
import { handleInputErrors } from "../middleware/validation";
import { getPedidoByIdValidation, createPedidoValidation, updatePedidoValidation, deletePedidoValidation } from "../middleware/pedido";

const router = Router();

// Obtener todos
router.get("/", PedidoControllers.getPedidosAll);

// Obtener por ID
router.get("/:id",
    getPedidoByIdValidation,
    handleInputErrors,
    PedidoControllers.getPedidoById
);

// Crear
router.post("/",
    createPedidoValidation,
    handleInputErrors,
    PedidoControllers.crearPedido
);

// Actualizar
router.put("/:id",
    updatePedidoValidation,
    handleInputErrors,
    PedidoControllers.actualizarPedidoId
);

// Eliminar
router.delete("/:id",
    deletePedidoValidation,
    handleInputErrors,
    PedidoControllers.eliminarPedidoId
);

export default router;