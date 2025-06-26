import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Administrador from "../models/administrador";
import Empleado from "../models/empleado";
import Cliente from "../models/cliente";

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
        res.status(200).json({
          mensaje: "Login exitoso",
          rol: "Administrador",
          adminCodAdministrador: admin.adminCodAdministrador
        });
        return;
      }

      const empleado = await Empleado.findOne({ where: { emplCorreoElectronico: correo } });
      if (empleado && await bcrypt.compare(contrasena, empleado.emplContrasena)) {
        res.status(200).json({
          mensaje: "Login exitoso",
          rol: "Empleado",
          emplCodEmpleado: empleado.emplCodEmpleado
        });
        return;
      }

      const cliente = await Cliente.findOne({ where: { clCorreoElectronico: correo } });
      if (cliente && await bcrypt.compare(contrasena, cliente.clContrasena)) {
        res.status(200).json({
          mensaje: "Login exitoso",
          rol: "Cliente",
          clCodCliente: cliente.clCodCliente
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
