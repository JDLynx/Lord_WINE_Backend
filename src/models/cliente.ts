// src/models/cliente.ts (Actualizado)

import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, Unique, HasMany } from 'sequelize-typescript';
import Pedido from './pedido';
import TieneClienteCarritoDeCompras from './tiene_cliente_carrito_de_compras';

@Table({ tableName: 'Cliente' })
export class Cliente extends Model<Cliente> {
    @PrimaryKey
    @AutoIncrement
    @Column
    declare clCodCliente: number;

    @Column({ type: DataType.STRING(50), allowNull: false })
    declare clIdCliente: string;

    @Column({ type: DataType.STRING(50), allowNull: false })
    declare clNombre: string;

    @Column({ type: DataType.STRING(50), allowNull: false })
    declare clDireccion: string;

    @Column({ type: DataType.STRING(50), allowNull: false })
    declare clTelefono: string;

    @Unique
    @Column({ type: DataType.STRING(50), allowNull: false })
    declare clCorreoElectronico: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare clContrasena: string;

    // Campos para la recuperación de contraseña
    @Column({ type: DataType.STRING, allowNull: true })
    declare clResetToken?: string | null;

    @Column({ type: DataType.DATE, allowNull: true })
    declare clResetTokenExpiration?: Date | null;

    @CreatedAt
    @Column({ field: 'createdAt' })
    declare createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updatedAt' })
    declare updatedAt: Date;

    @HasMany(() => Pedido)
    declare pedidos: Pedido[];

    @HasMany(() => TieneClienteCarritoDeCompras)
    declare carritosDeComprasClientes: TieneClienteCarritoDeCompras[];
}

export default Cliente;