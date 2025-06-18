// Importa decoradores y tipos desde sequelize-typescript
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
// Importaciones
import Empleado from './empleado';
import Producto from './producto';
import TiendaFisica from './tienda_fisica';

@Table({ tableName: 'Administrador' })
export class Administrador extends Model<Administrador>
{
  // Clave primaria autoincremental
  @PrimaryKey
  @AutoIncrement
  @Column
  declare adminCodAdministrador: number;

  // Identificación única del administrador
  @Unique
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare adminIdAdministrador: string;

  // Nombre del administrador
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare adminNombre: string;

  // Dirección del administrador
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare adminDireccion: string;

  // Teléfono del administrador
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare adminTelefono: string;

  // Correo electrónico único
  @Unique
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare adminCorreoElectronico: string;

  // Contraseña
  @Column({ type: DataType.STRING(255), allowNull: false })
  declare adminContrasena: string;

  // Fecha de creación
  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  // Fecha de actualización
  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;

  // Relaciones
  @HasMany(() => Empleado)
  declare empleados: Empleado[];

  @HasMany(() => Producto)
  declare productos: Producto[];

  @HasMany(() => TiendaFisica)
  declare tiendasFisicas: TiendaFisica[];
}

export default Administrador;