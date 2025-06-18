import express from 'express';
import colors from 'colors'; // Para colorear los logs en consola
import morgan from 'morgan'; // Middleware para logs HTTP
import cors from 'cors';
import { db } from './config/db'; // Instancia Sequelize configurada
import administradorRouter from './routes/administradorRouter';
import servicioEmpresarialRouter from './routes/servicioEmpresarialRouter';
import clienteRouter from './routes/clienteRouter';
import pedidoRouter from './routes/pedidoRouter';
import empleadoRouter from './routes/empleadoRouter';

// Función para conectar a la base de datos y probar con una consulta simple
async function connectDB()
{
    try
    {
        // Intentar autenticar la conexión a la base de datos
        await db.authenticate();
        console.log(colors.blue.bold('Conexión exitosa a la BD'));
        // Ejecutar una consulta SQL simple para verificar que funciona la conexión
        try
        {
            const [results, metadata] = await db.query('SELECT * FROM Administrador LIMIT 5');
            console.log('Datos de ejemplo:', results); // Mostrar resultados en consola
        }
        catch (error)
        {
            console.error('Error al ejecutar la consulta:', error);
        }
    }
    catch (error)
    {
        console.error('Error al conectar a la BD:', error);
        console.log(colors.red.bold('Falló la conexión a la BD'));
    }
}
// Ejecutar la conexión a la base de datos al iniciar la aplicación
connectDB();
// Crear la instancia principal de Express
const app = express();
app.use(cors());
// Middleware para registrar peticiones HTTP en consola (modo desarrollo)
app.use(morgan('dev'));
// Middleware para parsear JSON en los cuerpos de las solicitudes
app.use(express.json());
// Registrar las rutas
app.use('/api/administradores', administradorRouter);
app.use('/api/servicios-empresariales', servicioEmpresarialRouter);
app.use('/api/pedidos', pedidoRouter);
app.use('/api/clientes', clienteRouter);
app.use('/api/empleados', empleadoRouter);
// Exportar la instancia de app para que pueda ser utilizada en otros archivos (p.ej. para iniciar el servidor)
export default app;