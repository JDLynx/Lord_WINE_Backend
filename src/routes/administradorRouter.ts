import { Router } from "express";
import { AdministradorControllers } from "../controllers/AdministradorController";
import { handleInputErrors } from "../middleware/validation";
import { getAdministradorByIdValidation, createAdministradorValidation, updateAdministradorValidation, deleteAdministradorValidation, loginAdministradorValidation } from "../middleware/administrador";

const router = Router();

router.get("/", AdministradorControllers.getAdministradorAll);

router.get(
    "/:id",
    getAdministradorByIdValidation,
    handleInputErrors,
    AdministradorControllers.getAdministradorById
);

router.post(
    "/",
    createAdministradorValidation,
    handleInputErrors,
    AdministradorControllers.crearAdministrador
);

router.put(
    "/:id",
    updateAdministradorValidation,
    handleInputErrors,
    AdministradorControllers.actualizarAdministradorId
);

router.put(
    "/:id/cambiar-contrasena",
    handleInputErrors,
    AdministradorControllers.cambiarContrasena
);

router.delete(
    "/:id",
    deleteAdministradorValidation,
    handleInputErrors,
    AdministradorControllers.eliminarAdministradorId
);

router.post(
    "/login",
    loginAdministradorValidation,
    handleInputErrors,
    AdministradorControllers.loginAdministrador
);

export default router;