// Importación de decoradores y tipos necesarios desde sequelize-typescript
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, CreatedAt, UpdatedAt } from 'sequelize-typescript';
// Importación de modelos relacionados
import Pedido from './pedido';
import Producto from './producto';

// Decorador que indica que esta clase representa la tabla 'DetallePedido' en la base de datos
@Table({ tableName: 'DetallePedido' })
export class DetallePedido extends Model<DetallePedido>
{
  // Clave primaria autoincremental para identificar cada detalle del pedido
  @PrimaryKey
  @AutoIncrement
  @Column
  declare detaIdDetallePedido: number;

  // Cantidad de productos solicitados en el detalle
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare detaCantidad: number;

  // Precio unitario del producto en este detalle
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare detaPrecioUnitario: number;

  // Subtotal calculado (cantidad * precio unitario)
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare detaSubtotal: number;

  // Clave foránea que relaciona el detalle con un pedido específico
  @ForeignKey(() => Pedido)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare pedIdPedido: number;

  // Relación que indica que este detalle pertenece a un pedido
  @BelongsTo(() => Pedido)
  declare pedido: Pedido;

  // Clave foránea que relaciona el detalle con un producto específico
  @ForeignKey(() => Producto)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare prodIdProducto: number;

  // Relación que indica que este detalle está asociado a un producto
  @BelongsTo(() => Producto)
  declare producto: Producto;

  // Marca de tiempo de creación del registro
  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  // Marca de tiempo de la última actualización del registro
  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;
}

// Exportación del modelo para poder usarlo en otras partes del proyecto
export default DetallePedido;