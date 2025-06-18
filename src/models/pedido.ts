// Importa decoradores y tipos desde sequelize-typescript
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript';
// Importaciones
import Cliente from './cliente';
import Empleado from './empleado';
import ServicioEmpresarial from './servicio_empresarial';

@Table({ tableName: 'Pedido' })
export class Pedido extends Model<Pedido>
{
  // Clave primaria autoincremental
  @PrimaryKey
  @AutoIncrement
  @Column
  declare pedIdPedido: number;

  // Fecha del pedido
  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare pedFecha: string;

  // Total del pedido
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare pedTotal: number;

  // Estado del pedido (ej. pendiente, enviado, etc.)
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare pedEstado: string;

  // Clave foránea hacia Cliente
  @ForeignKey(() => Cliente)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare clCodCliente: number;

  @BelongsTo(() => Cliente)
  declare cliente: Cliente;

  // Clave foránea hacia Empleado
  @ForeignKey(() => Empleado)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare emplCodEmpleado: number;

  @BelongsTo(() => Empleado)
  declare empleado: Empleado;

  // Clave foránea hacia ServicioEmpresarial
  @ForeignKey(() => ServicioEmpresarial)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare serIdServicioEmpresarial: number;

  @BelongsTo(() => ServicioEmpresarial)
  declare servicioEmpresarial: ServicioEmpresarial;

  // Timestamps automáticos
  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

export default Pedido;