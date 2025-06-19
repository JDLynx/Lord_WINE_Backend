import { Router } from "express";
import { TieneTiendaFisicaInventarioTiendaController } from "../controllers/TieneTiendaFisicaInventarioTiendaController";
import { handleInputErrors } from "../middleware/validation";
import { getTieneTiendaFisicaInventarioTiendaValidation, createTieneTiendaFisicaInventarioTiendaValidation, deleteTieneTiendaFisicaInventarioTiendaValidation } from "../middleware/tieneTiendaFisicaInventarioTienda";

const router = Router();

router.get("/", TieneTiendaFisicaInventarioTiendaController.getAll);

router.get(
    "/:tiendIdTiendaFisica/:invTienIdInventarioTienda",
    getTieneTiendaFisicaInventarioTiendaValidation,
    handleInputErrors,
    TieneTiendaFisicaInventarioTiendaController.getByIds
);

router.post(
    "/",
    createTieneTiendaFisicaInventarioTiendaValidation,
    handleInputErrors,
    TieneTiendaFisicaInventarioTiendaController.create
);

router.delete(
    "/:tiendIdTiendaFisica/:invTienIdInventarioTienda",
    deleteTieneTiendaFisicaInventarioTiendaValidation,
    handleInputErrors,
    TieneTiendaFisicaInventarioTiendaController.deleteByIds
);

export default router;