import { Router } from "express";
import { body, param } from "express-validator";
import { AdministradorControllers } from "../controllers/AdministradorController";
import { handleInputErrors } from "../middleware/validation";
import Administrador from "../models/administrador";

const router = Router();

router.get("/", AdministradorControllers.getAdministradorAll);

router.get("/:id",
  param("id").isInt().withMessage("ID no válido").custom((value) => value > 0).withMessage("ID no válido"),
  handleInputErrors,
  AdministradorControllers.getAdministradorById
);

router.post("/",
  body("adminIdAdministrador")
    .notEmpty()
    .withMessage("El ID del administrador no puede estar vacío")
    .custom(async (value) => {
      const exists = await Administrador.findOne({ where: { adminIdAdministrador: value } });
      if (exists)
      {
        throw new Error("El ID del administrador ya está registrado");
      }
      return true;
    }),
  body("adminNombre").notEmpty().withMessage("El nombre es obligatorio").isLength({ max: 50 }),
  body("adminDireccion").notEmpty().withMessage("La dirección es obligatoria").isLength({ max: 50 }),
  body("adminTelefono").notEmpty().withMessage("El teléfono es obligatorio").isLength({ max: 50 }),
  body("adminCorreoElectronico")
    .notEmpty()
    .withMessage("El correo electrónico es obligatorio")
    .isEmail()
    .withMessage("Formato de correo inválido")
    .custom(async (value) =>
    {
      const exists = await Administrador.findOne({ where: { adminCorreoElectronico: value } });
      if (exists)
      {
        throw new Error("El correo electrónico ya está registrado");
      }
      return true;
    }),
    body("adminContrasena")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 4 })
    .withMessage("La contraseña debe tener al menos 4 caracteres"),
  handleInputErrors,
  AdministradorControllers.crearAdministrador
);

router.put("/:id",
  body("adminIdAdministrador").notEmpty().withMessage("El ID del administrador es obligatorio"),
  body("adminNombre").notEmpty().withMessage("El nombre es obligatorio").isLength({ max: 50 }),
  body("adminDireccion").notEmpty().withMessage("La dirección es obligatoria").isLength({ max: 50 }),
  body("adminTelefono").notEmpty().withMessage("El teléfono es obligatorio").isLength({ max: 50 }),
  body("adminCorreoElectronico").notEmpty().withMessage("El correo electrónico es obligatorio").isEmail().withMessage("Formato de correo inválido"),
  body("adminContrasena").optional().isLength({ min: 4 }).withMessage("La contraseña debe tener al menos 4 caracteres"),
  handleInputErrors,
  AdministradorControllers.actualizarAdministradorId
);

router.delete(
  "/:id",
  param("id").isInt().withMessage("ID no válido").custom((value) => value > 0).withMessage("ID no válido"),
  handleInputErrors,
  AdministradorControllers.eliminarAdministradorId
);

router.post(
  "/login",
  body("correo").notEmpty().withMessage("El correo es obligatorio").isEmail().withMessage("Correo inválido"),
  body("contrasena").notEmpty().withMessage("La contraseña es obligatoria"),
  handleInputErrors,
  AdministradorControllers.loginAdministrador
);


export default router;