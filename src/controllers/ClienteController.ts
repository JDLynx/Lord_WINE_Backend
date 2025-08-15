import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Cliente from "../models/cliente";
import { transporter, mailOptions } from "../config/mailer";

dotenv.config();

export class ClienteControllers {
    static getClienteAll = async (req: Request, res: Response): Promise<void> => {
        try {
        const clientes = await Cliente.findAll({ order: [["clCodCliente", "ASC"]] });
        res.status(200).json(clientes);
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error del servidor al obtener los clientes", detalles: (error as any).message });
        }
    };

    static getClienteById = async (req: Request, res: Response): Promise<void> => {
        try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "ID inválido" });
            return;
        }

        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            res.status(404).json({ error: "Cliente no encontrado" });
            return;
        }

        res.status(200).json(cliente);
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error del servidor al obtener el cliente", detalles: (error as any).message });
        }
    };

    static crearCliente = async (req: Request, res: Response): Promise<void> => {
        try {
        const { clCorreoElectronico, clContrasena, clNombre, clApellido } = req.body;

        if (!clCorreoElectronico || !clContrasena) {
            res.status(400).json({ error: "Correo electrónico y contraseña son obligatorios" });
            return;
        }

        const hashedPassword = await bcrypt.hash(clContrasena, 10);
        const nuevoCliente = await Cliente.create({
            ...req.body,
            clContrasena: hashedPassword,
        });

        try {
            const htmlContent = `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="color: #6a1b9a; text-align: center;">¡Bienvenido/a a Lord Wine! 🍷</h2>
                    <p>Hola **${clNombre || ''} ${clApellido || ''}**,</p>
                    <p>¡Gracias por registrarte en nuestra tienda! Estamos muy felices de tenerte con nosotros y esperamos que disfrutes explorando nuestra exquisita selección de productos.</p>
                    <p>Tu cuenta ha sido creada exitosamente con el correo electrónico: <strong>${clCorreoElectronico}</strong>.</p>
                    <p>Ahora puedes iniciar sesión para descubrir las mejores ofertas y los productos más exclusivos.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="URL_DE_TU_SITIO_WEB" style="background-color: #6a1b9a; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Descubre nuestros productos
                        </a>
                    </div>
                    <p>Si tienes alguna pregunta, no dudes en contactarnos. ¡Esperamos verte pronto!</p>
                    <p>Atentamente,<br>El equipo de Lord Wine</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin-top: 20px;">
                    <p style="text-align: center; font-size: 12px; color: #999;">Este es un correo automático, por favor no respondas a esta dirección.</p>
                </div>
            `;

            await transporter.sendMail(
            mailOptions(
                clCorreoElectronico,
                "Bienvenido a Lord Wine 🍷 - Tu registro ha sido exitoso",
                htmlContent
            )
            );
            console.log(`📩 Correo de bienvenida enviado a ${clCorreoElectronico}`);
        } catch (emailError) {
            console.error("❌ Error al enviar correo de bienvenida:", emailError);
        }

        res.status(201).json({ mensaje: "Cliente creado correctamente", cliente: nuevoCliente });
        } catch (error: any) {
        console.error(error);

        if (error.name === "SequelizeValidationError") {
            const mensajes = error.errors.map((err: any) => `${err.path}: ${err.message}`);
            res.status(400).json({ error: mensajes.join(", ") });
        } else if (error.name === "SequelizeUniqueConstraintError") {
            const mensajes = error.errors.map((err: any) => `${err.path} ya registrado`);
            res.status(400).json({ error: mensajes.join(", ") });
        } else {
            res.status(500).json({ error: "Error del servidor al crear el cliente", detalles: error.message || error });
        }
        }
    };

    static actualizarClienteId = async (req: Request, res: Response): Promise<void> => {
        try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "ID inválido" });
            return;
        }

        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            res.status(404).json({ error: "Cliente no encontrado" });
            return;
        }

        if (req.body.clContrasena) {
            req.body.clContrasena = await bcrypt.hash(req.body.clContrasena, 10);
        }

        await cliente.update(req.body);
        res.status(200).json({ mensaje: "Cliente actualizado correctamente", cliente });
        } catch (error: any) {
        console.error(error);

        if (error.name === "SequelizeValidationError") {
            const mensajes = error.errors.map((err: any) => `${err.path}: ${err.message}`);
            res.status(400).json({ error: mensajes.join(", ") });
        } else if (error.name === "SequelizeUniqueConstraintError") {
            const mensajes = error.errors.map((err: any) => `${err.path} ya registrado`);
            res.status(400).json({ error: mensajes.join(", ") });
        } else {
            res.status(500).json({ error: "Error del servidor al actualizar el cliente", detalles: error.message || error });
        }
        }
    };

    static eliminarClienteId = async (req: Request, res: Response): Promise<void> => {
        try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: "ID inválido" });
            return;
        }

        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            res.status(404).json({ error: "Cliente no encontrado" });
            return;
        }

        await cliente.destroy();
        res.status(200).json({ mensaje: "Cliente eliminado correctamente" });
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error del servidor al eliminar el cliente", detalles: (error as any).message });
        }
    };

    static loginCliente = async (req: Request, res: Response): Promise<void> => {
        try {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            res.status(400).json({ error: "Correo electrónico y contraseña son obligatorios" });
            return;
        }

        const cliente = await Cliente.findOne({ where: { clCorreoElectronico: correo } });
        if (!cliente) {
            res.status(401).json({ error: "Credenciales inválidas" });
            return;
        }

        const match = await bcrypt.compare(contrasena, cliente.clContrasena);
        if (!match) {
            res.status(401).json({ error: "Credenciales inválidas" });
            return;
        }

        res.status(200).json({ mensaje: "Login exitoso", cliente });
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error del servidor al iniciar sesión", detalles: (error as any).message });
        }
    };

    static changePassword = async (req: Request, res: Response): Promise<void> => {
        try {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            res.status(400).json({ message: "La contraseña actual y la nueva contraseña son obligatorias." });
            return;
        }

        const cliente = await Cliente.findByPk(parseInt(id));
        if (!cliente) {
            res.status(404).json({ message: "Cliente no encontrado." });
            return;
        }

        const isMatch = await bcrypt.compare(currentPassword, cliente.clContrasena);
        if (!isMatch) {
            res.status(401).json({ message: "Contraseña actual incorrecta." });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        cliente.clContrasena = hashedPassword;
        await cliente.save();

        res.status(200).json({ message: "Contraseña cambiada exitosamente." });
        } catch (error) {
        console.error("Error al cambiar la contraseña del cliente:", error);
        res.status(500).json({ message: "Error interno del servidor al cambiar la contraseña.", detalles: (error as any).message });
        }
    };
}