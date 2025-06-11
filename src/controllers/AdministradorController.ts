import type { Request, Response } from "express";
import Administrador from "../models/administrador";

export class AdministradorControllers
{
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

  static getAdministradorById = async (req: Request, res: Response) =>
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
      res.json(administrador);
    }
    catch (error)
    {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static crearAdministrador = async (req: Request, res: Response) =>
  {
    try
    {
      const administrador = new Administrador(req.body);
      await administrador.save();
      res.status(201).json({ mensaje: "Administrador creado correctamente" });
    }
    catch (error)
    {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

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
      await administrador.update(req.body);
      res.json({ mensaje: "Administrador actualizado correctamente" });
    }
    catch (error)
    {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

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
      await administrador.destroy();
      res.json({ mensaje: "Administrador eliminado correctamente" });
    }
    catch (error)
    {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

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