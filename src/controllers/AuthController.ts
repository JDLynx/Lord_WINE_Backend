import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import randomstring from "randomstring";
import { Op } from "sequelize";

import Administrador from "../models/administrador";
import Empleado from "../models/empleado";
import Cliente from "../models/cliente";
import { sendPasswordResetEmail } from "../servicios/emailServicio";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const AuthController = {
  login: async (req: Request, res: Response): Promise<void> => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      res.status(400).json({ error: "Correo y contraseña son obligatorios" });
      return;
    }

    try {
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

  solicitarRecuperacionContrasena: async (req: Request, res: Response): Promise<void> => {
    const { correo } = req.body;

    if (!correo) {
      res.status(400).json({ error: "El correo es obligatorio" });
      return;
    }

    try {
      const cliente = await Cliente.findOne({ where: { clCorreoElectronico: correo } });

      if (!cliente) {
        // Es importante no revelar si el correo existe o no para evitar la enumeración de usuarios
        res.status(200).json({ mensaje: "Si el correo existe, se le ha enviado un código de verificación." });
        return;
      }

      // Generar un token de 6 dígitos
      const token = randomstring.generate({
        length: 6,
        charset: 'numeric'
      });

      // Establecer la fecha de expiración del token (ej. 1 hora a partir de ahora)
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 1);

      // Guardar el token y su fecha de expiración en el cliente
      cliente.clResetToken = token;
      cliente.clResetTokenExpiration = expiration;
      await cliente.save();

      // Enviar el correo electrónico al cliente
      await sendPasswordResetEmail(cliente.clCorreoElectronico, token);

      res.status(200).json({ mensaje: "Si el correo existe, se le ha enviado un código de verificación." });
    } catch (error) {
      console.error("Error al solicitar recuperación de contraseña:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  },

  restablecerContrasena: async (req: Request, res: Response): Promise<void> => {
    const { correo, token, nuevaContrasena } = req.body;

    if (!correo || !token || !nuevaContrasena) {
      res.status(400).json({ error: "Correo, token y nueva contraseña son obligatorios" });
      return;
    }

    try {
      const cliente = await Cliente.findOne({
        where: {
          clCorreoElectronico: correo,
          clResetToken: token,
          clResetTokenExpiration: {
            [Op.gt]: new Date() // El token debe ser mayor a la fecha actual (no expirado)
          }
        }
      });

      if (!cliente) {
        res.status(400).json({ error: "Token inválido o expirado." });
        return;
      }

      // Hashear la nueva contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedContrasena = await bcrypt.hash(nuevaContrasena, salt);

      // Actualizar la contraseña del cliente y limpiar los campos de recuperación
      cliente.clContrasena = hashedContrasena;
      cliente.clResetToken = null;
      cliente.clResetTokenExpiration = null;
      await cliente.save();

      res.status(200).json({ mensaje: "Contraseña actualizada exitosamente." });
    } catch (error) {
      console.error("Error al restablecer la contraseña:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }
};