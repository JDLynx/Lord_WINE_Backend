import { Request, Response } from "express";
import DetalleCarrito from "../models/detalle_carrito";

export class DetalleCarritoController
{
    static getAll = async (req: Request, res: Response) => {
        try {
        const detalles = await DetalleCarrito.findAll({ order: [["detIdDetalleCarrito", "ASC"]] });
        res.json(detalles);
        } catch {
        res.status(500).json({ error: "Error al obtener los detalles de carrito" });
        }
    };
    
    static getById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const detalle = await DetalleCarrito.findByPk(id);
        if (!detalle) {
            res.status(404).json({ error: "Detalle de carrito no encontrado" });
            return;
        }
        res.json(detalle);
        } catch {
        res.status(500).json({ error: "Error al obtener el detalle de carrito" });
        }
    };
    
    static create = async (req: Request, res: Response) => {
        try {
        const detalle = await DetalleCarrito.create(req.body);
        res.status(201).json({ mensaje: "Detalle de carrito creado correctamente", detalle });
        } catch {
        res.status(500).json({ error: "Error al crear el detalle de carrito" });
        }
    };
    
    static updateById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const detalle = await DetalleCarrito.findByPk(id);
        if (!detalle) {
            res.status(404).json({ error: "Detalle de carrito no encontrado" });
            return;
        }
        await detalle.update(req.body);
        res.json({ mensaje: "Detalle de carrito actualizado correctamente", detalle });
        } catch {
        res.status(500).json({ error: "Error al actualizar el detalle de carrito" });
        }
    };
    
    static deleteById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const detalle = await DetalleCarrito.findByPk(id);
        if (!detalle) {
            res.status(404).json({ error: "Detalle de carrito no encontrado" });
            return;
        }
        await detalle.destroy();
        res.json({ mensaje: "Detalle de carrito eliminado correctamente" });
        } catch {
        res.status(500).json({ error: "Error al eliminar el detalle de carrito" });
        }
    };
}