import { Sequelize } from 'sequelize-typescript';  // Importa Sequelize con soporte para decoradores TypeScript
import dotenv from 'dotenv';  // Importa dotenv para manejar variables de entorno

dotenv.config();  // Carga las variables de entorno desde el archivo .env automáticamente

export const db = new Sequelize(
{
    // Nombre de la base de datos, cargado desde variables de entorno
    database: process.env.DB_DATABASE as string,
    // Usuario para conectar a la base de datos
    username: process.env.DB_USER as string,
    // Contraseña del usuario de la base de datos
    password: process.env.DB_PASSWORD as string,
    // Host donde se encuentra la base de datos (ej. localhost o IP)
    host: process.env.DB_HOST as string,
    // Puerto en el que escucha la base de datos (convertido a número)
    port: parseInt(process.env.DB_PORT as string, 10),
    // Tipo de base de datos a usar, en este caso MySQL
    dialect: 'mysql',
    // Ruta para cargar automáticamente todos los modelos que estén dentro de la carpeta models y subcarpetas
    models: [__dirname + '/../models/**/*.ts'],
    // Deshabilita el logging para no saturar la consola con mensajes SQL
    logging: false,
    // Configuración del pool de conexiones para optimizar recursos
    pool:
    {
        max: 10,        // Máximo número de conexiones simultáneas en el pool
        min: 0,         // Mínimo número de conexiones en el pool
        acquire: 30000, // Tiempo máximo en ms para intentar obtener una conexión antes de error
        idle: 10000,    // Tiempo máximo en ms que una conexión puede estar inactiva antes de ser liberada
    },
});