import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Compra, CompraRelations, Cliente, Empleado, Producto} from '../models';
import {ClienteRepository} from './cliente.repository';
import {EmpleadoRepository} from './empleado.repository';
import {ProductoRepository} from './producto.repository';

export class CompraRepository extends DefaultCrudRepository<
  Compra,
  typeof Compra.prototype.id,
  CompraRelations
> {

  public readonly cliente: BelongsToAccessor<Cliente, typeof Compra.prototype.id>;

  public readonly empleado: BelongsToAccessor<Empleado, typeof Compra.prototype.id>;

  public readonly producto: BelongsToAccessor<Producto, typeof Compra.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('ClienteRepository') protected clienteRepositoryGetter: Getter<ClienteRepository>, @repository.getter('EmpleadoRepository') protected empleadoRepositoryGetter: Getter<EmpleadoRepository>, @repository.getter('ProductoRepository') protected productoRepositoryGetter: Getter<ProductoRepository>,
  ) {
    super(Compra, dataSource);
    this.producto = this.createBelongsToAccessorFor('producto', productoRepositoryGetter,);
    this.registerInclusionResolver('producto', this.producto.inclusionResolver);
    this.empleado = this.createBelongsToAccessorFor('empleado', empleadoRepositoryGetter,);
    this.registerInclusionResolver('empleado', this.empleado.inclusionResolver);
    this.cliente = this.createBelongsToAccessorFor('cliente', clienteRepositoryGetter,);
    this.registerInclusionResolver('cliente', this.cliente.inclusionResolver);
  }
}
