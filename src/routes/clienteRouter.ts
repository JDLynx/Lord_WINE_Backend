import { Router } from "express";
import { ClienteControllers } from "../controllers/ClienteController";
import { handleInputErrors } from "../middleware/validation";
import {
    getClienteByIdValidation,
    createClienteValidation,
    updateClienteValidation,
    deleteClienteValidation,
    loginClienteValidation
} from "../middleware/cliente";

const router = Router();

router.get("/", ClienteControllers.getClienteAll);

router.get("/:id",
    getClienteByIdValidation,
    handleInputErrors,
    ClienteControllers.getClienteById
);

router.post("/",
    createClienteValidation,
    handleInputErrors,
    ClienteControllers.crearCliente
);

router.put("/:id",
    updateClienteValidation,
    handleInputErrors,
    ClienteControllers.actualizarClienteId
);

router.delete("/:id",
    deleteClienteValidation,
    handleInputErrors,
    ClienteControllers.eliminarClienteId
);

router.post("/login",
    loginClienteValidation,
    handleInputErrors,
    ClienteControllers.loginCliente
);

router.put("/:id/cambiar-contrasena",
    handleInputErrors,
    ClienteControllers.changePassword
);

export default router;