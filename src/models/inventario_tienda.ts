import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import { InventarioGeneral } from './inventario_general';
import { TiendaFisica } from './tienda_fisica';
import { TieneTiendaFisicaInventarioTienda } from './tiene_tienda_fisica_inventario_tienda';

@Table({ tableName: 'InventarioTienda' })
export class InventarioTienda extends Model<InventarioTienda>
{
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare invTienIdInventarioTienda: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare invTienCantidadDisponible: number;

  @ForeignKey(() => InventarioGeneral)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare invGenIdInventarioGeneral: number;

  @BelongsTo(() => InventarioGeneral)
  declare inventarioGeneral: InventarioGeneral;

  @BelongsToMany(() => TiendaFisica, () => TieneTiendaFisicaInventarioTienda)
  declare tiendasFisicas?: TiendaFisica[];

  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

export default InventarioTienda;