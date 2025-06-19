import { Request, Response } from "express";
import TieneInventarioTiendaProducto from "../models/tiene_inventario_tienda_producto";

export class TieneInventarioTiendaProductoController
{
    static getAll = async (req: Request, res: Response) => {
        try {
        const relaciones = await TieneInventarioTiendaProducto.findAll({
            order: [["invTienIdInventarioTienda", "ASC"]]
        });
        res.json(relaciones);
        } catch {
        res.status(500).json({ error: "Error al obtener las relaciones" });
        }
    };
    
    static getByIds = async (req: Request, res: Response) => {
        try {
        const { invTienIdInventarioTienda, prodIdProducto } = req.params;
        const relacion = await TieneInventarioTiendaProducto.findOne({
            where: { invTienIdInventarioTienda, prodIdProducto }
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
        const relacion = await TieneInventarioTiendaProducto.create(req.body);
        res.status(201).json({ mensaje: "Relación creada correctamente", relacion });
        } catch {
        res.status(500).json({ error: "Error al crear la relación" });
        }
    };
    
    static deleteByIds = async (req: Request, res: Response) => {
        try {
        const { invTienIdInventarioTienda, prodIdProducto } = req.params;
        const relacion = await TieneInventarioTiendaProducto.findOne({
            where: { invTienIdInventarioTienda, prodIdProducto }
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