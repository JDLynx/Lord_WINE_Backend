import bcrypt from 'bcrypt';
import { db } from '../src/config/db';
import Administrador from '../src/models/administrador';
import Empleado from '../src/models/empleado';
import Cliente from '../src/models/cliente';

async function hashPasswords()
{
  try {

    await db.authenticate();
    console.log('✅ Conectado a la base de datos.');

    const admins = await Administrador.findAll();
    for (const admin of admins) {

      if (!admin.adminContrasena.startsWith('$2b$')) {
        const hashed = await bcrypt.hash(admin.adminContrasena, 10);
        admin.adminContrasena = hashed;
        await admin.save();
        console.log(`✅ Admin ${admin.adminCorreoElectronico} actualizado`);
      }
    }

    const empleados = await Empleado.findAll();
    for (const empleado of empleados) {
      if (!empleado.emplContrasena.startsWith('$2b$')) {
        const hashed = await bcrypt.hash(empleado.emplContrasena, 10);
        empleado.emplContrasena = hashed;
        await empleado.save();
        console.log(`✅ Empleado ${empleado.emplCorreoElectronico} actualizado`);
      }
    }

    const clientes = await Cliente.findAll();
    for (const cliente of clientes) {
      if (!cliente.clContrasena.startsWith('$2b$')) {
        const hashed = await bcrypt.hash(cliente.clContrasena, 10);
        cliente.clContrasena = hashed;
        await cliente.save();
        console.log(`✅ Cliente ${cliente.clCorreoElectronico} actualizado`);
      }
    }

    console.log('🎉 ¡Todos los passwords fueron procesados!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al actualizar contraseñas:', error);
    process.exit(1);
  }
}

hashPasswords();