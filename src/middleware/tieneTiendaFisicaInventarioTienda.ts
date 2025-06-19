import { body, param } from "express-validator";

export const getTieneTiendaFisicaInventarioTiendaValidation = [
    param("tiendIdTiendaFisica").isInt({ min: 1 }),
    param("invTienIdInventarioTienda").isInt({ min: 1 })
];

export const createTieneTiendaFisicaInventarioTiendaValidation = [
    body("tiendIdTiendaFisica").isInt({ min: 1 }).notEmpty(),
    body("invTienIdInventarioTienda").isInt({ min: 1 }).notEmpty()
];

export const deleteTieneTiendaFisicaInventarioTiendaValidation = [
    param("tiendIdTiendaFisica").isInt({ min: 1 }),
    param("invTienIdInventarioTienda").isInt({ min: 1 })
];