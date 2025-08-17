import type { Request, Response } from "express";
import Pedido from "../models/pedido";
import Cliente from "../models/cliente";
import Empleado from "../models/empleado";
import DetallePedido from "../models/detalle_pedido";
import Producto from "../models/producto";
import { ValidationError } from 'sequelize';
import { db as sequelize } from "../config/db";

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

    static crearPedidoDesdeCarrito = async (req: Request, res: Response): Promise<void> => {
        const t = await sequelize.transaction();
        try {
            const { clCodCliente, serIdServicioEmpresarial, items } = req.body;

            const cliente = await Cliente.findByPk(clCodCliente, { transaction: t });
            if (!cliente) {
                await t.rollback();
                res.status(404).json({ error: "Cliente no encontrado" });
                return;
            }

            const productoIds = items.map((item: any) => item.prodIdProducto);
            const productos = await Producto.findAll({
                where: {
                    prodIdProducto: productoIds
                },
                transaction: t
            });

            if (productos.length !== productoIds.length) {
                await t.rollback();
                res.status(400).json({ error: "Uno o más productos no existen" });
                return;
            }

            let totalPedido = 0;
            const detalles = items.map((item: any) => {
                const producto = productos.find(p => p.getDataValue('prodIdProducto') === item.prodIdProducto);
                if (!producto) {
                    throw new Error("Producto no encontrado durante el cálculo del total");
                }
                const precioUnitario = producto.getDataValue('prodPrecio');
                const subtotal = precioUnitario * item.cantidad;
                totalPedido += subtotal;

                return {
                    detaCantidad: item.cantidad,
                    detaPrecioUnitario: precioUnitario,
                    detaSubtotal: subtotal,
                    prodIdProducto: item.prodIdProducto
                };
            });

            const nuevoPedidoData = {
                pedFecha: new Date().toISOString().split('T')[0],
                pedTotal: Math.round(totalPedido),
                pedEstado: 'Pendiente',
                clCodCliente,
                serIdServicioEmpresarial,
                emplCodEmpleado: null 
            };

            // Casteamos el objeto a 'any' para evitar el error de tipado de TypeScript
            const nuevoPedido = await Pedido.create(nuevoPedidoData as any, { transaction: t });

            const detallesConPedidoId = detalles.map((detalle: any) => ({
                ...detalle,
                pedIdPedido: nuevoPedido.pedIdPedido
            }));

            await DetallePedido.bulkCreate(detallesConPedidoId, { transaction: t });

            await t.commit();
            res.status(201).json({ mensaje: "Pedido desde carrito creado correctamente", pedido: nuevoPedido, detalles: detallesConPedidoId });
        } catch (error: any) {
            await t.rollback();
            console.error("Error al crear pedido desde el carrito:", error);
            if (error instanceof ValidationError) {
                res.status(400).json({
                    error: "Error de validación al crear el pedido",
                    details: error.errors.map(e => ({
                        path: e.path,
                        message: e.message,
                        value: e.value
                    }))
                });
            } else {
                res.status(500).json({ error: "Error del servidor al procesar el pedido" });
            }
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
                res.status(400).json({
                    error: "Error de validación al actualizar el pedido",
                    details: error.errors.map(e => ({
                        path: e.path,
                        message: e.message,
                        value: e.value
                    }))
                });
            } else {
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
