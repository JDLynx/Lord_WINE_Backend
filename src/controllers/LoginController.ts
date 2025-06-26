import { Request, Response } from 'express';
import Administrador from '../models/administrador';
import Empleado from '../models/empleado';
import Cliente from '../models/cliente';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response): Promise<void> => {

    const { correo, contrasena } = req.body;

    try {

        const admin = await Administrador.findOne({ where: { adminCorreoElectronico: correo } });
        if (admin && await bcrypt.compare(contrasena, admin.adminContrasena)) {
            res.json({ id: admin.adminCodAdministrador, rol: 'Administrador' });
            return;
        }

        const empleado = await Empleado.findOne({ where: { emplCorreoElectronico: correo } });
        if (empleado && await bcrypt.compare(contrasena, empleado.emplContrasena)) {
            res.json({ id: empleado.emplCodEmpleado, rol: 'Empleado' });
            return;
        }

        const cliente = await Cliente.findOne({ where: { clCorreoElectronico: correo } });
        if (cliente && await bcrypt.compare(contrasena, cliente.clContrasena)) {
            res.json({ id: cliente.clCodCliente, rol: 'Cliente' });
            return;
        }

        res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};