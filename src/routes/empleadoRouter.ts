import { Router } from 'express';
import { EmpleadoController } from '../controllers/EmpleadoController';
import { handleInputErrors } from '../middleware/validation';
import { createEmpleadoValidation, updateEmpleadoValidation, deleteEmpleadoValidation, getEmpleadoByIdValidation } from '../middleware/empleado';

const router = Router();

router.get('/',
    EmpleadoController.getAll
);

router.get('/:id',
    getEmpleadoByIdValidation,
    handleInputErrors,
    EmpleadoController.getById
);

router.post('/',
    createEmpleadoValidation,
    handleInputErrors,
    EmpleadoController.create
);

router.put('/:id',
    updateEmpleadoValidation,
    handleInputErrors,
    EmpleadoController.update
);

router.delete('/:id',
    deleteEmpleadoValidation,
    handleInputErrors,
    EmpleadoController.delete
);

router.put('/:id/cambiar-contrasena',
    EmpleadoController.cambiarContrasena
);

export default router;