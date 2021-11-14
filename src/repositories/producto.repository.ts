import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Producto, ProductoRelations, Compra} from '../models';
import {CompraRepository} from './compra.repository';

export class ProductoRepository extends DefaultCrudRepository<
  Producto,
  typeof Producto.prototype.id,
  ProductoRelations
> {

  public readonly compras: HasManyRepositoryFactory<Compra, typeof Producto.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('CompraRepository') protected compraRepositoryGetter: Getter<CompraRepository>,
  ) {
    super(Producto, dataSource);
    this.compras = this.createHasManyRepositoryFactoryFor('compras', compraRepositoryGetter,);
    this.registerInclusionResolver('compras', this.compras.inclusionResolver);
  }
}
