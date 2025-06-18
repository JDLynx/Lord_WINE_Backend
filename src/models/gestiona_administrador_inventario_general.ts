// Importación de decoradores y tipos desde sequelize-typescript
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, PrimaryKey } from 'sequelize-typescript';
// Importación de los modelos relacionados
import { Administrador } from './administrador';
import { InventarioGeneral } from './inventario_general';

// Esta clase representa la tabla intermedia 'GestionaAdministradorInventarioGeneral'
// que establece una relación muchos-a-muchos entre los administradores y los inventarios generales.
// También incluye campos de auditoría (createdAt y updatedAt).
@Table({ tableName: 'GestionaAdministradorInventarioGeneral' })
export class GestionaAdministradorInventarioGeneral extends Model<GestionaAdministradorInventarioGeneral>
{
  // Clave primaria compuesta: código del administrador
  // Además, es clave foránea que referencia a la tabla 'Administrador'
  @PrimaryKey
  @ForeignKey(() => Administrador)
  @Column({ type: DataType.INTEGER })
  declare adminCodAdministrador: number;

  // Clave primaria compuesta: ID del inventario general
  // También es clave foránea que referencia a la tabla 'InventarioGeneral'
  @PrimaryKey
  @ForeignKey(() => InventarioGeneral)
  @Column({ type: DataType.INTEGER })
  declare invGenIdInventarioGeneral: number;

  // Relación de pertenencia con el modelo 'Administrador'
  @BelongsTo(() => Administrador)
  declare administrador: Administrador;

  // Relación de pertenencia con el modelo 'InventarioGeneral'
  @BelongsTo(() => InventarioGeneral)
  declare inventarioGeneral: InventarioGeneral;

  // Marca de tiempo que indica cuándo fue creado este registro
  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  // Marca de tiempo que indica cuándo fue actualizado por última vez este registro
  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

// Exportación del modelo para ser utilizado en otras partes del proyecto
export default GestionaAdministradorInventarioGeneral;