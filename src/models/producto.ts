// Importa decoradores y tipos desde sequelize-typescript
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript';
// Importaciones
import Administrador from './administrador';
import Categoria from './categoria';

@Table({ tableName: 'Producto' })
export class Producto extends Model<Producto>
{
  // Clave primaria autoincremental
  @PrimaryKey
  @AutoIncrement
  @Column
  declare prodIdProducto: number;

  // Nombre del producto
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare prodNombre: string;

  // Descripción del producto
  @Column({ type: DataType.TEXT, allowNull: false })
  declare prodDescripcion: string;

  // Precio del producto
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare prodPrecio: number;

  // Clave foránea hacia Administrador
  @ForeignKey(() => Administrador)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare adminCodAdministrador: number;

  @BelongsTo(() => Administrador)
  declare administrador: Administrador;

  // Clave foránea hacia Categoria
  @ForeignKey(() => Categoria)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare categIdCategoria: number;

  @BelongsTo(() => Categoria)
  declare categoria: Categoria;

  // Timestamps automáticos
  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

export default Producto;