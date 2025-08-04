import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, HasMany } from 'sequelize-typescript';
import Administrador from './administrador';
import Categoria from './categoria';
import TieneDetalleProducto from './tiene_detalle_producto';
import TieneInventarioTiendaProducto from './tiene_inventario_tienda_producto';

@Table({ tableName: 'Producto' })
export class Producto extends Model<Producto> {
    @PrimaryKey
    @AutoIncrement
    @Column
    declare prodIdProducto: number;

    @Column({ type: DataType.STRING(50), allowNull: false })
    declare prodNombre: string;

    @Column({ type: DataType.TEXT, allowNull: false })
    declare prodDescripcion: string;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
    declare prodPrecio: number;

    @ForeignKey(() => Administrador)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare adminCodAdministrador: number;

    @BelongsTo(() => Administrador)
    declare administrador: Administrador;

    @ForeignKey(() => Categoria)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare categIdCategoria: number;

    @BelongsTo(() => Categoria)
    declare categoria: Categoria;

    @CreatedAt
    @Column({ field: 'createdAt' })
    declare createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updatedAt' })
    declare updatedAt: Date;

    @HasMany(() => TieneDetalleProducto)
    declare detalleProductos: TieneDetalleProducto[];

    @HasMany(() => TieneInventarioTiendaProducto)
    declare inventarioPorTienda: TieneInventarioTiendaProducto[];
}

export default Producto;