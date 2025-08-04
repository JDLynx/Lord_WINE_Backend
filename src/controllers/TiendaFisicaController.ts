import { Request, Response } from "express";
import TiendaFisica from "../models/tienda_fisica";
import { InventarioTienda } from "../models/inventario_tienda";
import { TieneTiendaFisicaInventarioTienda } from "../models/tiene_tienda_fisica_inventario_tienda";
import TieneInventarioTiendaProducto from "../models/tiene_inventario_tienda_producto";
import { db } from "../config/db";

export class TiendaFisicaController {
    static getAll = async (req: Request, res: Response) => {
        try {
            const tiendas = await TiendaFisica.findAll({ order: [["tiendIdTiendaFisica", "ASC"]] });
            res.json(tiendas);
        } catch (error) {
            console.error("Error al obtener las tiendas físicas:", error);
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
        } catch (error) {
            console.error("Error al obtener la tienda física:", error);
            res.status(500).json({ error: "Error al obtener la tienda física" });
        }
    };

    static create = async (req: Request, res: Response) => {
        try {
            const { tiendNombre, tiendDireccion, tiendTelefono, adminCodAdministrador } = req.body;

            const now = new Date();

            const nuevaTienda = await TiendaFisica.create({
                tiendNombre,
                tiendDireccion,
                tiendTelefono,
                adminCodAdministrador,
                createdAt: now,
                updatedAt: now
            });

            const nuevoInventarioTienda = await InventarioTienda.create({
                invTienCantidadDisponible: 0,
                invGenIdInventarioGeneral: 1,
                createdAt: now,
                updatedAt: now
            });

            await TieneTiendaFisicaInventarioTienda.create({
                tiendIdTiendaFisica: nuevaTienda.tiendIdTiendaFisica,
                invTienIdInventarioTienda: nuevoInventarioTienda.invTienIdInventarioTienda,
                createdAt: now,
                updatedAt: now
            });

            res.status(201).json({
                mensaje: "Tienda física creada y su inventario asignado correctamente",
                tienda: nuevaTienda,
                inventario: nuevoInventarioTienda
            });

        } catch (error) {
            console.error("Error al crear la tienda física y asignar inventario:", error);
            res.status(500).json({ error: "Error al crear la tienda física y asignar inventario" });
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
        } catch (error) {
            console.error("Error al actualizar la tienda física:", error);
            res.status(500).json({ error: "Error al actualizar la tienda física" });
        }
    };

    static deleteById = async (req: Request, res: Response) => {
        const t = await db.transaction();

        try {
            const { id } = req.params;
            const tienda = await TiendaFisica.findByPk(id, { transaction: t });

            if (!tienda) {
                await t.rollback();
                res.status(404).json({ error: "Tienda física no encontrada" });
                return;
            }

            const tieneTiendaInvRelation = await TieneTiendaFisicaInventarioTienda.findOne({
                where: { tiendIdTiendaFisica: id },
                transaction: t
            });

            if (tieneTiendaInvRelation) {
                const invTienId = tieneTiendaInvRelation.invTienIdInventarioTienda;

                await TieneInventarioTiendaProducto.destroy({
                    where: { invTienIdInventarioTienda: invTienId },
                    transaction: t
                });
                console.log(`Eliminados productos del inventario ${invTienId}`);

                await tieneTiendaInvRelation.destroy({ transaction: t });
                console.log(`Eliminada relación TieneTiendaFisicaInventarioTienda para tienda ${id}`);

                await InventarioTienda.destroy({
                    where: { invTienIdInventarioTienda: invTienId },
                    transaction: t
                });
                console.log(`Eliminado InventarioTienda ${invTienId}`);
            } else {
                console.log(`No se encontró relación TieneTiendaFisicaInventarioTienda para tienda ${id}. Continuando con la eliminación de la tienda.`);
            }

            await tienda.destroy({ transaction: t });
            console.log(`Eliminada TiendaFisica ${id}`);

            await t.commit();
            res.json({ mensaje: "Tienda eliminada correctamente y sus relaciones asociadas" });

        } catch (error) {
            await t.rollback();
            console.error("Error al eliminar la tienda física y sus relaciones:", error);
            res.status(500).json({ error: "Error al eliminar la tienda física y sus relaciones" });
        }
    };
}