import { Request, Response } from "express";
import Producto from "../models/producto";

export class ProductoController
{
    static getAll = async (req: Request, res: Response) => {
        try {
        const productos = await Producto.findAll({ order: [['prodIdProducto', 'ASC']] });
        res.json(productos);
        } catch {
        res.status(500).json({ error: "Error al obtener los productos" });
        }
    };

    static getById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);
        if (!producto) {
            res.status(404).json({ error: "Producto no encontrado" });
            return;
        }
        res.json(producto);
        } catch {
        res.status(500).json({ error: "Error al obtener el producto" });
        }
    };

    static create = async (req: Request, res: Response) => {
        try {
        const producto = await Producto.create(req.body);
        res.status(201).json({ mensaje: "Producto creado correctamente", producto });
        } catch {
        res.status(500).json({ error: "Error al crear el producto" });
        }
    };

    static updateById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);
        if (!producto) {
            res.status(404).json({ error: "Producto no encontrado" });
            return;
        }
        await producto.update(req.body);
        res.json({ mensaje: "Producto actualizado correctamente", producto });
        } catch {
        res.status(500).json({ error: "Error al actualizar el producto" });
        }
    };

    static deleteById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);
        if (!producto) {
            res.status(404).json({ error: "Producto no encontrado" });
            return;
        }
        await producto.destroy();
        res.json({ mensaje: "Producto eliminado correctamente" });
        } catch {
        res.status(500).json({ error: "Error al eliminar el producto" });
        }
    };
}