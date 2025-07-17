// src/types/express/index.d.ts
import { JwtPayload as DefaultJwtPayload } from "jsonwebtoken"; // Importación existente

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                role: string; // CORREGIDO: 'rol' a 'role' para coincidir con el middleware y controlador
            };
            clientCod?: number; // AÑADIDO: Propiedad para el ID del cliente autenticado
        }
    }
}
