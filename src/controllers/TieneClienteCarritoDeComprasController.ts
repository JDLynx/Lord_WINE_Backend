import { Request, Response } from "express";
import TieneClienteCarritoDeCompras from "../models/tiene_cliente_carrito_de_compras";

export class TieneClienteCarritoDeComprasController
{
    static getAll = async (req: Request, res: Response) => {
        try {
        const relaciones = await TieneClienteCarritoDeCompras.findAll({
            order: [["clCodCliente", "ASC"]],
        });
        res.json(relaciones);
        } catch {
        res.status(500).json({ error: "Error al obtener las relaciones" });
        }
    };
    
    static getByIds = async (req: Request, res: Response) => {
        try {
        const { clCodCliente, carIdCarritoDeCompras } = req.params;
        const relacion = await TieneClienteCarritoDeCompras.findOne({
            where: { clCodCliente, carIdCarritoDeCompras },
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
        const relacion = await TieneClienteCarritoDeCompras.create(req.body);
        res.status(201).json({ mensaje: "Relación creada correctamente", relacion });
        } catch {
        res.status(500).json({ error: "Error al crear la relación" });
        }
    };
    
    static deleteByIds = async (req: Request, res: Response) => {
        try {
        const { clCodCliente, carIdCarritoDeCompras } = req.params;
        const relacion = await TieneClienteCarritoDeCompras.findOne({
            where: { clCodCliente, carIdCarritoDeCompras },
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