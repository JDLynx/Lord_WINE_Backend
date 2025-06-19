import { Request, Response } from "express";
import TiendaFisica from "../models/tienda_fisica";

export class TiendaFisicaController
{
    static getAll = async (req: Request, res: Response) => {
        try {
        const tiendas = await TiendaFisica.findAll({ order: [["tiendIdTiendaFisica", "ASC"]] });
        res.json(tiendas);
        } catch {
        res.status(500).json({ error: "Error al obtener las tiendas físicas" });
        }
    };

    static getById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const tienda = await TiendaFisica.findByPk(id);
        if (!tienda) {
            res.status(404).json({ error: "Tienda física no encontrada" });
            return;
        }
        res.json(tienda);
        } catch {
        res.status(500).json({ error: "Error al obtener la tienda física" });
        }
    };

    static create = async (req: Request, res: Response) => {
        try {
        const tienda = await TiendaFisica.create(req.body);
        res.status(201).json({ mensaje: "Tienda física creada correctamente", tienda });
        } catch {
        res.status(500).json({ error: "Error al crear la tienda física" });
        }
    };

    static updateById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const tienda = await TiendaFisica.findByPk(id);
        if (!tienda) {
            res.status(404).json({ error: "Tienda física no encontrada" });
            return;
        }
        await tienda.update(req.body);
        res.json({ mensaje: "Tienda actualizada correctamente", tienda });
        } catch {
        res.status(500).json({ error: "Error al actualizar la tienda física" });
        }
    };

    static deleteById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const tienda = await TiendaFisica.findByPk(id);
        if (!tienda) {
            res.status(404).json({ error: "Tienda física no encontrada" });
            return;
        }
        await tienda.destroy();
        res.json({ mensaje: "Tienda eliminada correctamente" });
        } catch {
        res.status(500).json({ error: "Error al eliminar la tienda física" });
        }
    };
}