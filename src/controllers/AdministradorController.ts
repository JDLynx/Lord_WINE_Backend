import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import Administrador from "../models/administrador";

export class AdministradorControllers {
  static getAdministradorAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const administradores = await Administrador.findAll({ order: [['adminCodAdministrador', 'ASC']] });
      res.status(200).json(administradores);
    } catch (error) {
      console.error("Error al obtener administradores:", error);
      res.status(500).json({ error: "Error del servidor al obtener administradores", detalles: (error as any).message });
    }
  };

  static getAdministradorById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }
      const administrador = await Administrador.findByPk(id);
      if (!administrador) {
        res.status(404).json({ error: "Administrador no encontrado" });
        return;
      }
      res.status(200).json(administrador);
    } catch (error) {
      console.error("Error al obtener administrador por ID:", error);
      res.status(500).json({ error: "Error del servidor al obtener el administrador", detalles: (error as any).message });
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
    } catch (error: any) {
      console.error("Error al crear administrador:", error);
      if (error.name === "SequelizeValidationError") {
        const mensajes = error.errors.map((err: any) => `${err.path}: ${err.message}`);
        res.status(400).json({ error: mensajes.join(", ") });
      } else if (error.name === "SequelizeUniqueConstraintError") {
        const mensajes = error.errors.map((err: any) => `${err.path} ya registrado`);
        res.status(400).json({ error: mensajes.join(", ") });
      } else {
        res.status(500).json({ error: "Error del servidor al crear el administrador", detalles: error.message || error });
      }
    }
  };

  static actualizarAdministradorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }
      const administrador = await Administrador.findByPk(id);
      if (!administrador) {
        res.status(404).json({ error: "Administrador no encontrado" });
        return;
      }
      if (req.body.adminContrasena) {
        req.body.adminContrasena = await bcrypt.hash(req.body.adminContrasena, 10);
      }
      await administrador.update(req.body);
      res.status(200).json({ mensaje: "Administrador actualizado correctamente", administrador });
    } catch (error: any) {
      console.error("Error al actualizar administrador:", error);
      if (error.name === "SequelizeValidationError") {
        const mensajes = error.errors.map((err: any) => `${err.path}: ${err.message}`);
        res.status(400).json({ error: mensajes.join(", ") });
      } else if (error.name === "SequelizeUniqueConstraintError") {
        const mensajes = error.errors.map((err: any) => `${err.path} ya registrado`);
        res.status(400).json({ error: mensajes.join(", ") });
      } else {
        res.status(500).json({ error: "Error del servidor al actualizar el administrador", detalles: error.message || error });
      }
    }
  };

  static eliminarAdministradorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }
      const administrador = await Administrador.findByPk(id);
      if (!administrador) {
        res.status(404).json({ error: "Administrador no encontrado" });
        return;
      }
      await administrador.destroy();
      res.status(200).json({ mensaje: "Administrador eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar administrador:", error);
      res.status(500).json({ error: "Error del servidor al eliminar el administrador", detalles: (error as any).message });
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
      res.status(500).json({ error: "Error del servidor al iniciar sesión", detalles: (error as any).message });
    }
  };

  static cambiarContrasena = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }
      const administrador = await Administrador.findByPk(id);
      if (!administrador) {
        res.status(404).json({ error: "Administrador no encontrado" });
        return;
      }
      const { currentPassword, newPassword } = req.body;
      const isMatch = await bcrypt.compare(currentPassword, administrador.adminContrasena);
      if (!isMatch) {
        res.status(401).json({ error: "Contraseña actual incorrecta" });
        return;
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await administrador.update({ adminContrasena: hashedPassword });
      res.status(200).json({ mensaje: "Contraseña actualizada correctamente" });
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      res.status(500).json({ error: "Error del servidor al cambiar la contraseña", detalles: (error as any).message });
    }
  };
}