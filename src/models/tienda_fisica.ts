// Importación de decoradores y tipos desde sequelize-typescript
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript';
// Importación del modelo relacionado: Administrador
import Administrador from './administrador';

// Definición del modelo que representa la tabla 'TiendaFisica'.
// Este modelo almacena información sobre las tiendas físicas registradas en el sistema.
@Table({ tableName: 'TiendaFisica' })
export class TiendaFisica extends Model<TiendaFisica>
{
  // Clave primaria autoincremental que identifica de forma única cada tienda física
  @PrimaryKey
  @AutoIncrement
  @Column
  declare tiendIdTiendaFisica: number;

  // Nombre de la tienda física (hasta 50 caracteres)
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare tiendNombre: string;

  // Dirección física de la tienda (hasta 50 caracteres)
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare tiendDireccion: string;

  // Número de teléfono de contacto de la tienda (hasta 50 caracteres)
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare tiendTelefono: string;

  // Clave foránea que relaciona la tienda con el administrador responsable
  @ForeignKey(() => Administrador)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare adminCodAdministrador: number;

  // Relación que indica que esta tienda pertenece a un administrador
  @BelongsTo(() => Administrador)
  declare administrador: Administrador;

  // Fecha en que se creó el registro
  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  // Fecha de la última actualización del registro
  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

// Exportación del modelo para que pueda usarse en otros módulos del proyecto
export default TiendaFisica;