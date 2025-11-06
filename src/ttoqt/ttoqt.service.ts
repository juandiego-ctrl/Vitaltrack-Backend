import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ttoqtDto } from './ttoqt.dto';
import { ITtoqt } from './ttoqt.modelo';

@Injectable()
export class TtoqtService {
  constructor(
    @InjectModel('ttoqt')
    private readonly ttoqtModel: Model<ITtoqt>,
  ) {}

  // 📌 Crear un registro
  async crearTtoqt(dto: ttoqtDto): Promise<ITtoqt> {
    const nuevo = new this.ttoqtModel(dto);
    return await nuevo.save();
  }

  // 📌 Buscar por ID
  async buscarPorId(id: string): Promise<ITtoqt | null> {
    try {
      return await this.ttoqtModel.findById(id).exec();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // 📌 Buscar todos
  async buscarTodos(): Promise<ITtoqt[]> {
    return await this.ttoqtModel.find().exec();
  }

  // 📌 Eliminar por ID
  async eliminar(id: string): Promise<boolean> {
    const respuesta = await this.ttoqtModel.deleteOne({ _id: id }).exec();
    return respuesta.deletedCount === 1;
  }

  // 📌 Actualizar por ID
  async actualizar(id: string, dto: ttoqtDto): Promise<ITtoqt | null> {
    try {
      return await this.ttoqtModel.findByIdAndUpdate(id, dto, {
        new: true,
      }).exec();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // 📌 Guardar registros desde Excel
  async guardarDesdeExcel(
    registros: ttoqtDto[],
  ): Promise<{ accion: string; ttoqt?: ITtoqt; error?: string }[]> {
    const resultados: { accion: string; ttoqt?: ITtoqt; error?: string }[] = [];

    for (const registro of registros) {
      try {
        const guardado = await this.crear(registro);
        resultados.push({ accion: 'creado', ttoqt: guardado });
      } catch (error: any) {
        resultados.push({ accion: 'error', error: error.message });
      }
    }

    return resultados;
  }

  // 📌 Buscar registros por paciente
  async buscarPorPaciente(filtro: any): Promise<ITtoqt[]> {
    return await this.ttoqtModel.find(filtro).exec();
  }
}
