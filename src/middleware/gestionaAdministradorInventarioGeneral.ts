import { body, param } from "express-validator";

export const getGestionaAdministradorInventarioGeneralValidation = [
    param("adminCodAdministrador").isInt({ min: 1 }),
    param("invGenIdInventarioGeneral").isInt({ min: 1 })
];

export const createGestionaAdministradorInventarioGeneralValidation = [
    body("adminCodAdministrador").isInt({ min: 1 }).notEmpty(),
    body("invGenIdInventarioGeneral").isInt({ min: 1 }).notEmpty()
];

export const deleteGestionaAdministradorInventarioGeneralValidation = [
    param("adminCodAdministrador").isInt({ min: 1 }),
    param("invGenIdInventarioGeneral").isInt({ min: 1 })
];