import { Request, Response } from 'express';
import Administrador from '../models/administrador';
import Empleado from '../models/empleado';
import Cliente from '../models/cliente';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response): Promise<void> => {
    // Se reciben los datos de login
    const { correo, contrasena } = req.body;

    try {
        // 1️⃣ Verificación para Administrador
        const admin = await Administrador.findOne({ where: { adminCorreoElectronico: correo } });
        if (admin && await bcrypt.compare(contrasena, admin.adminContrasena)) {
            res.json({ id: admin.adminCodAdministrador, rol: 'Administrador' });
            return;
        }

        // 2️⃣ Verificación para Empleado
        const empleado = await Empleado.findOne({ where: { emplCorreoElectronico: correo } });
        if (empleado && await bcrypt.compare(contrasena, empleado.emplContrasena)) {
            res.json({ id: empleado.emplCodEmpleado, rol: 'Empleado' });
            return;
        }

        // 3️⃣ Verificación para Cliente
        const cliente = await Cliente.findOne({ where: { clCorreoElectronico: correo } });
        if (cliente && await bcrypt.compare(contrasena, cliente.clContrasena)) {
            res.json({ id: cliente.clCodCliente, rol: 'Cliente' });
            return;
        }

        // Si no existe en ninguna tabla o la contraseña no coincide
        res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    } catch (error) {
        // Si hay un error en la operación de búsqueda o comparación
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};