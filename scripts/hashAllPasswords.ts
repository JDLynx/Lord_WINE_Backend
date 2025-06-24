import bcrypt from 'bcrypt';
import { db } from '../src/config/db';
import Administrador from '../src/models/administrador';
import Empleado from '../src/models/empleado';
import Cliente from '../src/models/cliente';

async function hashPasswords()
{
  try {
    // Conectamos a la base de datos
    await db.authenticate();
    console.log('✅ Conectado a la base de datos.');

    // 1️⃣ ADMINISTRADORES
    const admins = await Administrador.findAll();
    for (const admin of admins) {
      // Si la contraseña NO parece hash (no empieza con $2b$), la encriptamos
      if (!admin.adminContrasena.startsWith('$2b$')) {
        const hashed = await bcrypt.hash(admin.adminContrasena, 10);
        admin.adminContrasena = hashed;
        await admin.save();
        console.log(`✅ Admin ${admin.adminCorreoElectronico} actualizado`);
      }
    }

    // 2️⃣ EMPLEADOS
    const empleados = await Empleado.findAll();
    for (const empleado of empleados) {
      if (!empleado.emplContrasena.startsWith('$2b$')) {
        const hashed = await bcrypt.hash(empleado.emplContrasena, 10);
        empleado.emplContrasena = hashed;
        await empleado.save();
        console.log(`✅ Empleado ${empleado.emplCorreoElectronico} actualizado`);
      }
    }

    // 3️⃣ CLIENTES
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

// Ejecutamos la función
hashPasswords();