// Importación de los tipos para tipar las solicitudes y respuestas de Express
import type { Request, Response } from "express";
// Importación del módulo bcrypt para el cifrado de contraseñas
import bcrypt from "bcrypt";
// Importación del modelo Sequelize 'Administrador'
import Administrador from "../models/administrador";

// Clase que agrupa todos los métodos de controladores relacionados al modelo Administrador
export class AdministradorControllers
{
  // Método para obtener todos los administradores ordenados por código
  static getAdministradorAll = async (req: Request, res: Response): Promise<void> => {
    try {
      // Consulta todos los registros y los ordena ascendentemente por código
      const administradores = await Administrador.findAll({ order: [['adminCodAdministrador', 'ASC']] });

      // Devuelve la lista como respuesta JSON
      res.json(administradores);
    } catch (error) {
      // En caso de error, muestra el error en consola y devuelve un error 500
      console.error("Error al obtener administradores:", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  };

  // Método para obtener un administrador por su ID
  static getAdministradorById = async (req: Request, res: Response): Promise<void> => {
    try {
      // Extrae el ID desde los parámetros de la URL
      const { id } = req.params;

      // Busca el administrador por clave primaria (ID)
      const administrador = await Administrador.findByPk(id);

      // Si no existe, responde con 404
      if (!administrador) {
        res.status(404).json({ error: "Administrador no encontrado" });
        return;
      }

      // Si existe, lo devuelve como respuesta
      res.json(administrador);
    } catch (error) {
      console.error("Error al obtener administrador por ID:", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  };

  // Método para crear un nuevo administrador
  static crearAdministrador = async (req: Request, res: Response): Promise<void> => {
    try {
      const { adminCorreoElectronico, adminContrasena } = req.body;

      // Verifica que los campos obligatorios estén presentes
      if (!adminCorreoElectronico || !adminContrasena) {
        res.status(400).json({ error: "Correo electrónico y contraseña son obligatorios" });
        return;
      }

      // Cifra la contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(adminContrasena, 10);

      // Crea el nuevo administrador en la base de datos
      const administrador = await Administrador.create({
        ...req.body,
        adminContrasena: hashedPassword
      });

      // Devuelve mensaje y datos del nuevo administrador
      res.status(201).json({ mensaje: "Administrador creado correctamente", administrador });
    } catch (error) {
      console.error("Error al crear administrador:", error);
      res.status(500).json({ error: "Error al crear el administrador" });
    }
  };

  // Método para actualizar un administrador por su ID
  static actualizarAdministradorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Busca el administrador a actualizar
      const administrador = await Administrador.findByPk(id);

      if (!administrador) {
        res.status(404).json({ error: "Administrador no encontrado" });
        return;
      }

      // Si se envía una nueva contraseña, la cifra antes de actualizar
      if (req.body.adminContrasena) {
        req.body.adminContrasena = await bcrypt.hash(req.body.adminContrasena, 10);
      }

      // Actualiza los datos del administrador
      await administrador.update(req.body);

      // Devuelve mensaje y datos actualizados
      res.json({ mensaje: "Administrador actualizado correctamente", administrador });
    } catch (error) {
      console.error("Error al actualizar administrador:", error);
      res.status(500).json({ error: "Error al actualizar el administrador" });
    }
  };

  // Método para eliminar un administrador por su ID
  static eliminarAdministradorId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Busca el administrador a eliminar
      const administrador = await Administrador.findByPk(id);

      if (!administrador) {
        res.status(404).json({ error: "Administrador no encontrado" });
        return;
      }

      // Elimina el registro de la base de datos
      await administrador.destroy();

      // Devuelve mensaje de éxito
      res.json({ mensaje: "Administrador eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar administrador:", error);
      res.status(500).json({ error: "Error al eliminar el administrador" });
    }
  };

  // Método para iniciar sesión de un administrador
  static loginAdministrador = async (req: Request, res: Response): Promise<void> => {
    try {
      const { adminCorreoElectronico, adminContrasena } = req.body;

      // Verifica que se envíen los campos requeridos
      if (!adminCorreoElectronico || !adminContrasena) {
        res.status(400).json({ error: "Correo electrónico y contraseña requeridos" });
        return;
      }

      // Busca al administrador por correo electrónico
      const administrador = await Administrador.findOne({ where: { adminCorreoElectronico } });

      if (!administrador) {
        res.status(401).json({ error: "Credenciales inválidas" });
        return;
      }

      // Compara la contraseña enviada con la cifrada en la base de datos
      const match = await bcrypt.compare(adminContrasena, administrador.adminContrasena);

      if (!match) {
        res.status(401).json({ error: "Credenciales inválidas" });
        return;
      }

      // Devuelve mensaje de éxito y datos del administrador
      res.status(200).json({ mensaje: "Login exitoso", administrador });
    } catch (error) {
      console.error("Error en login de administrador:", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  };
}