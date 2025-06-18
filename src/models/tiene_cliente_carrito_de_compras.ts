import { Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, PrimaryKey } from 'sequelize-typescript';
import { Cliente } from './cliente';
import { CarritoDeCompras } from './carrito_de_compras';

@Table({ tableName: 'TieneClienteCarritoDeCompras' })
export class TieneClienteCarritoDeCompras extends Model<TieneClienteCarritoDeCompras>
{
  @PrimaryKey
  @ForeignKey(() => Cliente)
  @Column({ type: DataType.INTEGER })
  declare clCodCliente: number;

  @PrimaryKey
  @ForeignKey(() => CarritoDeCompras)
  @Column({ type: DataType.INTEGER })
  declare carIdCarritoDeCompras: number;

  @BelongsTo(() => Cliente)
  declare cliente: Cliente;

  @BelongsTo(() => CarritoDeCompras)
  declare carritoDeCompras: CarritoDeCompras;

  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

export default TieneClienteCarritoDeCompras;