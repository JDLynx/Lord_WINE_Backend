import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
import DetalleCarrito from './detalle_carrito';
import TieneClienteCarritoDeCompras from './tiene_cliente_carrito_de_compras';

@Table({ tableName: 'CarritoDeCompras' })
export class CarritoDeCompras extends Model<CarritoDeCompras> {
    @PrimaryKey
    @AutoIncrement
    @Column
    declare carIdCarritoDeCompras: number;

    @Column({ type: DataType.STRING(50), allowNull: false })
    declare carEstado: string;

    @CreatedAt
    @Column({ field: 'createdAt' })
    declare createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updatedAt' })
    declare updatedAt: Date;

    @HasMany(() => DetalleCarrito)
    declare detallesCarrito: DetalleCarrito[];

    @HasMany(() => TieneClienteCarritoDeCompras)
    declare clienteCarrito: TieneClienteCarritoDeCompras[];
}

export default CarritoDeCompras;