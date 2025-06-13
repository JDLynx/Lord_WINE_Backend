// Importa los tipos para Request y Response desde Express (útil para TypeScript)
import type { Request, Response } from "express";

// Importa el modelo de Administrador
import Administrador from "../models/administrador";

// Definición de la clase de controladores para el modelo Administrador
export class AdministradorControllers
{
  // Obtener todos los administradores ordenados por fecha de creación (ascendente)
  static getAdministradorAll = async (req: Request, res: Response) =>
  {
    try
    {
      const administradores = await Administrador.findAll({ order: [['createdAt', 'ASC']] });
      res.json(administradores);
    }
    catch (error)
    {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  // Obtener un administrador por su ID
  static getAdministradorById = async (req: Request, res: Response) =>
  {
    try
    {
      const { id } = req.params;
      const administrador = await Administrador.findByPk(id); // Busca por clave primaria

      if (!administrador)
      {
        res.status(404).json({ error: "Administrador no encontrado" });
        return;
      }

      res.json(administrador);
    }
    catch (error)
    {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  // Crear un nuevo administrador a partir del cuerpo de la solicitud
  static crearAdministrador = async (req: Request, res: Response) =>
  {
    try
    {
      const administrador = new Administrador(req.body);
      await administrador.save(); // Guarda en la base de datos

      res.status(201).json({ mensaje: "Administrador creado correctamente" });
    }
    catch (error)
    {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  // Actualizar un administrador por ID
  static actualizarAdministradorId = async (req: Request, res: Response) =>
  {
    try
    {
      const { id } = req.params;
      const administrador = await Administrador.findByPk(id);

      if (!administrador)
      {
        res.status(404).json({ error: "Administrador no encontrado" });
        return;
      }

      await administrador.update(req.body); // Actualiza los campos
      res.json({ mensaje: "Administrador actualizado correctamente" });
    }
    catch (error)
    {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  // Eliminar un administrador por ID
  static eliminarAdministradorId = async (req: Request, res: Response) =>
  {
    try
    {
      const { id } = req.params;
      const administrador = await Administrador.findByPk(id);

      if (!administrador)
      {
        res.status(404).json({ error: "Administrador no encontrado" });
        return;
      }

      await administrador.destroy(); // Elimina el registro
      res.json({ mensaje: "Administrador eliminado correctamente" });
    }
    catch (error)
    {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  // Iniciar sesión de administrador verificando correo y contraseña
  static loginAdministrador = async (req: Request, res: Response) =>
  {
    try
    {
      const { adminCorreoElectronico, adminContrasena } = req.body;

      const administrador = await Administrador.findOne({
        where: { adminCorreoElectronico, adminContrasena },
      });

      if (!administrador)
      {
        res.status(401).json({ error: "Credenciales inválidas" });
        return;
      }

      res.status(200).json({ mensaje: "Login exitoso", administrador });
    }
    catch (error)
    {
      res.status(500).json({ error: "Hubo un error en el servidor" });
    }
  };
}