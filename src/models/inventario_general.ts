// Importación de decoradores y tipos de datos desde sequelize-typescript
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

// Declaración del modelo que representa la tabla 'InventarioGeneral' en la base de datos
@Table({ tableName: 'InventarioGeneral' })
export class InventarioGeneral extends Model<InventarioGeneral>
{
  // Clave primaria autoincremental que identifica de forma única cada inventario general
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare invGenIdInventarioGeneral: number;

  // Cantidad total de productos en el inventario general
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare invGenCantidadTotal: number;

  // Marca de tiempo que indica cuándo fue creado este registro
  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  // Marca de tiempo que indica cuándo fue actualizado este registro por última vez
  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

// Exportación del modelo para su uso en otras partes del proyecto
export default InventarioGeneral;