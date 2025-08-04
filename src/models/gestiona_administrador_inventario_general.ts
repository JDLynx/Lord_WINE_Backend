import { Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, PrimaryKey } from 'sequelize-typescript';
import { Administrador } from './administrador';
import { InventarioGeneral } from './inventario_general';

@Table({ tableName: 'GestionaAdministradorInventarioGeneral' })
export class GestionaAdministradorInventarioGeneral extends Model<GestionaAdministradorInventarioGeneral> {
  @PrimaryKey
  @ForeignKey(() => Administrador)
  @Column({ type: DataType.INTEGER })
  declare adminCodAdministrador: number;

  @PrimaryKey
  @ForeignKey(() => InventarioGeneral)
  @Column({ type: DataType.INTEGER })
  declare invGenIdInventarioGeneral: number;

  @BelongsTo(() => Administrador)
  declare administrador: Administrador;

  @BelongsTo(() => InventarioGeneral)
  declare inventarioGeneral: InventarioGeneral;

  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

export default GestionaAdministradorInventarioGeneral;