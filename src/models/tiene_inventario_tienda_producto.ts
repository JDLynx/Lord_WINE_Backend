import { Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, PrimaryKey } from 'sequelize-typescript';
import { InventarioTienda } from './inventario_tienda';
import { Producto } from './producto';

@Table({ tableName: 'TieneInventarioTiendaProducto' })
export class TieneInventarioTiendaProducto extends Model<TieneInventarioTiendaProducto>
{
  @PrimaryKey
  @ForeignKey(() => InventarioTienda)
  @Column({ type: DataType.INTEGER })
  declare invTienIdInventarioTienda: number;

  @PrimaryKey
  @ForeignKey(() => Producto)
  @Column({ type: DataType.INTEGER })
  declare prodIdProducto: number;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare invTienProdCantidad: number;

  @BelongsTo(() => InventarioTienda)
  declare inventarioTienda: InventarioTienda;

  @BelongsTo(() => Producto)
  declare producto: Producto;

  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

export default TieneInventarioTiendaProducto;