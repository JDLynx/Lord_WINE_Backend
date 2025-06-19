import { Request, Response } from "express";
import InventarioGeneral from "../models/inventario_general";

export class InventarioGeneralController
{
    static getAll = async (req: Request, res: Response) => {
        try {
        const inventarios = await InventarioGeneral.findAll({ order: [['invGenIdInventarioGeneral', 'ASC']] });
        res.json(inventarios);
        } catch {
        res.status(500).json({ error: "Error al obtener los inventarios generales" });
        }
    };
    
    static getById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const inventario = await InventarioGeneral.findByPk(id);
        if (!inventario) {
            res.status(404).json({ error: "Inventario general no encontrado" });
            return;
        }
        res.json(inventario);
        } catch {
        res.status(500).json({ error: "Error al obtener el inventario general" });
        }
    };
    
    static create = async (req: Request, res: Response) => {
        try {
        const inventario = await InventarioGeneral.create(req.body);
        res.status(201).json({ mensaje: "Inventario general creado correctamente", inventario });
        } catch {
        res.status(500).json({ error: "Error al crear el inventario general" });
        }
    };
    
    static updateById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const inventario = await InventarioGeneral.findByPk(id);
        if (!inventario) {
            res.status(404).json({ error: "Inventario general no encontrado" });
            return;
        }
        await inventario.update(req.body);
        res.json({ mensaje: "Inventario general actualizado correctamente", inventario });
        } catch {
        res.status(500).json({ error: "Error al actualizar el inventario general" });
        }
    };
    
    static deleteById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const inventario = await InventarioGeneral.findByPk(id);
        if (!inventario) {
            res.status(404).json({ error: "Inventario general no encontrado" });
            return;
        }
        await inventario.destroy();
        res.json({ mensaje: "Inventario general eliminado correctamente" });
        } catch {
        res.status(500).json({ error: "Error al eliminar el inventario general" });
        }
    };
}