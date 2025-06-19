import { Request, Response } from "express";
import Categoria from "../models/categoria";

export class CategoriaController
{
    static getAll = async (req: Request, res: Response) => {
        try {
        const categorias = await Categoria.findAll({ order: [['categIdCategoria', 'ASC']] });
        res.json(categorias);
        } catch {
        res.status(500).json({ error: "Error al obtener las categorías" });
        }
    };

    static getById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            res.status(404).json({ error: "Categoría no encontrada" });
            return;
        }
        res.json(categoria);
        } catch {
        res.status(500).json({ error: "Error al obtener la categoría" });
        }
    };

    static create = async (req: Request, res: Response) => {
        try {
        const categoria = await Categoria.create(req.body);
        res.status(201).json({ mensaje: "Categoría creada correctamente", categoria });
        } catch {
        res.status(500).json({ error: "Error al crear la categoría" });
        }
    };

    static updateById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            res.status(404).json({ error: "Categoría no encontrada" });
            return;
        }
        await categoria.update(req.body);
        res.json({ mensaje: "Categoría actualizada correctamente", categoria });
        } catch {
        res.status(500).json({ error: "Error al actualizar la categoría" });
        }
    };

    static deleteById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const categoria = await Categoria.findByPk(id);
        if (!categoria) {
            res.status(404).json({ error: "Categoría no encontrada" });
            return;
        }
        await categoria.destroy();
        res.json({ mensaje: "Categoría eliminada correctamente" });
        } catch {
        res.status(500).json({ error: "Error al eliminar la categoría" });
        }
    };
}