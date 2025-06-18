// Importa decoradores y tipos necesarios desde sequelize-typescript
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, Unique, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
// Importaciones
import Administrador from './administrador';
import Pedido from './pedido';

@Table({ tableName: 'Empleado' })
export class Empleado extends Model<Empleado>
{
  // Clave primaria autoincremental
  @PrimaryKey
  @AutoIncrement
  @Column
  declare emplCodEmpleado: number;

  // ID del empleado
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare emplIdEmpleado: string;

  // Nombre del empleado
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare emplNombre: string;

  // Dirección del empleado
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare emplDireccion: string;

  // Teléfono del empleado
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare emplTelefono: string;

  // Correo electrónico único
  @Unique
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare emplCorreoElectronico: string;

  // Contraseña del empleado
  @Column({ type: DataType.STRING(255), allowNull: false })
  declare emplContrasena: string;

  // Clave foránea al administrador
  @ForeignKey(() => Administrador)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare adminCodAdministrador: number;

  // Relación: este empleado pertenece a un administrador
  @BelongsTo(() => Administrador)
  declare administrador: Administrador;

  // Timestamps
  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;

  // Futuro: Relación con pedidos
  @HasMany(() => Pedido)
  declare pedidos: Pedido[];
}

export default Empleado;