import { Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, PrimaryKey } from 'sequelize-typescript';
import DetalleCarrito from './detalle_carrito';
import Producto from './producto';

@Table({ tableName: 'TieneDetalleProducto' })
export class TieneDetalleProducto extends Model<TieneDetalleProducto>
{
  @PrimaryKey
  @ForeignKey(() => DetalleCarrito)
  @Column({ type: DataType.INTEGER })
  declare detIdDetalleCarrito: number;

  @PrimaryKey
  @ForeignKey(() => Producto)
  @Column({ type: DataType.INTEGER })
  declare prodIdProducto: number;

  @BelongsTo(() => DetalleCarrito)
  declare detalleCarrito: DetalleCarrito;

  @BelongsTo(() => Producto)
  declare producto: Producto;

  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

export default TieneDetalleProducto;