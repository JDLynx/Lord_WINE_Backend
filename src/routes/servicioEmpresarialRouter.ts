import { Router } from "express";
import { ServicioEmpresarialController } from "../controllers/ServicioEmpresarialController";
import { handleInputErrors } from "../middleware/validation";
import { getServicioByIdValidation, createServicioValidation, updateServicioValidation, deleteServicioValidation } from "../middleware/servicioEmpresarial";

const router = Router();

router.get("/", ServicioEmpresarialController.getAll);

router.get("/:id",
  getServicioByIdValidation,
  handleInputErrors,
  ServicioEmpresarialController.getById
);

router.post("/",
  createServicioValidation,
  handleInputErrors,
  ServicioEmpresarialController.create
);

router.put("/:id",
  updateServicioValidation,
  handleInputErrors,
  ServicioEmpresarialController.update
);

router.delete("/:id",
  deleteServicioValidation,
  handleInputErrors,
  ServicioEmpresarialController.delete
);

export default router;