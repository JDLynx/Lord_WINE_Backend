import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
import Empleado from './empleado';
import Producto from './producto';
import TiendaFisica from './tienda_fisica';

@Table({ tableName: 'Administrador' })
export class Administrador extends Model<Administrador> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare adminCodAdministrador: number;

  @Unique
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare adminIdAdministrador: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare adminNombre: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare adminDireccion: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare adminTelefono: string;

  @Unique
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare adminCorreoElectronico: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare adminContrasena: string;

  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;

  @HasMany(() => Empleado)
  declare empleados: Empleado[];

  @HasMany(() => Producto)
  declare productos: Producto[];

  @HasMany(() => TiendaFisica)
  declare tiendasFisicas: TiendaFisica[];
}

export default Administrador;