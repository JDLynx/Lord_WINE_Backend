import { Router } from "express";
import { GestionaAdministradorInventarioGeneralController } from "../controllers/GestionaAdministradorInventarioGeneralController";
import { handleInputErrors } from "../middleware/validation";
import { getGestionaAdministradorInventarioGeneralValidation, createGestionaAdministradorInventarioGeneralValidation, deleteGestionaAdministradorInventarioGeneralValidation } from "../middleware/gestionaAdministradorInventarioGeneral";

const router = Router();

router.get("/", GestionaAdministradorInventarioGeneralController.getAll);

router.get(
    "/:adminCodAdministrador/:invGenIdInventarioGeneral",
    getGestionaAdministradorInventarioGeneralValidation,
    handleInputErrors,
    GestionaAdministradorInventarioGeneralController.getByIds
);

router.post(
    "/",
    createGestionaAdministradorInventarioGeneralValidation,
    handleInputErrors,
    GestionaAdministradorInventarioGeneralController.create
);

router.delete(
    "/:adminCodAdministrador/:invGenIdInventarioGeneral",
    deleteGestionaAdministradorInventarioGeneralValidation,
    handleInputErrors,
    GestionaAdministradorInventarioGeneralController.deleteByIds
);

export default router;