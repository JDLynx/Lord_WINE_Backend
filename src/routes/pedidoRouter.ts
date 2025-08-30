import { Router } from "express";
import { PedidoControllers } from "../controllers/PedidoController";
import { handleInputErrors } from "../middleware/validation";
import { 
    getPedidoByIdValidation, 
    createPedidoValidation, 
    updatePedidoValidation, 
    deletePedidoValidation, 
    createPedidoFromCartValidation 
} from "../middleware/pedido";
import { authenticateToken, isClient } from "../middleware/AuthMiddleware";

const router = Router();

router.use(authenticateToken);

router.get("/", PedidoControllers.getPedidosAll);

router.get("/:id",
    getPedidoByIdValidation,
    handleInputErrors,
    PedidoControllers.getPedidoById
);

router.post("/",
    isClient,
    createPedidoValidation,
    handleInputErrors,
    PedidoControllers.crearPedido
);

router.post("/crear-desde-carrito",
    isClient,
    createPedidoFromCartValidation,
    handleInputErrors,
    PedidoControllers.crearPedidoDesdeCarrito
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