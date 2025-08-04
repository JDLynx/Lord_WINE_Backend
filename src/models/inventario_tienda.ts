import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, BelongsToMany, HasMany } from 'sequelize-typescript';
import { InventarioGeneral } from './inventario_general';
import { TiendaFisica } from './tienda_fisica';
import { TieneTiendaFisicaInventarioTienda } from './tiene_tienda_fisica_inventario_tienda';
import TieneInventarioTiendaProducto from './tiene_inventario_tienda_producto';

interface InventarioTiendaCreationAttributes {
    invTienCantidadDisponible: number;
    invGenIdInventarioGeneral: number;
    createdAt?: Date;
    updatedAt?: Date;
}

@Table({ tableName: 'InventarioTienda' })
export class InventarioTienda extends Model<InventarioTienda, InventarioTiendaCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column({ type: DataType.INTEGER })
    declare invTienIdInventarioTienda: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    declare invTienCantidadDisponible: number;

    @ForeignKey(() => InventarioGeneral)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare invGenIdInventarioGeneral: number;

    @BelongsTo(() => InventarioGeneral)
    declare inventarioGeneral: InventarioGeneral;

    @BelongsToMany(() => TiendaFisica, () => TieneTiendaFisicaInventarioTienda)
    declare tiendasFisicas?: TiendaFisica[];

    @CreatedAt
    @Column({ field: 'createdAt' })
    declare createdAt: Date;

    @UpdatedAt
    @Column({ field: 'updatedAt' })
    declare updatedAt: Date;

    @HasMany(() => TieneInventarioTiendaProducto)
    declare productosEnInventario: TieneInventarioTiendaProducto[];
}

export default InventarioTienda;