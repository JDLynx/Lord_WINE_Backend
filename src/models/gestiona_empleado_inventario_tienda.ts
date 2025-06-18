// Importación de decoradores y tipos de datos desde sequelize-typescript
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, PrimaryKey } from 'sequelize-typescript';
// Importación de los modelos relacionados
import { Empleado } from './empleado';
import { InventarioTienda } from './inventario_tienda';

// Modelo que representa la tabla intermedia 'GestionaEmpleadoInventarioTienda'.
// Esta tabla define la relación muchos-a-muchos entre empleados e inventarios de tienda,
// permitiendo saber qué empleado gestiona qué inventario en una tienda específica.
@Table({ tableName: 'GestionaEmpleadoInventarioTienda' })
export class GestionaEmpleadoInventarioTienda extends Model<GestionaEmpleadoInventarioTienda>
{
  // Clave primaria compuesta: código del empleado
  // También es clave foránea que referencia al modelo Empleado
  @PrimaryKey
  @ForeignKey(() => Empleado)
  @Column({ type: DataType.INTEGER })
  declare emplCodEmpleado: number;

  // Clave primaria compuesta: ID del inventario de tienda
  // También es clave foránea que referencia al modelo InventarioTienda
  @PrimaryKey
  @ForeignKey(() => InventarioTienda)
  @Column({ type: DataType.INTEGER })
  declare invTienIdInventarioTienda: number;

  // Relación: este registro pertenece a un empleado específico
  @BelongsTo(() => Empleado)
  declare empleado: Empleado;

  // Relación: este registro pertenece a un inventario de tienda específico
  @BelongsTo(() => InventarioTienda)
  declare inventarioTienda: InventarioTienda;

  // Campo que guarda la fecha y hora de creación del registro
  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  // Campo que guarda la fecha y hora de la última actualización del registro
  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

// Exportación del modelo para su uso en otros módulos del proyecto
export default GestionaEmpleadoInventarioTienda;