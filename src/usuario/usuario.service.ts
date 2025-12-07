import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsuarioDto } from './usuario.dto';
import { IUsuario } from './usuario.modelo';

@Injectable()
export class UsuarioService {
  constructor(@InjectModel('Usuario') private usuarioModel: Model<IUsuario>) {}

  // GET de prueba
  pruebaInicialGet(): string {
    return 'Este es el Get de Usuarios';
  }

  // Crear usuario
  async crearUsuario(usuario: UsuarioDto): Promise<IUsuario> {
    const creacion = new this.usuarioModel(usuario);
    return await creacion.save();
  }

  // Buscar por ID
  async buscarUsuario(id: string): Promise<IUsuario | null> {
    try {
      const usuarioEncontrado = await this.usuarioModel.findOne({ _id: id }).exec();
      return usuarioEncontrado;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Buscar todos
  async buscarTodos(): Promise<IUsuario[]> {
    return await this.usuarioModel.find().exec();
  }

  // Eliminar por ID
  async eliminarUsuario(id: string): Promise<any> {
    const respuesta = await this.usuarioModel.deleteOne({ _id: id }).exec();
    return respuesta.deletedCount === 1 ? respuesta : null;
  }

  // Actualizar por ID
  async actualizarUsuario(id: string, usuarioDto: UsuarioDto): Promise<IUsuario | null> {
    try {
      const usuarioActualizado = await this.usuarioModel.findOneAndUpdate(
        { _id: id },
        usuarioDto,
        { new: true }
      ).exec();
      return usuarioActualizado;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Validar credenciales (para login)
  async validarCredenciales(email: string, password: string): Promise<IUsuario | null> {
    const usuario = await this.usuarioModel.findOne({ email, contraseña: password }).exec();
    return usuario;
  }

  async guardarDesdeArray(usuarios: UsuarioDto[]): Promise<{ accion: string; usuario?: IUsuario; error?: string }[]> {
    const resultados: { accion: string; usuario?: IUsuario; error?: string }[] = [];

    for (const usuario of usuarios) {
      try {
        // Verificar si el email ya existe
        const existe = await this.usuarioModel.findOne({ email: usuario.email }).exec();

        if (existe) {
          // Actualizar usuario existente
          const actualizado = await this.usuarioModel.findOneAndUpdate(
            { email: usuario.email },
            {
              nombre: usuario.nombre,
              contraseña: usuario.contraseña,
              rol: usuario.rol,
              estadoCuenta: usuario.estadoCuenta,
            },
            { new: true }
          ).exec();

          if (actualizado) {
            resultados.push({ accion: 'actualizado', usuario: actualizado });
          } else {
            resultados.push({ accion: 'error', error: 'No se pudo actualizar' });
          }
        } else {
          // Crear nuevo usuario
          const nuevo = new this.usuarioModel({
            nombre: usuario.nombre,
            email: usuario.email,
            contraseña: usuario.contraseña,
            rol: usuario.rol,
            estadoCuenta: usuario.estadoCuenta,
          });
          const guardado = await nuevo.save();
          resultados.push({ accion: 'creado', usuario: guardado });
        }
      } catch (error: any) {
        resultados.push({ accion: 'error', error: error.message });
      }
    }

    return resultados;
  }
}
