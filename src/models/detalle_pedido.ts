import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import Pedido from './pedido';
import Producto from './producto';

@Table({ tableName: 'DetallePedido' })
export class DetallePedido extends Model<DetallePedido> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare detaIdDetallePedido: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare detaCantidad: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare detaPrecioUnitario: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare detaSubtotal: number;

  @ForeignKey(() => Pedido)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare pedIdPedido: number;

  @BelongsTo(() => Pedido)
  declare pedido: Pedido;

  @ForeignKey(() => Producto)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare prodIdProducto: number;

  @BelongsTo(() => Producto)
  declare producto: Producto;

  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

export default DetallePedido;