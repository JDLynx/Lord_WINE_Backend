import { Request, Response } from "express";
import { ValidationError, UniqueConstraintError } from "sequelize";
import Empleado from "../models/empleado";

export const EmpleadoControllers =
{
    getEmpleados: async (_req: Request, res: Response): Promise<void> => {
        try {
        const empleados = await Empleado.findAll();
        res.status(200).json(empleados);
        } catch (error) {
        console.error("Error al obtener empleados:", error);
        res.status(500).json({ message: "Error del servidor al obtener los empleados" });
        }
    },

    getEmpleadoById: async (req: Request, res: Response): Promise<void> => {
        try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "ID inválido" });
            return;
        }

        const empleado = await Empleado.findByPk(id);
        if (!empleado) {
            res.status(404).json({ message: "Empleado no encontrado" });
            return;
        }

        res.status(200).json(empleado);
        } catch (error) {
        console.error("Error al obtener empleado:", error);
        res.status(500).json({ message: "Error del servidor al obtener el empleado" });
        }
    },

    crearEmpleado: async (req: Request, res: Response): Promise<void> => {
        try {
        const nuevoEmpleado = await Empleado.create(req.body);
        res.status(201).json({ message: "Empleado creado correctamente", empleado: nuevoEmpleado });
        } catch (error: any) {
        if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
            const errores = error.errors.map((e) => ({
            campo: e.path,
            mensaje: e.message
            }));
            const tipo = error instanceof UniqueConstraintError ? "Error de campos únicos duplicados" : "Error de validación";
            res.status(400).json({ message: tipo, errores });
        } else {
            console.error("Error al crear empleado:", error);
            res.status(500).json({ message: "Error del servidor al crear el empleado" });
        }
        }
    },

    actualizarEmpleado: async (req: Request, res: Response): Promise<void> => {
        try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "ID inválido" });
            return;
        }

        const empleado = await Empleado.findByPk(id);
        if (!empleado) {
            res.status(404).json({ message: "Empleado no encontrado" });
            return;
        }

        await empleado.update(req.body);
        res.status(200).json({ message: "Empleado actualizado correctamente", empleado });
        } catch (error: any) {
        if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
            const errores = error.errors.map((e) => ({
            campo: e.path,
            mensaje: e.message
            }));
            const tipo = error instanceof UniqueConstraintError ? "Error de campos únicos duplicados" : "Error de validación";
            res.status(400).json({ message: tipo, errores });
        } else {
            console.error("Error al actualizar empleado:", error);
            res.status(500).json({ message: "Error del servidor al actualizar el empleado" });
        }
        }
    },

    eliminarEmpleado: async (req: Request, res: Response): Promise<void> => {
        try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "ID inválido" });
            return;
        }

        const empleado = await Empleado.findByPk(id);
        if (!empleado) {
            res.status(404).json({ message: "Empleado no encontrado" });
            return;
        }

        await empleado.destroy();
        res.status(200).json({ message: "Empleado eliminado correctamente" });
        } catch (error: any) {
        console.error("Error al eliminar empleado:", error);
        res.status(500).json({ message: "Error del servidor al eliminar el empleado" });
        }
    }
};