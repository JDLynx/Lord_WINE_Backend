import { Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, PrimaryKey } from 'sequelize-typescript';
import Producto from './producto';
import TiendaFisica from './tienda_fisica';

@Table({ tableName: 'TieneTiendaProducto' })
export class TieneTiendaProducto extends Model<TieneTiendaProducto>
{
  @PrimaryKey
  @ForeignKey(() => Producto)
  @Column({ type: DataType.INTEGER })
  declare prodIdProducto: number;

  @PrimaryKey
  @ForeignKey(() => TiendaFisica)
  @Column({ type: DataType.INTEGER })
  declare tiendIdTiendaFisica: number;

  @BelongsTo(() => Producto)
  declare producto: Producto;

  @BelongsTo(() => TiendaFisica)
  declare tiendaFisica: TiendaFisica;

  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

export default TieneTiendaProducto;