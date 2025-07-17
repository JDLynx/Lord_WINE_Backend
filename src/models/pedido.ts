import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, HasMany, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import Cliente from './cliente';
import Empleado from './empleado';
import ServicioEmpresarial from './servicio_empresarial';
import DetallePedido from './detalle_pedido';

@Table({ tableName: 'Pedido' })
export class Pedido extends Model<Pedido>
{
  @PrimaryKey
  @AutoIncrement
  @Column
  declare pedIdPedido: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare pedFecha: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare pedTotal: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare pedEstado: string;

  @ForeignKey(() => Cliente)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare clCodCliente: number;

  @BelongsTo(() => Cliente)
  declare cliente: Cliente;

  @ForeignKey(() => Empleado)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare emplCodEmpleado: number | null;

  @BelongsTo(() => Empleado)
  declare empleado: Empleado;

  @ForeignKey(() => ServicioEmpresarial)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare serIdServicioEmpresarial: number;

  @BelongsTo(() => ServicioEmpresarial)
  declare servicioEmpresarial: ServicioEmpresarial;

  @HasMany(() => DetallePedido)
  declare detallesPedido: DetallePedido[];

  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

export default Pedido;