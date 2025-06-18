import type { Request, Response } from "express";
import ServicioEmpresarial from "../models/servicio_empresarial";

export class ServicioEmpresarialController
{
  static getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const servicios = await ServicioEmpresarial.findAll({ order: [["serIdServicioEmpresarial", "ASC"]] });
      res.status(200).json(servicios);
    } catch (error) {
      console.error("Error al obtener servicios empresariales:", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  };

  static getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }

      const servicio = await ServicioEmpresarial.findByPk(id);
      if (!servicio) {
        res.status(404).json({ error: "Servicio no encontrado" });
        return;
      }

      res.status(200).json(servicio);
    } catch (error) {
      console.error("Error al obtener servicio:", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  };

  static create = async (req: Request, res: Response): Promise<void> => {
    try {
      const servicio = await ServicioEmpresarial.create(req.body);
      res.status(201).json({ mensaje: "Servicio creado correctamente", servicio });
    } catch (error) {
      console.error("Error al crear servicio:", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  };

  static update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }

      const servicio = await ServicioEmpresarial.findByPk(id);
      if (!servicio) {
        res.status(404).json({ error: "Servicio no encontrado" });
        return;
      }

      await servicio.update(req.body);
      res.status(200).json({ mensaje: "Servicio actualizado correctamente", servicio });
    } catch (error) {
      console.error("Error al actualizar servicio:", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  };

  static delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        res.status(400).json({ error: "ID inválido" });
        return;
      }

      const servicio = await ServicioEmpresarial.findByPk(id);
      if (!servicio) {
        res.status(404).json({ error: "Servicio no encontrado" });
        return;
      }

      await servicio.destroy();
      res.status(200).json({ mensaje: "Servicio eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar servicio:", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  };
}