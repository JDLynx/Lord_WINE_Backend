import { Table, Column, Model, DataType, Unique } from 'sequelize-typescript';

@Table({ tableName: 'Administrador' })
export class Administrador extends Model<Administrador>
{
  @Column({ primaryKey: true, autoIncrement: true })
  adminCodAdministrador!: number;

  @Unique
  @Column({ type: DataType.STRING(50), allowNull: false })
  adminIdAdministrador!: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  adminNombre!: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  adminDireccion!: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  adminTelefono!: string;

  @Unique
  @Column({ type: DataType.STRING(50), allowNull: false })
  adminCorreoElectronico!: string;
}

export default Administrador;