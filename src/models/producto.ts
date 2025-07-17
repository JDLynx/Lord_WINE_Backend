// src/models/producto.ts
// Importa decoradores y tipos desde sequelize-typescript
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript'; // Añadido HasMany
// Importaciones
import Administrador from './administrador';
import Categoria from './categoria';
import TieneDetalleProducto from './tiene_detalle_producto'; // Importación añadida
import TieneInventarioTiendaProducto from './tiene_inventario_tienda_producto'; // Importación añadida

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

  // Relación añadida: un producto puede estar en muchos detalles de carrito (a través de la tabla intermedia)
  @HasMany(() => TieneDetalleProducto)
  declare detalleProductos: TieneDetalleProducto[];

  // Relación añadida: un producto puede tener inventario en varias tiendas (a través de la tabla intermedia)
  @HasMany(() => TieneInventarioTiendaProducto)
  declare inventarioPorTienda: TieneInventarioTiendaProducto[];
}

export default Producto;