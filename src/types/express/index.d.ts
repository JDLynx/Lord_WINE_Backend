import { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";

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