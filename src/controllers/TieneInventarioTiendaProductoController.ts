import { Request, Response } from "express";
import TieneInventarioTiendaProducto from "../models/tiene_inventario_tienda_producto";
import { Producto } from '../models/producto';
import { InventarioTienda } from '../models/inventario_tienda';
import { TiendaFisica } from '../models/tienda_fisica';

export class TieneInventarioTiendaProductoController {
    static getAll = async (req: Request, res: Response) => {
        try {
            const relaciones = await TieneInventarioTiendaProducto.findAll({
                order: [["invTienIdInventarioTienda", "ASC"]],
                include: [
                    {
                        model: Producto,
                        attributes: ['prodNombre', 'prodDescripcion', 'prodPrecio']
                    },
                    {
                        model: InventarioTienda,
                        attributes: ['invTienIdInventarioTienda'],
                        include: [
                            {
                                model: TiendaFisica,
                                as: 'tiendasFisicas',
                                attributes: ['tiendNombre', 'tiendDireccion'],
                                required: false
                            }
                        ],
                        required: false
                    }
                ]
            });

            const relacionesTransformadas = relaciones.map(relacion => {
                const plainRelacion: any = relacion.get({ plain: true });

                if (plainRelacion.inventarioTienda) {

                    if (plainRelacion.inventarioTienda.tiendasFisicas && plainRelacion.inventarioTienda.tiendasFisicas.length > 0) {
                        const tiendaAsociada = plainRelacion.inventarioTienda.tiendasFisicas[0];
                        plainRelacion.inventarioTienda = {
                            ...plainRelacion.inventarioTienda,
                            tiendNombre: tiendaAsociada.tiendNombre,
                            tiendDireccion: tiendaAsociada.tiendDireccion
                        };
                        delete plainRelacion.inventarioTienda.tiendasFisicas;
                    } else {

                        plainRelacion.inventarioTienda.tiendNombre = 'Tienda Desconocida';
                        plainRelacion.inventarioTienda.tiendDireccion = 'Dirección Desconocida';
                    }
                } else {

                    plainRelacion.inventarioTienda = {

                        tiendNombre: 'Tienda Desconocida',
                        tiendDireccion: 'Dirección Desconocida'
                    };
                }

                return plainRelacion;
            });

            res.json(relacionesTransformadas);
        } catch (error) {
            console.error("Error al obtener las relaciones de inventario:", error);
            res.status(500).json({ error: "Error al obtener las relaciones de inventario" });
        }
    };

    static getByIds = async (req: Request, res: Response) => {
        try {
            const { invTienIdInventarioTienda, prodIdProducto } = req.params;
            const relacion = await TieneInventarioTiendaProducto.findOne({
                where: { invTienIdInventarioTienda, prodIdProducto },
                include: [
                    {
                        model: Producto,
                        attributes: ['prodNombre', 'prodDescripcion', 'prodPrecio']
                    },
                    {
                        model: InventarioTienda,
                        attributes: ['invTienIdInventarioTienda'],
                        include: [
                            {
                                model: TiendaFisica,
                                as: 'tiendasFisicas',
                                attributes: ['tiendNombre', 'tiendDireccion'],
                                required: false
                            }
                        ],
                        required: false
                    }
                ]
            });
            if (!relacion) {
                res.status(404).json({ error: "Relación de inventario no encontrada" });
                return;
            }

            const plainRelacion: any = relacion.get({ plain: true });

            if (plainRelacion.inventarioTienda) {

                if (plainRelacion.inventarioTienda.tiendasFisicas && plainRelacion.inventarioTienda.tiendasFisicas.length > 0) {
                    const tiendaAsociada = plainRelacion.inventarioTienda.tiendasFisicas[0];
                    plainRelacion.inventarioTienda = {
                        ...plainRelacion.inventarioTienda,
                        tiendNombre: tiendaAsociada.tiendNombre,
                        tiendDireccion: tiendaAsociada.tiendDireccion
                    };
                    delete plainRelacion.inventarioTienda.tiendasFisicas;
                } else {

                    plainRelacion.inventarioTienda.tiendNombre = 'Tienda Desconocida';
                    plainRelacion.inventarioTienda.tiendDireccion = 'Dirección Desconocida';
                }
            } else {

                plainRelacion.inventarioTienda = {

                    tiendNombre: 'Tienda Desconocida',
                    tiendDireccion: 'Dirección Desconocida'
                };
            }

            res.json(plainRelacion);
        } catch (error) {
            console.error("Error al obtener la relación de inventario:", error);
            res.status(500).json({ error: "Error al obtener la relación de inventario" });
        }
    };

    static create = async (req: Request, res: Response) => {
        try {
            const relacion = await TieneInventarioTiendaProducto.create(req.body);
            res.status(201).json({ mensaje: "Relación de inventario creada correctamente", relacion });
        } catch (error) {
            console.error("Error al crear la relación de inventario:", error);
            res.status(500).json({ error: "Error al crear la relación de inventario" });
        }
    };

    static update = async (req: Request, res: Response) => {
        try {
            const { invTienIdInventarioTienda, prodIdProducto } = req.params;
            const { invTienProdCantidad } = req.body;

            const relacion = await TieneInventarioTiendaProducto.findOne({
                where: { invTienIdInventarioTienda, prodIdProducto }
            });

            if (!relacion) {
                res.status(404).json({ error: "Relación de inventario no encontrada" });
                return;
            }

            relacion.invTienProdCantidad = invTienProdCantidad;
            await relacion.save();

            res.json({ mensaje: "Cantidad de producto en inventario actualizada correctamente", relacion });
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en inventario:", error);
            res.status(500).json({ error: "Error al actualizar la cantidad del producto en inventario" });
        }
    };

    static deleteByIds = async (req: Request, res: Response) => {
        try {
            const { invTienIdInventarioTienda, prodIdProducto } = req.params;
            const relacion = await TieneInventarioTiendaProducto.findOne({
                where: { invTienIdInventarioTienda, prodIdProducto }
            });
            if (!relacion) {
                res.status(404).json({ error: "Relación de inventario no encontrada" });
                return;
            }
            await relacion.destroy();
            res.json({ mensaje: "Relación de inventario eliminada correctamente" });
        } catch (error) {
            console.error("Error al eliminar la relación de inventario:", error);
            res.status(500).json({ error: "Error al eliminar la relación de inventario" });
        }
    };
}