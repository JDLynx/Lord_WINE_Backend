import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
import Producto from './producto';

@Table({ tableName: 'Categoria' })
export class Categoria extends Model<Categoria> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare categIdCategoria: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare catNombre: string;

  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;

  @HasMany(() => Producto)
  declare productos: Producto[];
}

export default Categoria;