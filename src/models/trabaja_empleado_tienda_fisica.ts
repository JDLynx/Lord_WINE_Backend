import { Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, PrimaryKey } from 'sequelize-typescript';
import Empleado from './empleado';
import TiendaFisica from './tienda_fisica';

@Table({ tableName: 'TrabajaEmpleadoTiendaFisica' })
export class TrabajaEmpleadoTiendaFisica extends Model<TrabajaEmpleadoTiendaFisica>
{
  @PrimaryKey
  @ForeignKey(() => Empleado)
  @Column({ type: DataType.INTEGER })
  declare emplCodEmpleado: number;

  @PrimaryKey
  @ForeignKey(() => TiendaFisica)
  @Column({ type: DataType.INTEGER })
  declare tiendIdTiendaFisica: number;

  @BelongsTo(() => Empleado)
  declare empleado: Empleado;

  @BelongsTo(() => TiendaFisica)
  declare tiendaFisica: TiendaFisica;

  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

export default TrabajaEmpleadoTiendaFisica;