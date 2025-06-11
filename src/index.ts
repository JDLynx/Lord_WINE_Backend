import server from './server';
import { db } from './config/db'; // Importa tu instancia Sequelize configurada

const port = process.env.PORT || 3000;

async function startServer()
{
    try
    {
        // Intentamos autenticar la conexión con la base de datos
        await db.authenticate();
        console.log('Conexión a la base de datos establecida.');
        // Sincroniza los modelos con la base de datos (crea tablas si no existen)
        await db.sync();
        console.log('Base de datos y modelos sincronizados.');
        // Arranca el servidor Express en el puerto configurado
        server.listen(port, () =>
        {
            console.log(`Servidor escuchando en el puerto ${port}`);
        });
    }
    catch (error)
    {
        // Captura y muestra errores de conexión o sincronización
        console.error('Error durante la inicialización:', error);
        // Opcionalmente podrías detener el proceso con process.exit(1);
    }
}
startServer();