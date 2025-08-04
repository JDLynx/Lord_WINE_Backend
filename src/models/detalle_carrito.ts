import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import CarritoDeCompras from './carrito_de_compras';
import TieneDetalleProducto from './tiene_detalle_producto';

@Table({ tableName: 'DetalleCarrito' })
export class DetalleCarrito extends Model<DetalleCarrito> {
    @PrimaryKey
    @AutoIncrement
    @Column
    declare detIdDetalleCarrito: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    declare detCantidad: number;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
    declare detSubtotal: number;

    @ForeignKey(() => CarritoDeCompras)
    @Column
    declare carIdCarritoDeCompras: number;

    @BelongsTo(() => CarritoDeCompras)
    declare carrito: CarritoDeCompras;

    @CreatedAt
    @Column({ field: 'createdAt' })
    declare createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updatedAt' })
    declare updatedAt: Date;

    @HasMany(() => TieneDetalleProducto)
    declare productosDetalle: TieneDetalleProducto[];
}

export default DetalleCarrito;