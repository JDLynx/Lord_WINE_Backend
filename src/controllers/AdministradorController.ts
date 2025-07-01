import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import Administrador from "../models/administrador";

export class AdministradorControllers {
  static getAdministradorAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const administradores = await Administrador.findAll({ order: [['adminCodAdministrador', 'ASC']] });
      res.json(administradores);
    } catch (error) {
      console.error("Error al obtener administradores:", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  };

  static getAdministradorById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const administrador = await Administrador.findByPk(id);
      if (!administrador) {
        res.status(404).json({ error: "Administrador no encontrado" });
        return;
      }
      res.json(administrador);
    } catch (error) {
      console.error("Error al obtener administrador por ID:", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  };

  static crearAdministrador = async (req: Request, res: Response): Promise<void> => {
    try {
      const { adminCorreoElectronico, adminContrasena } = req.body;
      if (!adminCorreoElectronico || !adminContrasena) {
        res.status(400).json({ error: "Correo electrónico y contraseña son obligatorios" });
        return;
      }
      const hashedPassword = await bcrypt.hash(adminContrasena, 10);
      const administrador = await Administrador.create({
        ...req.body,
        adminContrasena: hashedPassword
      });
      res.status(201).json({ mensaje: "Administrador creado correctamente", administrador });
    } catch (error) {
      console.error("Error al crear administrador:", error);
      res.status(500).json({ error: "Error al crear el administrador" });
    }
  };

  static actualizarAdministradorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const administrador = await Administrador.findByPk(id);
      if (!administrador) {
        res.status(404).json({ error: "Administrador no encontrado" });
        return;
      }
      if (req.body.adminContrasena) {
        req.body.adminContrasena = await bcrypt.hash(req.body.adminContrasena, 10);
      }
      await administrador.update(req.body);
      res.json({ mensaje: "Administrador actualizado correctamente", administrador });
    } catch (error) {
      console.error("Error al actualizar administrador:", error);
      res.status(500).json({ error: "Error al actualizar el administrador" });
    }
  };

  static eliminarAdministradorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const administrador = await Administrador.findByPk(id);
      if (!administrador) {
        res.status(404).json({ error: "Administrador no encontrado" });
        return;
      }
      await administrador.destroy();
      res.json({ mensaje: "Administrador eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar administrador:", error);
      res.status(500).json({ error: "Error al eliminar el administrador" });
    }
  };

  static loginAdministrador = async (req: Request, res: Response): Promise<void> => {
    try {
      const { adminCorreoElectronico, adminContrasena } = req.body;
      if (!adminCorreoElectronico || !adminContrasena) {
        res.status(400).json({ error: "Correo electrónico y contraseña requeridos" });
        return;
      }
      const administrador = await Administrador.findOne({ where: { adminCorreoElectronico } });
      if (!administrador) {
        res.status(401).json({ error: "Credenciales inválidas" });
        return;
      }
      const match = await bcrypt.compare(adminContrasena, administrador.adminContrasena);
      if (!match) {
        res.status(401).json({ error: "Credenciales inválidas" });
        return;
      }
      res.status(200).json({ mensaje: "Login exitoso", administrador });
    } catch (error) {
      console.error("Error en login de administrador:", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  };

  static cambiarContrasena = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;
      const administrador = await Administrador.findByPk(id);
      if (!administrador) {
        res.status(404).json({ error: "Administrador no encontrado" });
        return;
      }
      const isMatch = await bcrypt.compare(currentPassword, administrador.adminContrasena);
      if (!isMatch) {
        res.status(401).json({ error: "Contraseña actual incorrecta" });
        return;
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await administrador.update({ adminContrasena: hashedPassword });
      res.json({ mensaje: "Contraseña actualizada correctamente" });
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  };
}