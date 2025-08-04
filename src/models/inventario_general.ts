import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({ tableName: 'InventarioGeneral' })
export class InventarioGeneral extends Model<InventarioGeneral> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare invGenIdInventarioGeneral: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare invGenCantidadTotal: number;

  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

export default InventarioGeneral;