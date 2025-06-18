import type { Request, Response } from "express";
import Pedido from "../models/pedido";

export class PedidoControllers
{
    static getPedidosAll = async (_req: Request, res: Response): Promise<void> => {
        try {
        const pedidos = await Pedido.findAll({ order: [["pedIdPedido", "ASC"]] });
        res.status(200).json(pedidos);
        } catch (error) {
        console.error("Error al obtener pedidos:", error);
        res.status(500).json({ error: "Error del servidor al obtener los pedidos" });
        }
    };

    static getPedidoById = async (req: Request, res: Response): Promise<void> => {
        try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "ID inválido" });
            return;
        }

        const pedido = await Pedido.findByPk(id);
        if (!pedido) {
            res.status(404).json({ error: "Pedido no encontrado" });
            return;
        }

        res.status(200).json(pedido);
        } catch (error) {
        console.error("Error al obtener pedido por ID:", error);
        res.status(500).json({ error: "Error del servidor al obtener el pedido" });
        }
    };

    static crearPedido = async (req: Request, res: Response): Promise<void> => {
        try {
        const nuevoPedido = await Pedido.create(req.body);
        res.status(201).json({ mensaje: "Pedido creado correctamente", pedido: nuevoPedido });
        } catch (error) {
        console.error("Error al crear pedido:", error);
        res.status(500).json({ error: "Error del servidor al crear el pedido" });
        }
    };

    static actualizarPedidoId = async (req: Request, res: Response): Promise<void> => {
        try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "ID inválido" });
            return;
        }

        const pedido = await Pedido.findByPk(id);
        if (!pedido) {
            res.status(404).json({ error: "Pedido no encontrado" });
            return;
        }

        await pedido.update(req.body);
        res.status(200).json({ mensaje: "Pedido actualizado correctamente", pedido });
        } catch (error) {
        console.error("Error al actualizar pedido:", error);
        res.status(500).json({ error: "Error del servidor al actualizar el pedido" });
        }
    };

    static eliminarPedidoId = async (req: Request, res: Response): Promise<void> => {
        try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "ID inválido" });
            return;
        }

        const pedido = await Pedido.findByPk(id);
        if (!pedido) {
            res.status(404).json({ error: "Pedido no encontrado" });
            return;
        }

        await pedido.destroy();
        res.status(200).json({ mensaje: "Pedido eliminado correctamente" });
        } catch (error) {
        console.error("Error al eliminar pedido:", error);
        res.status(500).json({ error: "Error del servidor al eliminar el pedido" });
        }
    };
}