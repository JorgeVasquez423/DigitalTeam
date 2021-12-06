/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/naming-convention */
import { /* inject, */ BindingScope, injectable} from '@loopback/core';
/* Código agregado*/
import {repository} from '@loopback/repository';
import {Llaves} from '../config/llaves';
import {Cliente, Empleado} from '../models';
import {ClienteRepository, EmpleadoRepository} from '../repositories';

const generador = require('password-generator');
const cryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

/* ---*/

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    /* Código agregado*/
    @repository(EmpleadoRepository)
    public empleadoRepository: EmpleadoRepository,

    @repository(ClienteRepository)
    public clienteRepository: ClienteRepository,
    /* ---- */
  ) {}

  /*
   * Add service methods here
   */

  /* Código agregado*/
  GenerarClave() {
    let clave = generador(8, false);
    return clave;
  }

  CifrarClave(clave: string) {
    let claveCifrada = cryptoJS.MD5(clave).toString();
    return claveCifrada;
  }

  IdentificarEmpleado(usuario: string, clave: string) {
    try {
      let p = this.empleadoRepository.findOne({
        where: {correo: usuario, clave: clave},
      });
      if (p) {
        return p;
      }
      return false;
    } catch {
      return false;
    }
  }

  IdentificarCliente(usuario: string, clave: string) {
    try {
      let p = this.empleadoRepository.findOne({
        where: {correo: usuario, clave: clave},
      });
      if (p) {
        return p;
      }
      return false;
    } catch {
      return false;
    }
  }

  GenerarTokenJWTEmpleado(empleado: Empleado) {
    let token = jwt.sign(
      {
        data: {
          id: empleado.id,
          correo: empleado.correo,
          nombre: empleado.nombres + ' ' + empleado.apellidos,
        },
      },
      Llaves.claveJWT,
    );
    return token;
  }

  GenerarTokenJWTECliente(cliente: Cliente) {
    let token = jwt.sign(
      {
        data: {
          id: cliente.id,
          correo: cliente.correo,
          nombre: cliente.nombres + ' ' + cliente.apellidos,
        },
      },
      Llaves.claveJWT,
    );
    return token;
  }

  ValidarTokenJWT(token: string) {
    try {
      let datos = jwt.verify(token, Llaves.claveJWT);
      return datos;
    } catch {
      return false;
    }
  }
  /* ---- */

} // Fin class AutenticacionService
