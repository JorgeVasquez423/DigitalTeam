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
} from '@loopback/rest';
 /* Código agregado */
import {Llaves} from '../config/llaves';
//import {Credenciales} from '../models/credenciales.model';
import {Empleado} from '../models';
import {EmpleadoRepository} from '../repositories';
import {AutenticacionService, NotificacionService} from '../services';

const fetch = require('node-fetch');
 /* ----- */

export class EmpleadoController {
  constructor(
    /* Código agregado*/
    @repository(EmpleadoRepository)
    public empleadoRepository : EmpleadoRepository,

    @service(AutenticacionService)
    public autenticacionService: AutenticacionService,

    @service(NotificacionService)
    public notificacionService: NotificacionService
    /* ----- */
  ) {}

  @post('/empleados')
  @response(200, {
    description: 'Empleado model instance',
    content: {'application/json': {schema: getModelSchemaRef(Empleado)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Empleado, {
            title: 'NewEmpleado',
            exclude: ['id'],
          }),
        },
      },
    })
    empleado: Omit<Empleado, 'id'>,
  ): Promise<Empleado> {

    /* Código agregado*/

    // Generación de clave aleatoria y cifrado
    let clave = this.autenticacionService.GenerarClave();
    let claveCifrada = this.autenticacionService.CifrarClave(clave);
    empleado.clave = claveCifrada;
    let p = await this.empleadoRepository.create(empleado);

    // Obtención de datos del usuario para el envío de notificaciones de registro
    let telefono = empleado.telefono;
    let destino = empleado.correo;
    let asunto = 'Registro en la plataforma';
    let contenido = `Hola ${empleado.nombres}, su nombre de usuario es: ${empleado.correo}
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

  @get('/empleados/count')
  @response(200, {
    description: 'Empleado model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Empleado) where?: Where<Empleado>,
  ): Promise<Count> {
    return this.empleadoRepository.count(where);
  }

  @get('/empleados')
  @response(200, {
    description: 'Array of Empleado model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Empleado, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Empleado) filter?: Filter<Empleado>,
  ): Promise<Empleado[]> {
    return this.empleadoRepository.find(filter);
  }

  @patch('/empleados')
  @response(200, {
    description: 'Empleado PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Empleado, {partial: true}),
        },
      },
    })
    empleado: Empleado,
    @param.where(Empleado) where?: Where<Empleado>,
  ): Promise<Count> {
    return this.empleadoRepository.updateAll(empleado, where);
  }

  @get('/empleados/{id}')
  @response(200, {
    description: 'Empleado model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Empleado, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Empleado, {exclude: 'where'}) filter?: FilterExcludingWhere<Empleado>
  ): Promise<Empleado> {
    return this.empleadoRepository.findById(id, filter);
  }

  @patch('/empleados/{id}')
  @response(204, {
    description: 'Empleado PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Empleado, {partial: true}),
        },
      },
    })
    empleado: Empleado,
  ): Promise<void> {
    await this.empleadoRepository.updateById(id, empleado);
  }

  @put('/empleados/{id}')
  @response(204, {
    description: 'Empleado PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() empleado: Empleado,
  ): Promise<void> {
    await this.empleadoRepository.replaceById(id, empleado);
  }

  @del('/empleados/{id}')
  @response(204, {
    description: 'Empleado DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.empleadoRepository.deleteById(id);
  }
}
