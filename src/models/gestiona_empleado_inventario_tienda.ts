import { Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, PrimaryKey } from 'sequelize-typescript';
import { Empleado } from './empleado';
import { InventarioTienda } from './inventario_tienda';

@Table({ tableName: 'GestionaEmpleadoInventarioTienda' })
export class GestionaEmpleadoInventarioTienda extends Model<GestionaEmpleadoInventarioTienda> {
  @PrimaryKey
  @ForeignKey(() => Empleado)
  @Column({ type: DataType.INTEGER })
  declare emplCodEmpleado: number;

  @PrimaryKey
  @ForeignKey(() => InventarioTienda)
  @Column({ type: DataType.INTEGER })
  declare invTienIdInventarioTienda: number;

  @BelongsTo(() => Empleado)
  declare empleado: Empleado;

  @BelongsTo(() => InventarioTienda)
  declare inventarioTienda: InventarioTienda;

  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

export default GestionaEmpleadoInventarioTienda;