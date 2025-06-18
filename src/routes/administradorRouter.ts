// administradorRouter.ts
// Importa Router para definir rutas
import { Router } from "express";
// Controladores del Administrador
import { AdministradorControllers } from "../controllers/AdministradorController";
// Middleware para manejar errores de validación
import { handleInputErrors } from "../middleware/validation";
// Importa las validaciones desde el nuevo archivo de middleware
import { getAdministradorByIdValidation, createAdministradorValidation, updateAdministradorValidation, deleteAdministradorValidation, loginAdministradorValidation } from "../middleware/administrador";

// Instancia del enrutador
const router = Router();

// ───────────────────────────────────────────────
// Obtener todos los administradores
router.get("/", AdministradorControllers.getAdministradorAll);

// ───────────────────────────────────────────────
// Obtener un administrador por su ID
router.get("/:id",
    getAdministradorByIdValidation, // Middleware de validación
    handleInputErrors,
    AdministradorControllers.getAdministradorById
);

// ───────────────────────────────────────────────
// Crear un nuevo administrador
router.post("/",
    createAdministradorValidation, // Middleware de validación
    handleInputErrors,
    AdministradorControllers.crearAdministrador
);

// ───────────────────────────────────────────────
// Actualizar un administrador por ID
router.put("/:id",
    updateAdministradorValidation, // Middleware de validación
    handleInputErrors,
    AdministradorControllers.actualizarAdministradorId
);

// ───────────────────────────────────────────────
// Eliminar un administrador por ID
router.delete("/:id",
    deleteAdministradorValidation, // Middleware de validación
    handleInputErrors,
    AdministradorControllers.eliminarAdministradorId
);

// ───────────────────────────────────────────────
// Login de administrador
router.post("/login",
    loginAdministradorValidation, // Middleware de validación
    handleInputErrors,
    AdministradorControllers.loginAdministrador
);

// ───────────────────────────────────────────────
// Exporta el enrutador
export default router;