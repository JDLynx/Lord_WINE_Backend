import { Router } from "express";
import { TrabajaEmpleadoTiendaFisicaController } from "../controllers/TrabajaEmpleadoTiendaFisicaController";
import { handleInputErrors } from "../middleware/validation";
import {
    getTrabajaEmpleadoTiendaFisicaValidation,
    createTrabajaEmpleadoTiendaFisicaValidation,
    deleteTrabajaEmpleadoTiendaFisicaValidation
} from "../middleware/trabajaEmpleadoTiendaFisica";

const router = Router();

router.get("/", TrabajaEmpleadoTiendaFisicaController.getAll);

router.get(
    "/:emplCodEmpleado/:tiendIdTiendaFisica",
    getTrabajaEmpleadoTiendaFisicaValidation,
    handleInputErrors,
    TrabajaEmpleadoTiendaFisicaController.getByIds
);

router.post(
    "/",
    createTrabajaEmpleadoTiendaFisicaValidation,
    handleInputErrors,
    TrabajaEmpleadoTiendaFisicaController.create
);

router.delete(
    "/:emplCodEmpleado/:tiendIdTiendaFisica",
    deleteTrabajaEmpleadoTiendaFisicaValidation,
    handleInputErrors,
    TrabajaEmpleadoTiendaFisicaController.deleteByIds
);

export default router;