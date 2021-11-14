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
  Empleado,
} from '../models';
import {CompraRepository} from '../repositories';

export class CompraEmpleadoController {
  constructor(
    @repository(CompraRepository)
    public compraRepository: CompraRepository,
  ) { }

  @get('/compras/{id}/empleado', {
    responses: {
      '200': {
        description: 'Empleado belonging to Compra',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Empleado)},
          },
        },
      },
    },
  })
  async getEmpleado(
    @param.path.string('id') id: typeof Compra.prototype.id,
  ): Promise<Empleado> {
    return this.compraRepository.empleado(id);
  }
}
