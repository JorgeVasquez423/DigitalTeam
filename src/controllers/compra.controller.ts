import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Compra} from '../models';
import {CompraRepository} from '../repositories';

export class CompraController {
  constructor(
    @repository(CompraRepository)
    public compraRepository : CompraRepository,
  ) {}

  @post('/compras')
  @response(200, {
    description: 'Compra model instance',
    content: {'application/json': {schema: getModelSchemaRef(Compra)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Compra, {
            title: 'NewCompra',
            exclude: ['id'],
          }),
        },
      },
    })
    compra: Omit<Compra, 'id'>,
  ): Promise<Compra> {
    return this.compraRepository.create(compra);
  }

  @get('/compras/count')
  @response(200, {
    description: 'Compra model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Compra) where?: Where<Compra>,
  ): Promise<Count> {
    return this.compraRepository.count(where);
  }

  @get('/compras')
  @response(200, {
    description: 'Array of Compra model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Compra, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Compra) filter?: Filter<Compra>,
  ): Promise<Compra[]> {
    return this.compraRepository.find(filter);
  }

  @patch('/compras')
  @response(200, {
    description: 'Compra PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Compra, {partial: true}),
        },
      },
    })
    compra: Compra,
    @param.where(Compra) where?: Where<Compra>,
  ): Promise<Count> {
    return this.compraRepository.updateAll(compra, where);
  }

  @get('/compras/{id}')
  @response(200, {
    description: 'Compra model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Compra, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Compra, {exclude: 'where'}) filter?: FilterExcludingWhere<Compra>
  ): Promise<Compra> {
    return this.compraRepository.findById(id, filter);
  }

  @patch('/compras/{id}')
  @response(204, {
    description: 'Compra PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Compra, {partial: true}),
        },
      },
    })
    compra: Compra,
  ): Promise<void> {
    await this.compraRepository.updateById(id, compra);
  }

  @put('/compras/{id}')
  @response(204, {
    description: 'Compra PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() compra: Compra,
  ): Promise<void> {
    await this.compraRepository.replaceById(id, compra);
  }

  @del('/compras/{id}')
  @response(204, {
    description: 'Compra DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.compraRepository.deleteById(id);
  }
}
