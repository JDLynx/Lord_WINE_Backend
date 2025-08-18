import express from 'express';
import { AuthController } from '../controllers/AuthController';

const authRouter = express.Router();

authRouter.post('/login', AuthController.login);
authRouter.post('/solicitar-recuperacion', AuthController.solicitarRecuperacionContrasena);
authRouter.post('/restablecer-contrasena', AuthController.restablecerContrasena);

export default authRouter;