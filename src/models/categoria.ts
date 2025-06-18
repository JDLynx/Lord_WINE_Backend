// Importa decoradores y tipos desde sequelize-typescript
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
// Importaciones
import Producto from './producto';

@Table({ tableName: 'Categoria' })
export class Categoria extends Model<Categoria>
{
  // Clave primaria autoincremental
  @PrimaryKey
  @AutoIncrement
  @Column
  declare categIdCategoria: number;

  // Nombre de la categoría
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare catNombre: string;

  // Timestamps automáticos
  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;

  // Relación con productos (una categoría tiene muchos productos)
  @HasMany(() => Producto)
  declare productos: Producto[];
}

export default Categoria;