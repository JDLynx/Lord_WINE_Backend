import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, Unique, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Administrador from './administrador';
import Pedido from './pedido';

@Table({ tableName: 'Empleado' })
export class Empleado extends Model<Empleado> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare emplCodEmpleado: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare emplIdEmpleado: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare emplNombre: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare emplDireccion: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare emplTelefono: string;

  @Unique
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare emplCorreoElectronico: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare emplContrasena: string;

  // Nuevos campos para la recuperación de contraseña
  @Column({ type: DataType.STRING(255), allowNull: true })
  declare emplResetToken: string | null;

  @Column({ type: DataType.DATE, allowNull: true })
  declare emplResetTokenExpiration: Date | null;

  @ForeignKey(() => Administrador)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare adminCodAdministrador: number;

  @BelongsTo(() => Administrador)
  declare administrador: Administrador;

  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;

  @HasMany(() => Pedido)
  declare pedidos: Pedido[];
}

export default Empleado;