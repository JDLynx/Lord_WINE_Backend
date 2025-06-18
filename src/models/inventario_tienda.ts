// Importación de decoradores y tipos necesarios desde sequelize-typescript
import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
// Importación del modelo relacionado: InventarioGeneral
import { InventarioGeneral } from './inventario_general';

// Modelo que representa la tabla 'InventarioTienda' en la base de datos.
// Este modelo define el inventario disponible en una tienda específica, vinculado al inventario general.
@Table({ tableName: 'InventarioTienda' })
export class InventarioTienda extends Model<InventarioTienda>
{
  // Clave primaria autoincremental que identifica el inventario específico de una tienda
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare invTienIdInventarioTienda: number;

  // Cantidad disponible de productos en esta tienda específica
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare invTienCantidadDisponible: number;

  // Clave foránea que vincula este inventario de tienda a un registro en InventarioGeneral
  @ForeignKey(() => InventarioGeneral)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare invGenIdInventarioGeneral: number;

  // Relación que indica que este inventario de tienda pertenece a un inventario general
  @BelongsTo(() => InventarioGeneral)
  declare inventarioGeneral: InventarioGeneral;

  // Fecha de creación del registro
  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  // Fecha de la última actualización del registro
  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

// Exportación del modelo para ser utilizado en otras partes del proyecto
export default InventarioTienda;