import { Router } from "express";
import { AdministradorControllers } from "../controllers/AdministradorController";
import { handleInputErrors } from "../middleware/validation";
import { getAdministradorByIdValidation, createAdministradorValidation, updateAdministradorValidation, deleteAdministradorValidation, loginAdministradorValidation } from "../middleware/administrador";

// Crea una instancia del enrutador para agrupar las rutas relacionadas con administradores
const router = Router();

// Ruta para obtener todos los administradores registrados
router.get("/", AdministradorControllers.getAdministradorAll);

// Ruta para obtener un administrador específico por su ID
router.get(
    "/:id",
  getAdministradorByIdValidation, // Validación del parámetro ID
  handleInputErrors,              // Manejo de errores de validación
    AdministradorControllers.getAdministradorById
);

// Ruta para registrar un nuevo administrador en la base de datos
router.post(
    "/",
  createAdministradorValidation,  // Validación de los datos del administrador
    handleInputErrors,
    AdministradorControllers.crearAdministrador
);

// Ruta para actualizar los datos de un administrador existente
router.put(
    "/:id",
  updateAdministradorValidation,  // Validación de los campos modificables
    handleInputErrors,
    AdministradorControllers.actualizarAdministradorId
);

// Ruta para eliminar un administrador a partir de su ID
router.delete(
    "/:id",
  deleteAdministradorValidation,  // Validación del parámetro ID
    handleInputErrors,
    AdministradorControllers.eliminarAdministradorId
);

// Ruta para autenticar a un administrador con su correo y contraseña
router.post(
    "/login",
  loginAdministradorValidation,   // Validación de credenciales
    handleInputErrors,
    AdministradorControllers.loginAdministrador
);

// Exporta el enrutador para ser usado en el archivo principal de rutas
export default router;