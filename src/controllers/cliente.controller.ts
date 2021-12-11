import {service} from '@loopback/core';
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
  HttpErrors,
} from '@loopback/rest';
import {Llaves} from '../config/llaves';
import {Cliente} from '../models';
import {Credenciales} from '../models/credenciales.model';
import {ClienteRepository} from '../repositories';
import {AutenticacionService, NotificacionService} from '../services';

export class ClienteController {
  constructor(
     /* Código agregado */
    @repository(ClienteRepository)
    public clienteRepository : ClienteRepository,

    @service(AutenticacionService)
    public autenticacionService: AutenticacionService,

    @service(NotificacionService)
    public notificacionService: NotificacionService
    /* ----- */
  ) {}

  @post("/identificarCliente", {
    responses: {
      '200': {
        description: "Identificación de clientes"
      }
    }
  })
  async identificarCliente(
    @requestBody() credenciales: Credenciales
  ) {

    let c = await this.autenticacionService.IdentificarCliente(credenciales.usuario, credenciales.clave)
    if (c) {
      let token = this.autenticacionService.GenerarTokenJWTECliente(c);
      return {
        datos: {
          nombre: c.nombres,
          correo: c.correo,
          id: c.id
        },
        tk: token
      }
    } else {
      throw new HttpErrors[401]("Datos inválidos")
    }

  }

  @post('/clientes')
  @response(200, {
    description: 'Cliente model instance',
    content: {'application/json': {schema: getModelSchemaRef(Cliente)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {
            title: 'NewCliente',
            exclude: ['id'],
          }),
        },
      },
    })
    cliente: Omit<Cliente, 'id'>,
  ): Promise<Cliente> {
    /* Código agregado*/

    // Generación de clave aleatoria y cifrado
    let clave = this.autenticacionService.GenerarClave();
    let claveCifrada = this.autenticacionService.CifrarClave(clave);
    cliente.clave = claveCifrada;
    let p = await this.clienteRepository.create(cliente);

    // Obtención de datos del usuario para el envío de notificaciones de registro
    let telefono = cliente.telefono;
    let destino = cliente.correo;
    let asunto = 'Registro en la plataforma';
    let contenido = `Hola ${cliente.nombres}, su nombre de usuario es: ${cliente.correo}
    y su contraseña es: ${clave}`

    // Notificar al usuario por Email
    fetch(
      `${Llaves.urlServicioNotificaciones}/sendEmail?correoDestino=${destino}&asunto=${asunto}&contenido=${contenido}`,
    ).then((data: any) => {
      console.log(data);
    });

    // Notificar al usuario por SMS
    fetch(
      `${Llaves.urlServicioNotificaciones}/sms?telefono=${telefono}&mensaje=${contenido}`,
    ).then((data: any) => {
      console.log(data);
    });

    return p;
    //return this.empleadoRepository.create(empleado);

    /* ---- */
  }

  @get('/clientes/count')
  @response(200, {
    description: 'Cliente model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Cliente) where?: Where<Cliente>,
  ): Promise<Count> {
    return this.clienteRepository.count(where);
  }

  @get('/clientes')
  @response(200, {
    description: 'Array of Cliente model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Cliente, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Cliente) filter?: Filter<Cliente>,
  ): Promise<Cliente[]> {
    return this.clienteRepository.find(filter);
  }

  @patch('/clientes')
  @response(200, {
    description: 'Cliente PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {partial: true}),
        },
      },
    })
    cliente: Cliente,
    @param.where(Cliente) where?: Where<Cliente>,
  ): Promise<Count> {
    return this.clienteRepository.updateAll(cliente, where);
  }

  @get('/clientes/{id}')
  @response(200, {
    description: 'Cliente model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Cliente, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Cliente, {exclude: 'where'}) filter?: FilterExcludingWhere<Cliente>
  ): Promise<Cliente> {
    return this.clienteRepository.findById(id, filter);
  }

  @patch('/clientes/{id}')
  @response(204, {
    description: 'Cliente PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cliente, {partial: true}),
        },
      },
    })
    cliente: Cliente,
  ): Promise<void> {
    await this.clienteRepository.updateById(id, cliente);
  }

  @put('/clientes/{id}')
  @response(204, {
    description: 'Cliente PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() cliente: Cliente,
  ): Promise<void> {
    await this.clienteRepository.replaceById(id, cliente);
  }

  @del('/clientes/{id}')
  @response(204, {
    description: 'Cliente DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.clienteRepository.deleteById(id);
  }
}
