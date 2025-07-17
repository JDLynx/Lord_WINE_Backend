// src/controllers/ProductoController.ts
import { Request, Response, NextFunction } from "express"; // Importar NextFunction
import Producto from "../models/producto";
import Categoria from "../models/categoria"; // Importar Categoria si la usas para el nombre

export class ProductoController {
    static getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Incluimos la categoría si tienes una asociación BelongsTo en Producto
            // Si no tienes una asociación directa a Categoria en Producto,
            // y solo tienes categIdCategoria, el mapeo de 'category' abajo es más simple.
            const productos = await Producto.findAll({
                order: [['prodIdProducto', 'ASC']],
                // Si tienes una asociación BelongsTo con Categoria en tu modelo Producto:
                // include: [{ model: Categoria, as: 'categoria' }]
            });

            // Formatear los productos para incluir la propiedad 'category' que usa tu frontend
            const productosFormateados = productos.map(p => {
                let categoryString = 'otros'; // Valor por defecto

                // Lógica de mapeo de categIdCategoria a string de categoría
                // AJUSTA ESTA LÓGICA SEGÚN LOS IDs REALES DE TUS CATEGORÍAS EN LA DB
                // Y CÓMO QUIERES QUE SE LLAMEN EN EL FRONTEND.
                // Si tu modelo Producto ya tiene una columna 'category' con el string, úsala directamente.
                if ((p as any).categIdCategoria === 1) { // Ejemplo: ID 1 para Vinos
                    categoryString = 'vinos';
                } else if ((p as any).categIdCategoria === 2) { // Ejemplo: ID 2 para Mistelas
                    categoryString = 'mistelas';
                } else if ((p as any).categIdCategoria === 3) { // Ejemplo: ID 3 para Zumo
                    categoryString = 'zumo';
                } else if ((p as any).categIdCategoria === 4) { // Ejemplo: ID 4 para Cremas de Whisky
                    categoryString = 'cremas-whisky';
                }
                // Si tu modelo Producto tiene una propiedad 'category' directamente (ej. p.category), úsala:
                // categoryString = (p as any).category || 'otros';


                return {
                    prodIdProducto: p.prodIdProducto,
                    prodNombre: p.prodNombre,
                    prodDescripcion: p.prodDescripcion,
                    prodPrecio: parseFloat(p.prodPrecio.toString()), // Asegurar que sea número
                    // Asegúrate de que estas propiedades existan en tu modelo Producto si las necesitas en el frontend
                    prodImagenUrl: (p as any).prodImagenUrl || `https://placehold.co/200x200/cccccc/333333?text=${p.prodNombre}`,
                    prodPresentacion: (p as any).prodPresentacion || '',
                    category: categoryString, // Propiedad 'category' para el frontend
                    comingSoon: false // Asumo que si está en la DB, no es "próximamente"
                };
            });

            res.status(200).json(productosFormateados);
        } catch (error) {
            console.error("Error al obtener los productos:", error);
            next(error); // Pasa el error al manejador de errores de Express
        }
    };

    static getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const producto = await Producto.findByPk(id);
            if (!producto) {
                res.status(404).json({ error: "Producto no encontrado" });
                return;
            }
            res.json(producto);
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            next(error);
        }
    };

    static create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Usar 'as any' para evitar errores de tipado con createdAt/updatedAt si es necesario
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
            // Usar 'as any' para evitar errores de tipado con createdAt/updatedAt si es necesario
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
