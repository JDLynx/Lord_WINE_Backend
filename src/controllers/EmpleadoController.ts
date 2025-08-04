import { Request, Response } from "express";
import Empleado from "../models/empleado";
import Administrador from "../models/administrador";
import bcrypt from "bcrypt";

export const EmpleadoController = {
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            const empleados = await Empleado.findAll({
                include: [{ model: Administrador }]
            });
            res.status(200).json(empleados);
        } catch (error) {
            console.error("Error al obtener empleados:", error);
            res.status(500).json({ message: "Error al obtener empleados" });
        }
    },

    getById: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const empleado = await Empleado.findByPk(id, {
                include: [{ model: Administrador }]
            });

            if (!empleado) {
                res.status(404).json({ message: "Empleado no encontrado" });
                return;
            }

            res.status(200).json(empleado);
        } catch (error) {
            console.error("Error al obtener empleado:", error);
            res.status(500).json({ message: "Error al obtener empleado" });
        }
    },

    create: async (req: Request, res: Response): Promise<void> => {
        try {
            const { emplContrasena, ...restoDatos } = req.body;
            const hash = await bcrypt.hash(emplContrasena, 10);
            const nuevoEmpleado = await Empleado.create({
                ...restoDatos,
                emplContrasena: hash
            });
            res.status(201).json(nuevoEmpleado);
        } catch (error) {
            console.error("Error al crear empleado:", error);
            res.status(500).json({ message: "Error al crear empleado" });
        }
    },

    update: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const empleado = await Empleado.findByPk(id);

            if (!empleado) {
                res.status(404).json({ message: "Empleado no encontrado" });
                return;
            }

            await empleado.update(req.body);
            res.status(200).json(empleado);
        } catch (error) {
            console.error("Error al actualizar empleado:", error);
            res.status(500).json({ message: "Error al actualizar empleado" });
        }
    },

    delete: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const empleado = await Empleado.findByPk(id);

            if (!empleado) {
                res.status(404).json({ message: "Empleado no encontrado" });
                return;
            }

            await empleado.destroy();
            res.status(204).send();
        } catch (error) {
            console.error("Error al eliminar empleado:", error);
            res.status(500).json({ message: "Error al eliminar empleado" });
        }
    },

    cambiarContrasena: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const { currentPassword, newPassword } = req.body;

            if (isNaN(id)) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }

            const empleado = await Empleado.findByPk(id);
            if (!empleado) {
                res.status(404).json({ message: "Empleado no encontrado" });
                return;
            }

            const contrasenaValida = await bcrypt.compare(currentPassword, empleado.emplContrasena);
            if (!contrasenaValida) {
                res.status(401).json({ message: "La contraseña actual es incorrecta" });
                return;
            }

            const nuevaContrasenaEncriptada = await bcrypt.hash(newPassword, 10);
            empleado.emplContrasena = nuevaContrasenaEncriptada;
            await empleado.save();

            res.status(200).json({ message: "Contraseña actualizada correctamente" });
        } catch (error) {
            console.error("Error al cambiar la contraseña:", error);
            res.status(500).json({ message: "Error del servidor al cambiar la contraseña" });
        }
    }
};

export default EmpleadoController;