// Importa decoradores y tipos necesarios desde sequelize-typescript
import { Table, Column, Model, DataType, Unique } from 'sequelize-typescript';

// Define la tabla 'Administrador' en la base de datos
@Table({ tableName: 'Administrador' })
export class Administrador extends Model<Administrador>
{
  // Clave primaria autoincremental
  @Column({ primaryKey: true, autoIncrement: true })
  adminCodAdministrador!: number;

  // ID único del administrador (ej. cédula o username)
  @Unique
  @Column({ type: DataType.STRING(50), allowNull: false })
  adminIdAdministrador!: string;

  // Nombre del administrador
  @Column({ type: DataType.STRING(50), allowNull: false })
  adminNombre!: string;

  // Dirección del administrador
  @Column({ type: DataType.STRING(50), allowNull: false })
  adminDireccion!: string;

  // Teléfono del administrador
  @Column({ type: DataType.STRING(50), allowNull: false })
  adminTelefono!: string;

  // Correo electrónico único del administrador
  @Unique
  @Column({ type: DataType.STRING(50), allowNull: false })
  adminCorreoElectronico!: string;

  // Contraseña del administrador (en texto plano por ahora)
  @Column({ type: DataType.STRING(255), allowNull: false })
  adminContrasena!: string;
}

// Exporta el modelo para ser utilizado en controladores u otras partes del proyecto
export default Administrador;