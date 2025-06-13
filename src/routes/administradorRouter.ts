// Importa Router para definir rutas, y validadores para los datos de entrada
import { Router } from "express";
import { body, param } from "express-validator";

// Controladores del Administrador
import { AdministradorControllers } from "../controllers/AdministradorController";

// Middleware para manejar errores de validación
import { handleInputErrors } from "../middleware/validation";

// Modelo para comprobaciones únicas (email e ID)
import Administrador from "../models/administrador";

// Instancia del enrutador
const router = Router();

// ───────────────────────────────────────────────
// Obtener todos los administradores
router.get("/", AdministradorControllers.getAdministradorAll);

// ───────────────────────────────────────────────
// Obtener un administrador por su ID
router.get("/:id",
  param("id").isInt().withMessage("ID no válido")                      // Valida que el ID sea un entero
               .custom((value) => value > 0).withMessage("ID no válido"), // Y mayor a cero
  handleInputErrors,                                                  // Maneja errores si existen
  AdministradorControllers.getAdministradorById
);

// ───────────────────────────────────────────────
// Crear un nuevo administrador
router.post("/",
  // Valida que el ID del admin no esté vacío ni repetido
  body("adminIdAdministrador")
    .notEmpty().withMessage("El ID del administrador no puede estar vacío")
    .custom(async (value) =>
    {
      const exists = await Administrador.findOne({ where: { adminIdAdministrador: value } });
      if (exists) throw new Error("El ID del administrador ya está registrado");
      return true;
    }),
  // Valida nombre, dirección, teléfono (no vacíos y máximo 50 caracteres)
  body("adminNombre").notEmpty().withMessage("El nombre es obligatorio").isLength({ max: 50 }),
  body("adminDireccion").notEmpty().withMessage("La dirección es obligatoria").isLength({ max: 50 }),
  body("adminTelefono").notEmpty().withMessage("El teléfono es obligatorio").isLength({ max: 50 }),
  // Valida correo electrónico (único y con formato)
  body("adminCorreoElectronico")
    .notEmpty().withMessage("El correo electrónico es obligatorio")
    .isEmail().withMessage("Formato de correo inválido")
    .custom(async (value) =>
    {
      const exists = await Administrador.findOne({ where: { adminCorreoElectronico: value } });
      if (exists) throw new Error("El correo electrónico ya está registrado");
      return true;
    }),
  // Valida que la contraseña tenga mínimo 4 caracteres
  body("adminContrasena")
    .notEmpty().withMessage("La contraseña es obligatoria")
    .isLength({ min: 4 }).withMessage("La contraseña debe tener al menos 4 caracteres"),
  handleInputErrors,
  AdministradorControllers.crearAdministrador
);

// ───────────────────────────────────────────────
// Actualizar un administrador por ID
router.put("/:id",
  body("adminIdAdministrador").notEmpty().withMessage("El ID del administrador es obligatorio"),
  body("adminNombre").notEmpty().withMessage("El nombre es obligatorio").isLength({ max: 50 }),
  body("adminDireccion").notEmpty().withMessage("La dirección es obligatoria").isLength({ max: 50 }),
  body("adminTelefono").notEmpty().withMessage("El teléfono es obligatorio").isLength({ max: 50 }),
  body("adminCorreoElectronico")
    .notEmpty().withMessage("El correo electrónico es obligatorio")
    .isEmail().withMessage("Formato de correo inválido"),
  // La contraseña puede ser opcional pero debe cumplir mínimo si se envía
  body("adminContrasena").optional().isLength({ min: 4 }).withMessage("La contraseña debe tener al menos 4 caracteres"),
  handleInputErrors,
  AdministradorControllers.actualizarAdministradorId
);

// ───────────────────────────────────────────────
// Eliminar un administrador por ID
router.delete("/:id",
  param("id").isInt().withMessage("ID no válido").custom((value) => value > 0).withMessage("ID no válido"),
  handleInputErrors,
  AdministradorControllers.eliminarAdministradorId
);

// ───────────────────────────────────────────────
// Login de administrador
router.post("/login",
  body("correo").notEmpty().withMessage("El correo es obligatorio").isEmail().withMessage("Correo inválido"),
  body("contrasena").notEmpty().withMessage("La contraseña es obligatoria"),
  handleInputErrors,
  AdministradorControllers.loginAdministrador
);

// ───────────────────────────────────────────────
// Exporta el enrutador
export default router;