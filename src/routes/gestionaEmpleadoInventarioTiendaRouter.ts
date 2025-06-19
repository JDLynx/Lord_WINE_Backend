import { Router } from "express";
import { GestionaEmpleadoInventarioTiendaController } from "../controllers/GestionaEmpleadoInventarioTiendaController";
import { handleInputErrors } from "../middleware/validation";
import { getGestionaEmpleadoInventarioTiendaValidation, createGestionaEmpleadoInventarioTiendaValidation, deleteGestionaEmpleadoInventarioTiendaValidation } from "../middleware/gestionaEmpleadoInventarioTienda";

const router = Router();

router.get("/", GestionaEmpleadoInventarioTiendaController.getAll);

router.get(
    "/:emplCodEmpleado/:invTienIdInventarioTienda",
    getGestionaEmpleadoInventarioTiendaValidation,
    handleInputErrors,
    GestionaEmpleadoInventarioTiendaController.getByIds
);

router.post(
    "/",
    createGestionaEmpleadoInventarioTiendaValidation,
    handleInputErrors,
    GestionaEmpleadoInventarioTiendaController.create
);

router.delete(
    "/:emplCodEmpleado/:invTienIdInventarioTienda",
    deleteGestionaEmpleadoInventarioTiendaValidation,
    handleInputErrors,
    GestionaEmpleadoInventarioTiendaController.deleteByIds
);

export default router;