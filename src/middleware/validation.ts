// middleware/validation.ts
import { Request, Response, NextFunction } from 'express';  // Importa tipos para manejar peticiones y middleware
import { validationResult } from 'express-validator';  // Función para obtener resultados de las validaciones
// Middleware para manejar errores de validación en las peticiones
export const handleInputErrors = (req: Request, res: Response, next: NextFunction): void =>
{
    // Extrae los errores de validación acumulados por express-validator
    const errors = validationResult(req);
    // Si hay errores, responde con código 400 y un JSON con los errores
    if (!errors.isEmpty())
    {
        res.status(400).json({ errors: errors.array() });
        return; // <- importante para evitar que el flujo continúe si hay errores
    }
    // Si no hay errores, pasa al siguiente middleware o controlador
    next();
};