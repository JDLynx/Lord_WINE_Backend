import { Request, Response } from "express";
import GestionaAdministradorInventarioGeneral from "../models/gestiona_administrador_inventario_general";

export class GestionaAdministradorInventarioGeneralController
{
    static getAll = async (req: Request, res: Response) => {
        try {
        const relaciones = await GestionaAdministradorInventarioGeneral.findAll({
            order: [["adminCodAdministrador", "ASC"]],
        });
        res.json(relaciones);
        } catch {
        res.status(500).json({ error: "Error al obtener las relaciones" });
        }
    };
    
    static getByIds = async (req: Request, res: Response) => {
        try {
        const { adminCodAdministrador, invGenIdInventarioGeneral } = req.params;
        const relacion = await GestionaAdministradorInventarioGeneral.findOne({
            where: { adminCodAdministrador, invGenIdInventarioGeneral },
        });
        if (!relacion) {
            res.status(404).json({ error: "Relación no encontrada" });
            return;
        }
        res.json(relacion);
        } catch {
        res.status(500).json({ error: "Error al obtener la relación" });
        }
    };
    
    static create = async (req: Request, res: Response) => {
        try {
        const relacion = await GestionaAdministradorInventarioGeneral.create(req.body);
        res.status(201).json({ mensaje: "Relación creada correctamente", relacion });
        } catch {
        res.status(500).json({ error: "Error al crear la relación" });
        }
    };
    
    static deleteByIds = async (req: Request, res: Response) => {
        try {
        const { adminCodAdministrador, invGenIdInventarioGeneral } = req.params;
        const relacion = await GestionaAdministradorInventarioGeneral.findOne({
            where: { adminCodAdministrador, invGenIdInventarioGeneral },
        });
        if (!relacion) {
            res.status(404).json({ error: "Relación no encontrada" });
            return;
        }
        await relacion.destroy();
        res.json({ mensaje: "Relación eliminada correctamente" });
        } catch {
        res.status(500).json({ error: "Error al eliminar la relación" });
        }
    };
}