// src/server.ts
import express from 'express';
import colors from 'colors'; // Para colorear los logs en consola
import morgan from 'morgan'; // Middleware para logs HTTP
import cors from 'cors';
import dotenv from 'dotenv'; // Importar dotenv para cargar variables de entorno
import { db } from './config/db'; // Instancia Sequelize configurada

// Importar todos tus routers existentes
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
import authRouter from './routes/authRouter';

// Importar las rutas de Dialogflow API
import dialogflowApiRouter from './routes/dialogflow'; // Asegúrate de que este archivo se llame 'dialogflow.ts'


// Cargar las variables de entorno desde .env al inicio de la aplicación
// Aunque index.ts también lo llama, es buena práctica tenerlo aquí si este módulo se importa de forma aislada
dotenv.config();

// Crear la instancia principal de Express
const app = express();

// Middleware para configurar CORS
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para registrar peticiones HTTP en consola (modo desarrollo)
app.use(morgan('dev'));

// Middleware para parsear JSON en los cuerpos de las solicitudes
app.use(express.json());

// Registrar las rutas de tu API
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
app.use('/api/auth', authRouter);

// NUEVO: Ruta para las interacciones con la API de Dialogflow
// El frontend enviará solicitudes POST a http://localhost:3000/api/dialogflow-query
app.use('/api', dialogflowApiRouter);

// Exportar la instancia de app para que pueda ser utilizada por index.ts
export default app;