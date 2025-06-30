import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import Administrador from "../models/administrador";
import Empleado from "../models/empleado";
import Cliente from "../models/cliente";

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
  }
};