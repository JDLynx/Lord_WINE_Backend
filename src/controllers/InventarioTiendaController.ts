import { Request, Response } from "express";
import InventarioTienda from "../models/inventario_tienda";

export class InventarioTiendaController
{
    static getAll = async (req: Request, res: Response) => {
        try {
        const inventarios = await InventarioTienda.findAll({ order: [["invTienIdInventarioTienda", "ASC"]] });
        res.json(inventarios);
        } catch {
        res.status(500).json({ error: "Error al obtener los inventarios de tienda" });
        }
    };
    
    static getById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const inventario = await InventarioTienda.findByPk(id);
        if (!inventario) {
            res.status(404).json({ error: "Inventario de tienda no encontrado" });
            return;
        }
        res.json(inventario);
        } catch {
        res.status(500).json({ error: "Error al obtener el inventario de tienda" });
        }
    };
    
    static create = async (req: Request, res: Response) => {
        try {
        const inventario = await InventarioTienda.create(req.body);
        res.status(201).json({ mensaje: "Inventario de tienda creado correctamente", inventario });
        } catch {
        res.status(500).json({ error: "Error al crear el inventario de tienda" });
        }
    };
    
    static updateById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const inventario = await InventarioTienda.findByPk(id);
        if (!inventario) {
            res.status(404).json({ error: "Inventario de tienda no encontrado" });
            return;
        }
        await inventario.update(req.body);
        res.json({ mensaje: "Inventario de tienda actualizado correctamente", inventario });
        } catch {
        res.status(500).json({ error: "Error al actualizar el inventario de tienda" });
        }
    };
    
    static deleteById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const inventario = await InventarioTienda.findByPk(id);
        if (!inventario) {
            res.status(404).json({ error: "Inventario de tienda no encontrado" });
            return;
        }
        await inventario.destroy();
        res.json({ mensaje: "Inventario de tienda eliminado correctamente" });
        } catch {
        res.status(500).json({ error: "Error al eliminar el inventario de tienda" });
        }
    };
}