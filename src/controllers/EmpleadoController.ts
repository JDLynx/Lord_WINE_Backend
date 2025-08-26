import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import Empleado from "../models/empleado";
import Administrador from "../models/administrador";
import TiendaFisica from "../models/tienda_fisica";
import { transporter, mailOptions } from "../config/mailer";

export class EmpleadoController {
    static getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const empleados = await Empleado.findAll({
                include: [
                    { model: Administrador, as: 'administrador' },
                    { model: TiendaFisica, as: 'tiendaFisica' }
                ]
            });
            res.status(200).json(empleados);
        } catch (error) {
            console.error("Error al obtener empleados:", error);
            res.status(500).json({ message: "Error del servidor al obtener empleados", detalles: (error as any).message });
        }
    };

    static getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: "ID inválido" });
                return;
            }
            const empleado = await Empleado.findByPk(id, {
                include: [
                    { model: Administrador, as: 'administrador' },
                    { model: TiendaFisica, as: 'tiendaFisica' }
                ]
            });

            if (!empleado) {
                res.status(404).json({ message: "Empleado no encontrado" });
                return;
            }
            res.status(200).json(empleado);
        } catch (error) {
            console.error("Error al obtener empleado:", error);
            res.status(500).json({ message: "Error del servidor al obtener empleado", detalles: (error as any).message });
        }
    };

    static create = async (req: Request, res: Response): Promise<void> => {
        try {
            const {
                emplCorreoElectronico,
                emplContrasena,
                emplNombre,
                emplApellido,
                adminCodAdministrador,
                tiendIdTiendaFisica
            } = req.body;

            if (!emplCorreoElectronico || !emplContrasena) {
                res.status(400).json({ message: "Correo electrónico y contraseña son obligatorios" });
                return;
            }
            const hash = await bcrypt.hash(emplContrasena, 10);

            const nuevoEmpleado = await Empleado.create({
                ...req.body,
                emplContrasena: hash,
                adminCodAdministrador,
                tiendIdTiendaFisica
            });

            try {
                const htmlContent = `
                    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                        <h2 style="color: #921913; text-align: center;">¡Nueva cuenta de empleado creada!</h2>
                        <p>Hola **${emplNombre || ''} ${emplApellido || ''}**,</p>
                        <p>Se ha creado una cuenta de empleado para ti en el sistema de gestión de Lord Wine.</p>
                        <p>Puedes acceder al panel con las siguientes credenciales:</p>
                        <ul>
                            <li><strong>Correo electrónico:</strong> ${emplCorreoElectronico}</li>
                        </ul>
                        <p>Utiliza la contraseña que se te proporcionó para iniciar sesión por primera vez.</p>
                        <p>Si tienes alguna duda o necesitas ayuda, no dudes en contactar a tu supervisor o al equipo de soporte.</p>
                        <p>Atentamente,<br>El equipo de Lord Wine</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin-top: 20px;">
                        <p style="text-align: center; font-size: 12px; color: #999;">Este es un correo automático. Por favor, no respondas a esta dirección.</p>
                    </div>
                `;
                await transporter.sendMail(
                    mailOptions(
                        emplCorreoElectronico,
                        "Tu cuenta de empleado de Lord Wine",
                        htmlContent
                    )
                );
                console.log(`📩 Correo de bienvenida para empleado enviado a ${emplCorreoElectronico}`);
            } catch (emailError) {
                console.error("❌ Error al enviar correo de bienvenida para empleado:", emailError);
            }

            res.status(201).json(nuevoEmpleado);
        } catch (error: any) {
            console.error("Error al crear empleado:", error);
            if (error.name === "SequelizeValidationError") {
                const mensajes = error.errors.map((err: any) => `${err.path}: ${err.message}`);
                res.status(400).json({ message: mensajes.join(", ") });
            } else if (error.name === "SequelizeUniqueConstraintError") {
                const mensajes = error.errors.map((err: any) => `${err.path} ya registrado`);
                res.status(400).json({ message: mensajes.join(", ") });
            } else {
                res.status(500).json({ message: "Error del servidor al crear empleado", detalles: error.message || error });
            }
        }
    };

    static update = async (req: Request, res: Response): Promise<void> => {
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
            res.status(200).json(empleado);
        } catch (error: any) {
            console.error("Error al actualizar empleado:", error);
            if (error.name === "SequelizeValidationError") {
                const mensajes = error.errors.map((err: any) => `${err.path}: ${err.message}`);
                res.status(400).json({ message: mensajes.join(", ") });
            } else {
                res.status(500).json({ message: "Error del servidor al actualizar empleado", detalles: error.message || error });
            }
        }
    };

    static delete = async (req: Request, res: Response): Promise<void> => {
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
            res.status(204).send();
        } catch (error) {
            console.error("Error al eliminar empleado:", error);
            res.status(500).json({ message: "Error del servidor al eliminar empleado", detalles: (error as any).message });
        }
    };

    static cambiarContrasena = async (req: Request, res: Response): Promise<void> => {
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
            res.status(500).json({ message: "Error del servidor al cambiar la contraseña", detalles: (error as any).message });
        }
    };
}