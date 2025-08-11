import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: number;
    role: string; 
}

export const validarJWT = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        res.status(401).json({ error: "Token no proporcionado" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Token inválido o expirado" });
    }
};