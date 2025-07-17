// src/controllers/CarritoDeComprasController.ts
import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize"; // Importar Op para operaciones de Sequelize
import CarritoDeCompras from "../models/carrito_de_compras";
import DetalleCarrito from "../models/detalle_carrito";
import Producto from "../models/producto";
import TieneClienteCarritoDeCompras from "../models/tiene_cliente_carrito_de_compras";
import TieneDetalleProducto from "../models/tiene_detalle_producto";
import TieneInventarioTiendaProducto from "../models/tiene_inventario_tienda_producto";
import { db } from "../config/db"; // Asegúrate de importar tu instancia de Sequelize

export class CarritoDeComprasController {

    // Método para obtener el carrito de compras del cliente autenticado
    // GET /api/cart
    static getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const clCodCliente = req.clientCod;

        if (!clCodCliente) {
            res.status(401).json({ error: "No autorizado: ID de cliente no encontrado en la solicitud." });
            return;
        }

        try {
            const tieneClienteCarrito = await TieneClienteCarritoDeCompras.findOne({
                where: { clCodCliente },
                include: [{
                    model: CarritoDeCompras,
                    as: 'carritoDeCompras', // Alias en TieneClienteCarritoDeCompras
                    include: [{
                        model: DetalleCarrito,
                        as: 'detallesCarrito', // Alias en CarritoDeCompras
                        include: [{
                            model: TieneDetalleProducto,
                            as: 'productosDetalle', // Alias en DetalleCarrito
                            include: [{
                                model: Producto,
                                as: 'producto' // Alias en TieneDetalleProducto
                            }]
                        }]
                    }]
                }]
            });

            if (!tieneClienteCarrito || !tieneClienteCarrito.carritoDeCompras) {
                res.status(200).json({
                    mensaje: "El cliente no tiene un carrito activo.",
                    cart: { items: [], total: 0 }
                });
                return;
            }

            const carrito = tieneClienteCarrito.carritoDeCompras;

            const itemsFormateados = carrito.detallesCarrito.map(detalle => {
                const tieneDetalleProducto = detalle.productosDetalle && detalle.productosDetalle.length > 0
                    ? detalle.productosDetalle[0]
                    : null;
                const producto = tieneDetalleProducto ? tieneDetalleProducto.producto : null;

                return {
                    id: producto?.prodIdProducto,
                    name: producto?.prodNombre,
                    price: parseFloat(producto?.prodPrecio?.toString() || '0'),
                    quantity: detalle.detCantidad,
                    subtotal: parseFloat(detalle.detSubtotal.toString()),
                };
            });

            const totalCarrito = itemsFormateados.reduce((sum, item) => sum + item.subtotal, 0);

            res.status(200).json({
                mensaje: "Carrito obtenido exitosamente.",
                cart: {
                    id: carrito.carIdCarritoDeCompras,
                    estado: carrito.carEstado,
                    items: itemsFormateados,
                    total: totalCarrito
                }
            });

        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            next(error);
        }
    };

    // Método para agregar un producto al carrito o incrementar su cantidad
    // POST /api/cart/add
    static addToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const clCodCliente = req.clientCod;
        const { productId, quantity } = req.body;

        if (!clCodCliente) {
            res.status(401).json({ error: "No autorizado: ID de cliente no encontrado." });
            return;
        }
        if (!productId || typeof quantity !== 'number' || quantity <= 0) {
            res.status(400).json({ error: "ID de producto y cantidad válidos son obligatorios." });
            return;
        }

        const transaction = await db.transaction();

        try {
            const producto = await Producto.findByPk(productId, { transaction });
            if (!producto) {
                await transaction.rollback();
                res.status(404).json({ error: "Producto no encontrado." });
                return;
            }

            const inventarioProducto = await TieneInventarioTiendaProducto.findOne({
                where: { prodIdProducto: productId },
                transaction
            });

            if (!inventarioProducto || inventarioProducto.invTienProdCantidad < quantity) {
                await transaction.rollback();
                res.status(400).json({ error: `Stock insuficiente para el producto ${producto.prodNombre}. Disponibles: ${inventarioProducto?.invTienProdCantidad || 0}.` });
                return;
            }

            let carrito: CarritoDeCompras | null = null;
            let tieneClienteCarrito = await TieneClienteCarritoDeCompras.findOne({ where: { clCodCliente }, transaction });

            if (tieneClienteCarrito) {
                carrito = await CarritoDeCompras.findByPk(tieneClienteCarrito.carIdCarritoDeCompras, { transaction });
            }

            if (!carrito) {
                // AÑADIDO 'as any'
                carrito = await CarritoDeCompras.create({ carEstado: "activo" } as any, { transaction });
                // AÑADIDO 'as any'
                await TieneClienteCarritoDeCompras.create({
                    clCodCliente,
                    carIdCarritoDeCompras: carrito.carIdCarritoDeCompras
                } as any, { transaction });
            }

            let existingDetalleProducto = await TieneDetalleProducto.findOne({
                where: { prodIdProducto: productId },
                include: [{
                    model: DetalleCarrito,
                    as: 'detalleCarrito', // Alias en TieneDetalleProducto
                    where: { carIdCarritoDeCompras: carrito.carIdCarritoDeCompras },
                    required: true
                }],
                transaction
            });

            let detalleCarrito: DetalleCarrito | null = null;

            if (existingDetalleProducto) {
                detalleCarrito = existingDetalleProducto.detalleCarrito;
                const nuevaCantidad = detalleCarrito.detCantidad + quantity;

                if (inventarioProducto.invTienProdCantidad < nuevaCantidad) {
                    await transaction.rollback();
                    res.status(400).json({ error: `No hay suficiente stock para añadir ${quantity} más de ${producto.prodNombre}. La cantidad total en el carrito sería ${nuevaCantidad} pero solo hay ${inventarioProducto.invTienProdCantidad} disponibles.` });
                    return;
                }

                await detalleCarrito.update({
                    detCantidad: nuevaCantidad,
                    detSubtotal: nuevaCantidad * parseFloat(producto.prodPrecio.toString())
                }, { transaction });
            } else {
                // AÑADIDO 'as any'
                detalleCarrito = await DetalleCarrito.create({
                    carIdCarritoDeCompras: carrito.carIdCarritoDeCompras,
                    detCantidad: quantity,
                    detSubtotal: quantity * parseFloat(producto.prodPrecio.toString())
                } as any, { transaction });

                // AÑADIDO 'as any'
                await TieneDetalleProducto.create({
                    detIdDetalleCarrito: detalleCarrito.detIdDetalleCarrito,
                    prodIdProducto: productId
                } as any, { transaction });
            }

            await transaction.commit();
            res.status(200).json({ mensaje: "Producto añadido/actualizado en el carrito.", carritoId: carrito.carIdCarritoDeCompras });

        } catch (error) {
            await transaction.rollback();
            console.error("Error al añadir al carrito:", error);
            next(error);
        }
    };

    // Método para actualizar la cantidad de un producto específico en el carrito
    // PUT /api/cart/update/:productId
    static updateCartItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const clCodCliente = req.clientCod;
        const { productId } = req.params;
        const { newQuantity } = req.body;

        if (!clCodCliente) {
            res.status(401).json({ error: "No autorizado: ID de cliente no encontrado." });
            return;
        }
        if (!productId || typeof newQuantity !== 'number' || newQuantity < 0) {
            res.status(400).json({ error: "ID de producto y nueva cantidad válida son obligatorios." });
            return;
        }

        const transaction = await db.transaction();

        try {
            const tieneClienteCarrito = await TieneClienteCarritoDeCompras.findOne({ where: { clCodCliente }, transaction });
            if (!tieneClienteCarrito) {
                await transaction.rollback();
                res.status(404).json({ error: "El cliente no tiene un carrito activo." });
                return;
            }
            const carId = tieneClienteCarrito.carIdCarritoDeCompras;

            const tieneDetalleProducto = await TieneDetalleProducto.findOne({
                where: { prodIdProducto: parseInt(productId) },
                include: [{
                    model: DetalleCarrito,
                    as: 'detalleCarrito', // Alias en TieneDetalleProducto
                    where: { carIdCarritoDeCompras: carId },
                    required: true
                }],
                transaction
            });

            if (!tieneDetalleProducto || !tieneDetalleProducto.detalleCarrito) {
                await transaction.rollback();
                res.status(404).json({ error: "Producto no encontrado en el carrito del cliente." });
                return;
            }

            const detalleCarrito = tieneDetalleProducto.detalleCarrito;

            if (newQuantity > 0) {
                const producto = await Producto.findByPk(parseInt(productId), { transaction });
                if (!producto) {
                    await transaction.rollback();
                    res.status(404).json({ error: "Producto no encontrado en la base de datos." });
                    return;
                }

                const inventarioProducto = await TieneInventarioTiendaProducto.findOne({
                    where: { prodIdProducto: parseInt(productId) },
                    transaction
                });

                if (!inventarioProducto || inventarioProducto.invTienProdCantidad < newQuantity) {
                    await transaction.rollback();
                    res.status(400).json({ error: `Stock insuficiente para el producto ${producto.prodNombre}. Se solicitan ${newQuantity}, disponibles: ${inventarioProducto?.invTienProdCantidad || 0}.` });
                    return;
                }

                await detalleCarrito.update({
                    detCantidad: newQuantity,
                    detSubtotal: newQuantity * parseFloat(producto.prodPrecio.toString())
                }, { transaction });

            } else {
                await tieneDetalleProducto.destroy({ transaction });
                await detalleCarrito.destroy({ transaction });
            }

            await transaction.commit();
            res.status(200).json({ mensaje: "Cantidad de producto en el carrito actualizada." });

        } catch (error) {
            await transaction.rollback();
            console.error("Error al actualizar la cantidad del carrito:", error);
            next(error);
        }
    };

    // Método para eliminar un producto del carrito
    // DELETE /api/cart/remove/:productId
    static removeCartItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const clCodCliente = req.clientCod;
        const { productId } = req.params;

        if (!clCodCliente) {
            res.status(401).json({ error: "No autorizado: ID de cliente no encontrado." });
            return;
        }
        if (!productId) {
            res.status(400).json({ error: "ID de producto es obligatorio." });
            return;
        }

        const transaction = await db.transaction();

        try {
            const tieneClienteCarrito = await TieneClienteCarritoDeCompras.findOne({ where: { clCodCliente }, transaction });
            if (!tieneClienteCarrito) {
                await transaction.rollback();
                res.status(404).json({ error: "El cliente no tiene un carrito activo." });
                return;
            }
            const carId = tieneClienteCarrito.carIdCarritoDeCompras;

            const tieneDetalleProducto = await TieneDetalleProducto.findOne({
                where: { prodIdProducto: parseInt(productId) },
                include: [{
                    model: DetalleCarrito,
                    as: 'detalleCarrito', // Alias en TieneDetalleProducto
                    where: { carIdCarritoDeCompras: carId },
                    required: true
                }],
                transaction
            });

            if (!tieneDetalleProducto || !tieneDetalleProducto.detalleCarrito) {
                await transaction.rollback();
                res.status(404).json({ error: "Producto no encontrado en el carrito del cliente especificado." });
                return;
            }

            const detalleCarrito = tieneDetalleProducto.detalleCarrito;

            await tieneDetalleProducto.destroy({ transaction });
            await detalleCarrito.destroy({ transaction });

            await transaction.commit();
            res.status(200).json({ mensaje: "Producto eliminado del carrito." });

        } catch (error) {
            await transaction.rollback();
            console.error("Error al eliminar producto del carrito:", error);
            next(error);
        }
    };

    // Método para vaciar completamente el carrito del cliente
    // DELETE /api/cart/clear
    static clearCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const clCodCliente = req.clientCod;

        if (!clCodCliente) {
            res.status(401).json({ error: "No autorizado: ID de cliente no encontrado." });
            return;
        }

        const transaction = await db.transaction();

        try {
            const tieneClienteCarrito = await TieneClienteCarritoDeCompras.findOne({ where: { clCodCliente }, transaction });
            if (!tieneClienteCarrito) {
                await transaction.rollback();
                res.status(200).json({ mensaje: "El carrito ya está vacío o no existe." });
                return;
            }

            const carId = tieneClienteCarrito.carIdCarritoDeCompras;

            const detallesCarrito = await DetalleCarrito.findAll({
                where: { carIdCarritoDeCompras: carId },
                transaction
            });

            for (const detalle of detallesCarrito) {
                await TieneDetalleProducto.destroy({
                    where: { detIdDetalleCarrito: detalle.detIdDetalleCarrito },
                    transaction
                });
                await detalle.destroy({ transaction });
            }

            await TieneClienteCarritoDeCompras.destroy({ where: { clCodCliente }, transaction });
            await CarritoDeCompras.destroy({ where: { carIdCarritoDeCompras: carId }, transaction });

            await transaction.commit();
            res.status(200).json({ mensaje: "Carrito vaciado exitosamente." });

        } catch (error) {
            await transaction.rollback();
            console.error("Error al vaciar el carrito:", error);
            next(error);
        }
    };

    // --- Métodos de CRUD genéricos (puedes eliminarlos si solo usas los de cliente) ---
    static getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const carritos = await CarritoDeCompras.findAll({ order: [['carIdCarritoDeCompras', 'ASC']] });
            res.json(carritos);
        } catch (error) {
            next(error);
        }
    };

    static getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const carrito = await CarritoDeCompras.findByPk(id);
            if (!carrito) {
                res.status(404).json({ error: "Carrito no encontrado" });
                return;
            }
            res.json(carrito);
        } catch (error) {
            next(error);
        }
    };

    static create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const carrito = await CarritoDeCompras.create(req.body); // No se necesita 'as any' aquí si req.body ya tiene el tipo correcto
            res.status(201).json({ mensaje: "Carrito creado correctamente", carrito });
        } catch (error) {
            next(error);
        }
    };

    static updateById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const carrito = await CarritoDeCompras.findByPk(id);
            if (!carrito) {
                res.status(404).json({ error: "Carrito no encontrado" });
                return;
            }
            await carrito.update(req.body);
            res.json({ mensaje: "Carrito actualizado correctamente", carrito });
        } catch (error) {
            next(error);
        }
    };

    static deleteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const carrito = await CarritoDeCompras.findByPk(id);
            if (!carrito) {
                res.status(404).json({ error: "Carrito no encontrado" });
                return;
            }
            await carrito.destroy();
            res.json({ mensaje: "Carrito eliminado correctamente" });
        } catch (error) {
            next(error);
        }
    };
}
