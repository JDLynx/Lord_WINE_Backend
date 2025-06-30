import { JwtPayload as DefaultJwtPayload } from "jsonwebtoken"; //Import

declare global {
    namespace Express {
        interface Request {
        user?: {
            id: number;
            rol: string;
        };
        }
    }
}