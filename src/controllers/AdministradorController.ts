import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import Administrador from "../models/administrador";
import { transporter, mailOptions } from "../config/mailer";

export class AdministradorControllers {
  static getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const administradores = await Administrador.findAll();
      res.json(administradores);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los administradores" });
    }
  };

  static getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const administrador = await Administrador.findByPk(req.params.id);
      if (!administrador) {
        res.status(404).json({ error: "Administrador no encontrado" });
        return;
      }
      res.json(administrador);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el administrador" });
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

      try {
        await transporter.sendMail(
          mailOptions(
            process.env.EMAIL_USER || "",
            "Bienvenido a Lord Wine 🍷",
            `
              <h1>¡Bienvenido ${administrador.adminNombre}!</h1>
              <p>Tu cuenta de administrador ha sido creada exitosamente.</p>
              <ul>
                <li><strong>Correo:</strong> ${administrador.adminCorreoElectronico}</li>
                <li><strong>Rol:</strong> Administrador</li>
              </ul>
              <p>Gracias por unirte al equipo de Lord Wine.</p>
            `
          )
        );
      } catch (emailError) {
        console.error("Error al enviar el correo de bienvenida:", emailError);
      }

      res.status(201).json({ mensaje: "Administrador creado correctamente", administrador });
    } catch (error) {
      res.status(500).json({ error: "Error al crear el administrador" });
    }
  };

  static update = async (req: Request, res: Response): Promise<void> => {
    try {
      const administrador = await Administrador.findByPk(req.params.id);
      if (!administrador) {
        res.status(404).json({ error: "Administrador no encontrado" });
        return;
      }
      await administrador.update(req.body);
      res.json({ mensaje: "Administrador actualizado correctamente", administrador });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el administrador" });
    }
  };

  static delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const administrador = await Administrador.findByPk(req.params.id);
      if (!administrador) {
        res.status(404).json({ error: "Administrador no encontrado" });
        return;
      }
      await administrador.destroy();
      res.json({ mensaje: "Administrador eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el administrador" });
    }
  };
}