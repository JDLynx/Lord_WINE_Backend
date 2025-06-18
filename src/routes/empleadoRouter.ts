import { Router } from 'express';
import { EmpleadoControllers } from '../controllers/EmpleadoController';
import { handleInputErrors } from '../middleware/validation';
import { createEmpleadoValidation, updateEmpleadoValidation, deleteEmpleadoValidation, getEmpleadoByIdValidation } from '../middleware/empleado';

const router = Router();

// Listar todos los empleados
router.get('/', EmpleadoControllers.getEmpleados);

// Obtener un empleado por ID
router.get('/:id',
    getEmpleadoByIdValidation,
    handleInputErrors,
    EmpleadoControllers.getEmpleadoById
);

// Crear un empleado
router.post('/',
    createEmpleadoValidation,
    handleInputErrors,
    EmpleadoControllers.crearEmpleado
);

// Actualizar un empleado
router.put('/:id',
    updateEmpleadoValidation,
    handleInputErrors,
    EmpleadoControllers.actualizarEmpleado
);

// Eliminar un empleado
router.delete('/:id',
    deleteEmpleadoValidation,
    handleInputErrors,
    EmpleadoControllers.eliminarEmpleado
);

export default router;