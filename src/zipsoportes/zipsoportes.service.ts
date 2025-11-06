import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { zipSoportesDto } from './zipsoportes.dto';
import { IZipSoportes } from './zipsoportes.modelo';

@Injectable()
export class zipsoportesService {
  constructor(@InjectModel('zipsoportes') private zipsoportesModel: Model<IZipSoportes>) {}

  // METODO PARA CREAR UN REGISTRO DE ARCHIVO ZIP
  async crearZipsoportes(zipsoportes: zipSoportesDto): Promise<IZipSoportes> {
    const creacion = new this.zipsoportesModel(zipsoportes);
    return await creacion.save();
  }

  // METODO PARA BUSCAR UN REGISTRO POR ID
  async buscarZipsoportes(id: string): Promise<IZipSoportes | null> {
    try {
      const zipsoportesEncontrado = await this.zipsoportesModel.findOne({ _id: id }).exec();
      return zipsoportesEncontrado;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // METODO PARA BUSCAR TODOS LOS REGISTROS DE ARCHIVO ZIP
  async buscarTodos(): Promise<IZipSoportes[]> {
    return await this.zipsoportesModel.find().exec();
  }

  // METODO PARA ELIMINAR UN REGISTRO POR ID
  async eliminarZipsoportes(id: string): Promise<any> {
    const respuesta = await this.zipsoportesModel.deleteOne({ _id: id }).exec();
    return respuesta.deletedCount === 1 ? respuesta : null;
  }

  // METODO PARA ACTUALIZAR UN REGISTRO DE ARCHIVO ZIP
  async actualizarZipsoportes(id: string, zipsoportesDto: zipSoportesDto): Promise<IZipSoportes | null> {
    try {
      const zipsoportesActualizado = await this.zipsoportesModel.findOneAndUpdate(
        { _id: id },
        zipsoportesDto,
        { new: true } // Retorna el documento actualizado
      ).exec();
      return zipsoportesActualizado;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
