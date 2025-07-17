// src/models/carrito_de_compras.ts
// Importa decoradores y tipos desde sequelize-typescript
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
// Importaciones
import DetalleCarrito from './detalle_carrito';
import TieneClienteCarritoDeCompras from './tiene_cliente_carrito_de_compras'; // Importación añadida

@Table({ tableName: 'CarritoDeCompras' })
export class CarritoDeCompras extends Model<CarritoDeCompras>
{
  // Clave primaria autoincremental
  @PrimaryKey
  @AutoIncrement
  @Column
  declare carIdCarritoDeCompras: number;

  // Estado del carrito
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare carEstado: string;

  // Fecha de creación automática
  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  // Fecha de actualización automática
  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;

  // Relación: un carrito puede tener muchos detalles
  @HasMany(() => DetalleCarrito)
  declare detallesCarrito: DetalleCarrito[];

  // Relación añadida: un carrito puede tener muchas relaciones con clientes
  @HasMany(() => TieneClienteCarritoDeCompras)
  declare clienteCarrito: TieneClienteCarritoDeCompras[];
}

export default CarritoDeCompras;