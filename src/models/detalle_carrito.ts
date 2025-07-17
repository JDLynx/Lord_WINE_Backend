// src/models/detalle_carrito.ts
// Importa decoradores y tipos desde sequelize-typescript
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
// Importaciones
import CarritoDeCompras from './carrito_de_compras';
import TieneDetalleProducto from './tiene_detalle_producto';

@Table({ tableName: 'DetalleCarrito' })
export class DetalleCarrito extends Model<DetalleCarrito>
{
  // Clave primaria autoincremental
  @PrimaryKey
  @AutoIncrement
  @Column
  declare detIdDetalleCarrito: number;

  // Cantidad de productos en el detalle
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare detCantidad: number;

  // Subtotal del detalle
  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare detSubtotal: number;

  // Clave foránea: relación con CarritoDeCompras
  @ForeignKey(() => CarritoDeCompras)
  @Column
  declare carIdCarritoDeCompras: number;

  // Relación inversa: un detalle pertenece a un carrito
  @BelongsTo(() => CarritoDeCompras)
  declare carrito: CarritoDeCompras;

  // Fecha de creación automática
  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  // Fecha de actualización automática
  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;

  // Relación con productos en el detalle (tiene_detalle_producto)
  @HasMany(() => TieneDetalleProducto)
  declare productosDetalle: TieneDetalleProducto[];
}

export default DetalleCarrito;