// Importa decoradores y tipos desde sequelize-typescript
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
// Importaciones
import Pedido from './pedido';

// Define la tabla 'ServicioEmpresarial'
@Table({ tableName: 'ServicioEmpresarial' })
export class ServicioEmpresarial extends Model<ServicioEmpresarial>
{
  // Clave primaria autoincremental
  @PrimaryKey
  @AutoIncrement
  @Column
  declare serIdServicioEmpresarial: number;

  // Nombre del servicio empresarial
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare serNombre: string;

  // Descripción del servicio empresarial
  @Column({ type: DataType.TEXT, allowNull: false })
  declare serDescripcion: string;

  // Precio del servicio empresarial
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare serPrecio: number;

  // Fecha de creación automática
  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  // Fecha de última actualización automática
  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;

  // Relación: Un servicio empresarial puede tener muchos pedidos
  @HasMany(() => Pedido)
  declare pedidos: Pedido[];
}

// Exporta el modelo para usarlo en el proyecto
export default ServicioEmpresarial;