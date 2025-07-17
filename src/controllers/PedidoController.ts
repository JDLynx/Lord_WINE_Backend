import type { Request, Response } from "express";
import Pedido from "../models/pedido";
import Cliente from "../models/cliente";
import Empleado from "../models/empleado";
import DetallePedido from "../models/detalle_pedido";
import Producto from "../models/producto";
import { ValidationError } from 'sequelize';

export class PedidoControllers {
    static getPedidosAll = async (_req: Request, res: Response): Promise<void> => {
        try {
            const pedidos = await Pedido.findAll({
                order: [["pedIdPedido", "ASC"]],
                include: [
                    {
                        model: Cliente,
                        as: 'cliente',
                        attributes: ['clNombre']
                    },
                    {
                        model: Empleado,
                        as: 'empleado',
                        attributes: ['emplNombre']
                    },
                    {
                        model: DetallePedido,
                        as: 'detallesPedido',
                        include: [
                            {
                                model: Producto,
                                as: 'producto',
                                attributes: ['prodIdProducto', 'prodNombre', 'prodPrecio']
                            }
                        ]
                    }
                ]
            });
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

            const pedido = await Pedido.findByPk(id, {
                include: [
                    {
                        model: Cliente,
                        as: 'cliente',
                        attributes: ['clNombre']
                    },
                    {
                        model: Empleado,
                        as: 'empleado',
                        attributes: ['emplNombre']
                    },
                    {
                        model: DetallePedido,
                        as: 'detallesPedido',
                        include: [
                            {
                                model: Producto,
                                as: 'producto',
                                attributes: ['prodIdProducto', 'prodNombre', 'prodPrecio']
                            }
                        ]
                    }
                ]
            });
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
            console.log("¡Entrando a la función actualizarPedidoId!");

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

            const { pedEstado, emplCodEmpleado } = req.body;

            console.log("Datos recibidos en req.body para actualizar:", req.body);
            console.log("Objeto pedido antes de la actualización:", pedido.toJSON());

            await pedido.update({ pedEstado, emplCodEmpleado });

            const updatedPedido = await Pedido.findByPk(id, {
                include: [
                    {
                        model: Cliente,
                        as: 'cliente',
                        attributes: ['clNombre']
                    },
                    {
                        model: Empleado,
                        as: 'empleado',
                        attributes: ['emplNombre']
                    },
                    {
                        model: DetallePedido,
                        as: 'detallesPedido',
                        include: [
                            {
                                model: Producto,
                                as: 'producto',
                                attributes: ['prodIdProducto', 'prodNombre', 'prodPrecio']
                            }
                        ]
                    }
                ]
            });

            res.status(200).json({ mensaje: "Pedido actualizado correctamente", pedido: updatedPedido });
        } catch (error: any) {
            console.error("Error al actualizar pedido:", error);

            if (error instanceof ValidationError) {
                console.error("Errores de validación de Sequelize:", error.errors.map(e => e.message));
                res.status(400).json({
                    error: "Error de validación al actualizar el pedido",
                    details: error.errors.map(e => ({
                        path: e.path,
                        message: e.message,
                        value: e.value
                    }))
                });
            } else {
                console.error("Error no capturado por ValidationError:", error);
                console.error("Mensaje de error:", error.message);
                console.error("Stack de error:", error.stack);
                res.status(500).json({ error: "Error del servidor al actualizar el pedido" });
            }
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