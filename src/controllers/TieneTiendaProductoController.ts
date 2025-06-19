import { Request, Response } from "express";
import TieneTiendaProducto from "../models/tiene_tienda_producto";

export class TieneTiendaProductoController
{
    static getAll = async (req: Request, res: Response) => {
        try {
        const relaciones = await TieneTiendaProducto.findAll({
            order: [["tiendIdTiendaFisica", "ASC"]]
        });
        res.json(relaciones);
        } catch {
        res.status(500).json({ error: "Error al obtener las relaciones" });
        }
    };

    static getByIds = async (req: Request, res: Response) => {
        try {
        const { prodIdProducto, tiendIdTiendaFisica } = req.params;
        const relacion = await TieneTiendaProducto.findOne({
            where: { prodIdProducto, tiendIdTiendaFisica }
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
        const relacion = await TieneTiendaProducto.create(req.body);
        res.status(201).json({ mensaje: "Relación creada correctamente", relacion });
        } catch {
        res.status(500).json({ error: "Error al crear la relación" });
        }
    };

    static deleteByIds = async (req: Request, res: Response) => {
        try {
        const { prodIdProducto, tiendIdTiendaFisica } = req.params;
        const relacion = await TieneTiendaProducto.findOne({
            where: { prodIdProducto, tiendIdTiendaFisica }
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