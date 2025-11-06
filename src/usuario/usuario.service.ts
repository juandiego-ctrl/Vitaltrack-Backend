import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { usuarioDto } from './usuario.dto';
import { IUsuario } from './usuario.modelo';

@Injectable()
export class UsuarioService {
  constructor(@InjectModel('Usuario') private usuarioModel: Model<IUsuario>) {}

  // GET de prueba
  pruebaInicialGet(): string {
    return 'Este es el Get de Usuarios';
  }

  // Crear usuario
  async CrearUsuario(usuario: usuarioDto): Promise<IUsuario> {
    const creacion = new this.usuarioModel(usuario);
    return await creacion.save();
  }

  // Buscar por ID
  async BuscarUsuario(id: string): Promise<IUsuario | null> {
    try {
      const usuarioEncontrado = await this.usuarioModel.findOne({ _id: id }).exec();
      return usuarioEncontrado;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Buscar todos
  async BuscarTodo(): Promise<IUsuario[]> {
    return await this.usuarioModel.find().exec();
  }

  // Eliminar por ID
  async EliminarUsuario(id: string): Promise<any> {
    const respuesta = await this.usuarioModel.deleteOne({ _id: id }).exec();
    return respuesta.deletedCount === 1 ? respuesta : null;
  }

  // Actualizar por ID
  async ActualizarUsuario(id: string, usuarioDto: usuarioDto): Promise<IUsuario | null> {
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
// Validar credenciales (para login)
async validarCredenciales(email: string, password: string): Promise<IUsuario | null> {
  const usuario = await this.usuarioModel.findOne({ email, contraseña: password }).exec();
  return usuario;
}
}
