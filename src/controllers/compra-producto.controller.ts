import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Compra,
  Producto,
} from '../models';
import {CompraRepository} from '../repositories';

export class CompraProductoController {
  constructor(
    @repository(CompraRepository)
    public compraRepository: CompraRepository,
  ) { }

  @get('/compras/{id}/producto', {
    responses: {
      '200': {
        description: 'Producto belonging to Compra',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Producto)},
          },
        },
      },
    },
  })
  async getProducto(
    @param.path.string('id') id: typeof Compra.prototype.id,
  ): Promise<Producto> {
    return this.compraRepository.producto(id);
  }
}
