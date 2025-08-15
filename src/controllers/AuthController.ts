import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Op } from "sequelize";
import crypto from 'crypto';

// Asegúrate de crear este archivo src/services/emailService.ts
import { sendEmail } from "../servicios/emailServicio";

import Administrador from "../models/administrador";
import Empleado from "../models/empleado";
import Cliente from "../models/cliente";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const AuthController = {
    /**
    * @desc Permite a los usuarios de diferentes roles iniciar sesión
    * @route POST /api/auth/login
    */
    login: async (req: Request, res: Response): Promise<void> => {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            res.status(400).json({ error: "Correo y contraseña son obligatorios" });
            return;
        }

        try {
            // Lógica de login para Administrador
            const admin = await Administrador.findOne({ where: { adminCorreoElectronico: correo } });
            if (admin && await bcrypt.compare(contrasena, admin.adminContrasena)) {
                const token = jwt.sign(
                    { id: admin.adminCodAdministrador, role: "Administrador" },
                    JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" } as jwt.SignOptions
                );
                res.status(200).json({
                    mensaje: "Login exitoso",
                    token,
                    rol: "Administrador",
                    id: admin.adminCodAdministrador
                });
                return;
            }

            // Lógica de login para Empleado
            const empleado = await Empleado.findOne({ where: { emplCorreoElectronico: correo } });
            if (empleado && await bcrypt.compare(contrasena, empleado.emplContrasena)) {
                const token = jwt.sign(
                    { id: empleado.emplCodEmpleado, role: "Empleado" },
                    JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" } as jwt.SignOptions
                );
                res.status(200).json({
                    mensaje: "Login exitoso",
                    token,
                    rol: "Empleado",
                    id: empleado.emplCodEmpleado
                });
                return;
            }

            // Lógica de login para Cliente
            const cliente = await Cliente.findOne({ where: { clCorreoElectronico: correo } });
            if (cliente && await bcrypt.compare(contrasena, cliente.clContrasena)) {
                const token = jwt.sign(
                    { id: cliente.clCodCliente, role: "Cliente" },
                    JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" } as jwt.SignOptions
                );
                res.status(200).json({
                    mensaje: "Login exitoso",
                    token,
                    rol: "Cliente",
                    id: cliente.clCodCliente
                });
                return;
            }

            res.status(401).json({ error: "Credenciales inválidas" });
        } catch (error) {
            console.error("Error en login:", error);
            res.status(500).json({ error: "Error interno del servidor", detalles: (error as any).message });
        }
    },

    /**
    * @desc Solicitud de recuperación de contraseña (Olvidé mi contraseña)
    * @route POST /api/auth/forgot-password
    */
    forgotPassword: async (req: Request, res: Response): Promise<void> => {
        const { correo } = req.body;

        if (!correo) {
            res.status(400).json({ error: "El correo es obligatorio" });
            return;
        }

        try {
            const cliente = await Cliente.findOne({ where: { clCorreoElectronico: correo } });

            // Si no existe el cliente, devolvemos un mensaje genérico por seguridad
            if (!cliente) {
                res.status(200).json({ mensaje: "Si el correo existe, se ha enviado un código de recuperación" });
                return;
            }

            // Generar código de 6 dígitos
            const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
            const hashedToken = await bcrypt.hash(resetToken, 10);
            const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos de expiración

            cliente.clResetToken = hashedToken;
            cliente.clResetTokenExpiry = resetTokenExpiry;
            await cliente.save();

            await sendEmail({
                to: cliente.clCorreoElectronico,
                subject: 'Código de recuperación de contraseña',
                text: `Tu código de recuperación es: ${resetToken}. Este código es válido por 10 minutos.`,
                html: `<p>Tu código de recuperación es: <strong>${resetToken}</strong></p><p>Este código es válido por 10 minutos.</p>`,
            });

            res.status(200).json({ mensaje: "Código de recuperación enviado con éxito" });
        } catch (error) {
            console.error("Error en forgotPassword:", error);
            res.status(500).json({ error: "Error interno del servidor", detalles: (error as any).message });
        }
    },

    /**
    * @desc Resetea la contraseña con el código de verificación
    * @route POST /api/auth/reset-password
    */
    resetPassword: async (req: Request, res: Response): Promise<void> => {
        const { correo, codigo, nuevaContrasena } = req.body;

        if (!correo || !codigo || !nuevaContrasena) {
            res.status(400).json({ error: "Correo, código y nueva contraseña son obligatorios" });
            return;
        }

        try {
            const cliente = await Cliente.findOne({
                where: {
                    clCorreoElectronico: correo,
                    clResetToken: { [Op.ne]: null },
                    clResetTokenExpiry: { [Op.gt]: new Date() },
                },
            });

            // Validación crucial: verificamos si el cliente y el token existen
            if (!cliente || !cliente.clResetToken) {
                res.status(400).json({ error: "Código de recuperación inválido o expirado" });
                return;
            }

            // Corrección de tipo: Le decimos a TypeScript que el valor no es nulo
            const codigoValido = await bcrypt.compare(codigo, cliente.clResetToken as string);
            
            if (!codigoValido) {
                res.status(400).json({ error: "El código de verificación no coincide" });
                return;
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(nuevaContrasena, salt);
            cliente.clContrasena = hashedPassword;

            cliente.clResetToken = null;
            cliente.clResetTokenExpiry = null;
            await cliente.save();

            res.status(200).json({ mensaje: "Contraseña actualizada con éxito" });
        } catch (error) {
            console.error("Error en resetPassword:", error);
            res.status(500).json({ error: "Error interno del servidor", detalles: (error as any).message });
        }
    },
};