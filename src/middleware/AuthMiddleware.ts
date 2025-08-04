import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
      };
      clientCod?: number;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }

    req.user = user as { id: number; role: string };

    if (req.user.role === 'Cliente') {
      req.clientCod = req.user.id;
    }
    
    next();
  });
};

export const isClient = (req: Request, res: Response, next: NextFunction) => {
  if (!req.clientCod) {
    return res.status(403).json({ error: 'Acceso denegado: Se requiere un cliente autenticado.' });
  }
  next();
};