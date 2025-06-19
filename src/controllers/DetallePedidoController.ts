import { Request, Response } from "express";
import DetallePedido from "../models/detalle_pedido";

export class DetallePedidoController
{
    static getAll = async (req: Request, res: Response) => {
        try {
        const detalles = await DetallePedido.findAll({ order: [['detaIdDetallePedido', 'ASC']] });
        res.json(detalles);
        } catch {
        res.status(500).json({ error: "Error al obtener los detalles de pedido" });
        }
    };

    static getById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const detalle = await DetallePedido.findByPk(id);
        if (!detalle) {
            res.status(404).json({ error: "Detalle de pedido no encontrado" });
            return;
        }
        res.json(detalle);
        } catch {
        res.status(500).json({ error: "Error al obtener el detalle de pedido" });
        }
    };

    static create = async (req: Request, res: Response) => {
        try {
        const detalle = await DetallePedido.create(req.body);
        res.status(201).json({ mensaje: "Detalle creado correctamente", detalle });
        } catch {
        res.status(500).json({ error: "Error al crear el detalle de pedido" });
        }
    };

    static updateById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const detalle = await DetallePedido.findByPk(id);
        if (!detalle) {
            res.status(404).json({ error: "Detalle de pedido no encontrado" });
            return;
        }
        await detalle.update(req.body);
        res.json({ mensaje: "Detalle actualizado correctamente", detalle });
        } catch {
        res.status(500).json({ error: "Error al actualizar el detalle de pedido" });
        }
    };

    static deleteById = async (req: Request, res: Response) => {
        try {
        const { id } = req.params;
        const detalle = await DetallePedido.findByPk(id);
        if (!detalle) {
            res.status(404).json({ error: "Detalle de pedido no encontrado" });
            return;
        }
        await detalle.destroy();
        res.json({ mensaje: "Detalle eliminado correctamente" });
        } catch {
        res.status(500).json({ error: "Error al eliminar el detalle de pedido" });
        }
    };
}