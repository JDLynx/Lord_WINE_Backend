// src/models/cliente.ts
// Importa decoradores y tipos desde sequelize-typescript
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, Unique, HasMany } from 'sequelize-typescript';
// Importaciones
import Pedido from './pedido';
import TieneClienteCarritoDeCompras from './tiene_cliente_carrito_de_compras'; // Importación añadida

@Table({ tableName: 'Cliente' })
export class Cliente extends Model<Cliente>
{
  // Clave primaria autoincremental
  @PrimaryKey
  @AutoIncrement
  @Column
  declare clCodCliente: number;

  // Identificación del cliente
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare clIdCliente: string;

  // Nombre del cliente
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare clNombre: string;

  // Dirección del cliente
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare clDireccion: string;

  // Teléfono del cliente
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare clTelefono: string;

  // Correo electrónico único
  @Unique
  @Column({ type: DataType.STRING(50), allowNull: false })
  declare clCorreoElectronico: string;

  // Contraseña
  @Column({ type: DataType.STRING(255), allowNull: false })
  declare clContrasena: string;

  // Fecha de creación automática
  @CreatedAt
  @Column({ field: 'createdAt' })
  declare createdAt: Date;

  // Fecha de actualización automática
  @UpdatedAt
  @Column({ field: 'updatedAt' })
  declare updatedAt: Date;

  // Relación: un cliente puede tener muchos pedidos
  @HasMany(() => Pedido)
  declare pedidos: Pedido[];

  // Relación añadida: un cliente puede tener muchas relaciones con carritos de compras
  @HasMany(() => TieneClienteCarritoDeCompras)
  declare carritosDeComprasClientes: TieneClienteCarritoDeCompras[];
}

export default Cliente;