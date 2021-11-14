import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Cliente,
  Compra,
} from '../models';
import {ClienteRepository} from '../repositories';

export class ClienteCompraController {
  constructor(
    @repository(ClienteRepository) protected clienteRepository: ClienteRepository,
  ) { }

  @get('/clientes/{id}/compras', {
    responses: {
      '200': {
        description: 'Array of Cliente has many Compra',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Compra)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Compra>,
  ): Promise<Compra[]> {
    return this.clienteRepository.compras(id).find(filter);
  }

  @post('/clientes/{id}/compras', {
    responses: {
      '200': {
        description: 'Cliente model instance',
        content: {'application/json': {schema: getModelSchemaRef(Compra)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Cliente.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Compra, {
            title: 'NewCompraInCliente',
            exclude: ['id'],
            optional: ['clienteId']
          }),
        },
      },
    }) compra: Omit<Compra, 'id'>,
  ): Promise<Compra> {
    return this.clienteRepository.compras(id).create(compra);
  }

  @patch('/clientes/{id}/compras', {
    responses: {
      '200': {
        description: 'Cliente.Compra PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Compra, {partial: true}),
        },
      },
    })
    compra: Partial<Compra>,
    @param.query.object('where', getWhereSchemaFor(Compra)) where?: Where<Compra>,
  ): Promise<Count> {
    return this.clienteRepository.compras(id).patch(compra, where);
  }

  @del('/clientes/{id}/compras', {
    responses: {
      '200': {
        description: 'Cliente.Compra DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Compra)) where?: Where<Compra>,
  ): Promise<Count> {
    return this.clienteRepository.compras(id).delete(where);
  }
}
