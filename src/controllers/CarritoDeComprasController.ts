import { Request, Response } from "express";
import CarritoDeCompras from "../models/carrito_de_compras";

export class CarritoDeComprasController
{
    static getAll = async (req: Request, res: Response) => {
        try {
        const carritos = await CarritoDeCompras.findAll({ order: [['carIdCarritoDeCompras', 'ASC']] });
        res.json(carritos);
        } catch {
        res.status(500).json({ error: "Error al obtener los carritos" });
        }
    };

    static getById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const carrito = await CarritoDeCompras.findByPk(id);
        if (!carrito) {
            res.status(404).json({ error: "Carrito no encontrado" });
            return;
        }
        res.json(carrito);
        } catch {
        res.status(500).json({ error: "Error al obtener el carrito" });
        }
    };

    static create = async (req: Request, res: Response) => {
        try {
        const carrito = await CarritoDeCompras.create(req.body);
        res.status(201).json({ mensaje: "Carrito creado correctamente", carrito });
        } catch {
        res.status(500).json({ error: "Error al crear el carrito" });
        }
    };

    static updateById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const carrito = await CarritoDeCompras.findByPk(id);
        if (!carrito) {
            res.status(404).json({ error: "Carrito no encontrado" });
            return;
        }
        await carrito.update(req.body);
        res.json({ mensaje: "Carrito actualizado correctamente", carrito });
        } catch {
        res.status(500).json({ error: "Error al actualizar el carrito" });
        }
    };

    static deleteById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const carrito = await CarritoDeCompras.findByPk(id);
        if (!carrito) {
            res.status(404).json({ error: "Carrito no encontrado" });
            return;
        }
        await carrito.destroy();
        res.json({ mensaje: "Carrito eliminado correctamente" });
        } catch {
        res.status(500).json({ error: "Error al eliminar el carrito" });
        }
    };
}