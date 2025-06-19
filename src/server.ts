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
import carritoDeComprasRouter from './routes/carritoDeComprasRouter';
import categoriaRouter from './routes/categoriaRouter';
import productoRouter from './routes/productoRouter';
import detallePedidoRouter from './routes/detallePedidoRouter';
import tiendaFisicaRouter from './routes/tiendaFisicaRouter';
import tieneDetalleProductoRouter from './routes/tieneDetalleProductoRouter';
import tieneTiendaProductoRouter from './routes/tieneTiendaProductoRouter';
import trabajaEmpleadoTiendaFisicaRouter from './routes/trabajaEmpleadoTiendaFisicaRouter';
import inventarioGeneralRouter from './routes/inventarioGeneralRouter';
import inventarioTiendaRouter from './routes/inventarioTiendaRouter';
import tieneInventarioTiendaProductoRouter from './routes/tieneInventarioTiendaProductoRouter';
import tieneTiendaFisicaInventarioTiendaRouter from './routes/tieneTiendaFisicaInventarioTiendaRouter';
import gestionaEmpleadoInventarioTiendaRouter from './routes/gestionaEmpleadoInventarioTiendaRouter';
import gestionaAdministradorInventarioGeneralRouter from './routes/gestionaAdministradorInventarioGeneralRouter';
import tieneClienteCarritoDeComprasRouter from './routes/tieneClienteCarritoDeComprasRouter';
import detalleCarritoRouter from './routes/detalleCarritoRouter';

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
app.use('/api/carritos', carritoDeComprasRouter);
app.use('/api/categorias', categoriaRouter);
app.use('/api/productos', productoRouter);
app.use('/api/detalles-pedido', detallePedidoRouter);
app.use('/api/tiendas-fisicas', tiendaFisicaRouter);
app.use('/api/tiene-detalle-producto', tieneDetalleProductoRouter);
app.use('/api/tiene-tienda-producto', tieneTiendaProductoRouter);
app.use('/api/trabaja-empleado-tienda', trabajaEmpleadoTiendaFisicaRouter);
app.use('/api/inventario-general', inventarioGeneralRouter);
app.use('/api/inventario-tienda', inventarioTiendaRouter);
app.use('/api/tiene-inventario-tienda-producto', tieneInventarioTiendaProductoRouter);
app.use('/api/tiene-tienda-fisica-inventario-tienda', tieneTiendaFisicaInventarioTiendaRouter);
app.use('/api/gestiona-empleado-inventario-tienda', gestionaEmpleadoInventarioTiendaRouter);
app.use('/api/gestiona-administrador-inventario-general', gestionaAdministradorInventarioGeneralRouter);
app.use('/api/tiene-cliente-carrito', tieneClienteCarritoDeComprasRouter);
app.use('/api/detalles-carrito', detalleCarritoRouter);
// Exportar la instancia de app para que pueda ser utilizada en otros archivos (p.ej. para iniciar el servidor)
export default app;