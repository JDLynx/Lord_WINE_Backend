import express from 'express';
import { login } from '../controllers/LoginController';

const authRouter = express.Router();

// Ruta para autenticar al usuario
authRouter.post('/login', login);

export default authRouter;