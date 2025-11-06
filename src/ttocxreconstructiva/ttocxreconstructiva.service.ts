import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ttocxreconstructivaDto } from './ttocxreconstructiva.dto';
import { ITtoCxreconstructiva } from './ttocxreconstructiva.modelo';

@Injectable()
export class TtocxreconstructivaService {
  constructor(
    @InjectModel('ttocxreconstructiva')
    private ttocxreconstructivaModel: Model<ITtoCxreconstructiva>,
  ) {}

  // 📌 Crear un registro
  async crearTtocxreconstructiva(dto: ttocxreconstructivaDto): Promise<ITtoCxreconstructiva> {
    const nuevo = new this.ttocxreconstructivaModel(dto);
    return await nuevo.save();
  }

  // 📌 Buscar un registro por ID
  async buscarPorId(id: string): Promise<ITtoCxreconstructiva | null> {
    try {
      return await this.ttocxreconstructivaModel.findById(id).exec();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // 📌 Buscar todos los registros
  async buscarTodos(): Promise<ITtoCxreconstructiva[]> {
    return await this.ttocxreconstructivaModel.find().exec();
  }

  // 📌 Eliminar por ID
  async eliminar(id: string): Promise<boolean> {
    const respuesta = await this.ttocxreconstructivaModel.deleteOne({ _id: id }).exec();
    return respuesta.deletedCount === 1;
  }

  // 📌 Actualizar un registro
  async actualizar(
    id: string,
    dto: ttocxreconstructivaDto,
  ): Promise<ITtoCxreconstructiva | null> {
    try {
      return await this.ttocxreconstructivaModel.findByIdAndUpdate(
        id,
        dto,
        { new: true },
      ).exec();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // 📌 Carga masiva desde Excel
  async guardarDesdeExcel(
    registros: ttocxreconstructivaDto[],
  ): Promise<{ accion: string; ttocxreconstructiva?: ITtoCxreconstructiva; error?: string }[]> {
    const resultados: { accion: string; ttocxreconstructiva?: ITtoCxreconstructiva; error?: string }[] = [];

    for (const registro of registros) {
      try {
        const nuevo = new this.ttocxreconstructivaModel(registro);
        const guardado = await nuevo.save();
        resultados.push({ accion: 'creado', ttocxreconstructiva: guardado });
      } catch (error: any) {
        resultados.push({ accion: 'error', error: error.message });
      }
    }

    return resultados;
  }

  // 📌 Buscar registros por paciente
  async buscarPorPaciente(filtro: any): Promise<ITtoCxreconstructiva[]> {
    return await this.ttocxreconstructivaModel.find(filtro).exec();
  }
}
