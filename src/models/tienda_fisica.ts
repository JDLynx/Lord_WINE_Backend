import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, BelongsToMany } from 'sequelize-typescript';
import Administrador from './administrador';
import { InventarioTienda } from './inventario_tienda';
import { TieneTiendaFisicaInventarioTienda } from './tiene_tienda_fisica_inventario_tienda';

interface TiendaFisicaCreationAttributes {
  tiendNombre: string;
  tiendDireccion: string;
  tiendTelefono: string;
  adminCodAdministrador: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: 'TiendaFisica' })
export class TiendaFisica extends Model<TiendaFisica, TiendaFisicaCreationAttributes>
{
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare tiendIdTiendaFisica: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare tiendNombre: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare tiendDireccion: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare tiendTelefono: string;

  @ForeignKey(() => Administrador)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare adminCodAdministrador: number;

  @BelongsTo(() => Administrador)
  declare administrador: Administrador;

  @BelongsToMany(() => InventarioTienda, () => TieneTiendaFisicaInventarioTienda)
  declare inventariosTienda: InventarioTienda[];

  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

export default TiendaFisica;