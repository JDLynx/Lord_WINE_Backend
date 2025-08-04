import { Request, Response, NextFunction } from "express";
import Producto from "../models/producto";
import Categoria from "../models/categoria";

export class ProductoController {
    static getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const productos = await Producto.findAll({
                order: [['prodIdProducto', 'ASC']],
                include: [{ model: Categoria, as: 'categoria' }]
            });

            const productosFormateados = productos.map(p => {
                return {
                    prodIdProducto: p.prodIdProducto,
                    prodNombre: p.prodNombre,
                    prodDescripcion: p.prodDescripcion,
                    prodPrecio: parseFloat(p.prodPrecio.toString()),
                    prodImagenUrl: (p as any).prodImagenUrl || `https://placehold.co/200x200/cccccc/333333?text=${p.prodNombre}`,
                    prodPresentacion: (p as any).prodPresentacion || '',
                    categIdCategoria: p.categIdCategoria,
                    category: p.categoria ? p.categoria.catNombre : 'Desconocida',
                    comingSoon: false
                };
            });

            res.status(200).json(productosFormateados);
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            next(error);
        }
    };

    static getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const producto = await Producto.findByPk(id, {
                include: [{ model: Categoria, as: 'categoria' }]
            });
            if (!producto) {
                res.status(404).json({ error: "Producto no encontrado" });
                return;
            }
            const formattedProducto = {
                prodIdProducto: producto.prodIdProducto,
                prodNombre: producto.prodNombre,
                prodDescripcion: producto.prodDescripcion,
                prodPrecio: parseFloat(producto.prodPrecio.toString()),
                prodImagenUrl: (producto as any).prodImagenUrl || `https://placehold.co/200x200/cccccc/333333?text=${producto.prodNombre}`,
                prodPresentacion: (producto as any).prodPresentacion || '',
                categIdCategoria: producto.categIdCategoria,
                category: producto.categoria ? producto.categoria.catNombre : 'Desconocida',
                comingSoon: false
            };
            res.json(formattedProducto);
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            next(error);
        }
    };

    static create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const producto = await Producto.create(req.body as any);
            res.status(201).json({ mensaje: "Producto creado correctamente", producto });
        } catch (error) {
            console.error("Error al crear el producto:", error);
            next(error);
        }
    };

    static updateById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const producto = await Producto.findByPk(id);
            if (!producto) {
                res.status(404).json({ error: "Producto no encontrado" });
                return;
            }
            await producto.update(req.body as any);
            res.json({ mensaje: "Producto actualizado correctamente", producto });
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            next(error);
        }
    };

    static deleteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const producto = await Producto.findByPk(id);
            if (!producto) {
                res.status(404).json({ error: "Producto no encontrado" });
                return;
            }
            await producto.destroy();
            res.json({ mensaje: "Producto eliminado correctamente" });
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            next(error);
        }
    };
}