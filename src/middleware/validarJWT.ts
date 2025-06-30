// middlewares/validarJWT.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Interfaz para agregar "user" al objeto Request
interface JwtPayload {
    id: number;
    rol: string;
}

export const validarJWT = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        res.status(401).json({ error: "Token no proporcionado" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.user = decoded; // Agregamos el usuario decodificado a la request
        next(); // Continua hacia el controlador
    } catch (error) {
        res.status(401).json({ error: "Token inválido o expirado" });
    }
};