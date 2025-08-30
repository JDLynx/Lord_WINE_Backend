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

// Aplica el middleware de autenticación a todas las rutas de este router
router.use(authenticateToken);

// Rutas GET protegidas
router.get("/", PedidoControllers.getPedidosAll);

router.get("/:id",
    getPedidoByIdValidation,
    handleInputErrors,
    PedidoControllers.getPedidoById
);

// Rutas POST para crear pedidos (protegidas y solo para clientes)
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

// Rutas PUT y DELETE (protegidas)
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