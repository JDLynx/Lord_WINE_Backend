import { Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, PrimaryKey } from 'sequelize-typescript';
import { TiendaFisica } from './tienda_fisica';
import { InventarioTienda } from './inventario_tienda';

@Table({ tableName: 'TieneTiendaFisicaInventarioTienda' })
export class TieneTiendaFisicaInventarioTienda extends Model<TieneTiendaFisicaInventarioTienda>
{
  @PrimaryKey
  @ForeignKey(() => TiendaFisica)
  @Column({ type: DataType.INTEGER })
  declare tiendIdTiendaFisica: number;

  @PrimaryKey
  @ForeignKey(() => InventarioTienda)
  @Column({ type: DataType.INTEGER })
  declare invTienIdInventarioTienda: number;

  @BelongsTo(() => TiendaFisica)
  declare tiendaFisica: TiendaFisica;

  @BelongsTo(() => InventarioTienda)
  declare inventarioTienda: InventarioTienda;

  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

export default TieneTiendaFisicaInventarioTienda;