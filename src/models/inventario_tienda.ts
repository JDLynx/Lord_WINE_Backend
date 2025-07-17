// src/models/inventario_tienda.ts
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, BelongsToMany, HasMany } from 'sequelize-typescript'; // Agregado HasMany
import { InventarioGeneral } from './inventario_general';
import { TiendaFisica } from './tienda_fisica';
import { TieneTiendaFisicaInventarioTienda } from './tiene_tienda_fisica_inventario_tienda';
import TieneInventarioTiendaProducto from './tiene_inventario_tienda_producto'; // Importación añadida

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

  // Relación añadida: un inventario de tienda puede tener muchos productos específicos
  @HasMany(() => TieneInventarioTiendaProducto)
  declare productosEnInventario: TieneInventarioTiendaProducto[];
}

export default InventarioTienda;