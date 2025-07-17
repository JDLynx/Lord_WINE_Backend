// src/middlewares/AuthMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Extender la interfaz Request de Express para incluir las propiedades de usuario
declare global {
  namespace Express {
    interface Request {
      user?: { // El ? indica que la propiedad es opcional
        id: number;
        role: string;
      };
      clientCod?: number; // Para almacenar específicamente el clCodCliente si el rol es Cliente
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Obtener el token de 'Bearer TOKEN'

  if (token == null) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Si el token es inválido o ha expirado
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }

    // Adjuntar el usuario decodificado a la solicitud
    req.user = user as { id: number; role: string };

    // Si el rol es 'Cliente', también adjuntar clCodCliente de forma específica
    if (req.user.role === 'Cliente') {
      req.clientCod = req.user.id;
    } else {
      // Si no es cliente, y estas rutas son solo para clientes, puedes enviar un 403
      // O simplemente pasar y dejar que el controlador decida.
      // Por ahora, solo adjuntamos clientCod si es un Cliente.
    }
    
    next(); // Pasar al siguiente middleware o controlador de ruta
  });
};

// Middleware para asegurar que la solicitud es de un cliente autenticado
export const isClient = (req: Request, res: Response, next: NextFunction) => {
  if (!req.clientCod) {
    return res.status(403).json({ error: 'Acceso denegado: Se requiere un cliente autenticado.' });
  }
  next();
};