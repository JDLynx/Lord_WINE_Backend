import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
import Pedido from './pedido';

@Table({ tableName: 'ServicioEmpresarial' })
export class ServicioEmpresarial extends Model<ServicioEmpresarial> {
  @PrimaryKey
  @AutoIncrement
  @Column
  declare serIdServicioEmpresarial: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare serNombre: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare serDescripcion: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare serPrecio: number;

  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;

  @HasMany(() => Pedido)
  declare pedidos: Pedido[];
}

export default ServicioEmpresarial;