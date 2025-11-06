import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ttortDto } from './ttort.dto';
import { ITtort } from './ttort.modelo';

@Injectable()
export class TtortService {
  constructor(
    @InjectModel('ttort')
    private readonly ttortModel: Model<ITtort>,
  ) {}

  // 📌 Crear un registro
  async crearTtort(dto: ttortDto): Promise<ITtort> {
    const nuevo = new this.ttortModel(dto);
    return await nuevo.save();
  }

  // 📌 Buscar por ID
  async buscarPorId(id: string): Promise<ITtort | null> {
    try {
      return await this.ttortModel.findById(id).exec();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // 📌 Buscar todos
  async buscarTodos(): Promise<ITtort[]> {
    return await this.ttortModel.find().exec();
  }

  // 📌 Eliminar por ID
  async eliminar(id: string): Promise<boolean> {
    const respuesta = await this.ttortModel.deleteOne({ _id: id }).exec();
    return respuesta.deletedCount === 1;
  }

  // 📌 Actualizar por ID
  async actualizar(id: string, dto: ttortDto): Promise<ITtort | null> {
    try {
      return await this.ttortModel.findByIdAndUpdate(id, dto, {
        new: true,
      }).exec();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // 📌 Guardar múltiples registros desde Excel
  async guardarDesdeExcel(
    registros: ttortDto[],
  ): Promise<{ accion: string; ttort?: ITtort; error?: string }[]> {
    const resultados: { accion: string; ttort?: ITtort; error?: string }[] = [];

    for (const registro of registros) {
      try {
        const guardado = await this.crear(registro);
        resultados.push({ accion: 'creado', ttort: guardado });
      } catch (error: any) {
        resultados.push({ accion: 'error', error: error.message });
      }
    }

    return resultados;
  }

  // 📌 Buscar por paciente (filtros dinámicos)
  async buscarPorPaciente(filtro: any): Promise<ITtort[]> {
    return await this.ttortModel.find(filtro).exec();
  }
}
