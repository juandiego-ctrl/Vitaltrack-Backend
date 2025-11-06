import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ttopaliativosDto } from './ttopaliativos.dto';
import { ITtopaliativos } from './ttopaliativos.modelo';

@Injectable()
export class TtopaliativosService {
  constructor(
    @InjectModel('ttopaliativos')
    private ttopaliativosModel: Model<ITtopaliativos>,
  ) {}

  // 📌 Crear un registro
  async crearTtopaliativos(dto: ttopaliativosDto): Promise<ITtopaliativos> {
    const nuevo = new this.ttopaliativosModel(dto);
    return await nuevo.save();
  }

  // 📌 Buscar un registro por ID
  async buscarPorId(id: string): Promise<ITtopaliativos | null> {
    try {
      return await this.ttopaliativosModel.findById(id).exec();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // 📌 Buscar todos
  async buscarTodos(): Promise<ITtopaliativos[]> {
    return await this.ttopaliativosModel.find().exec();
  }

  // 📌 Eliminar por ID
  async eliminar(id: string): Promise<boolean> {
    const respuesta = await this.ttopaliativosModel.deleteOne({ _id: id }).exec();
    return respuesta.deletedCount === 1;
  }

  // 📌 Actualizar
  async actualizar(
    id: string,
    dto: ttopaliativosDto,
  ): Promise<ITtopaliativos | null> {
    try {
      return await this.ttopaliativosModel.findByIdAndUpdate(
        id,
        dto,
        { new: true },
      ).exec();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // 📌 Guardar registros desde Excel
  async guardarDesdeExcel(
    registros: ttopaliativosDto[],
  ): Promise<{ accion: string; ttopaliativo?: ITtopaliativos; error?: string }[]> {
    const resultados: { accion: string; ttopaliativo?: ITtopaliativos; error?: string }[] = [];

    for (const registro of registros) {
      try {
        const nuevo = new this.ttopaliativosModel(registro);
        const guardado = await nuevo.save();
        resultados.push({ accion: 'creado', ttopaliativo: guardado });
      } catch (error: any) {
        resultados.push({ accion: 'error', error: error.message });
      }
    }

    return resultados;
  }

  // 📌 Buscar registros por paciente
  async buscarPorPaciente(filtro: any): Promise<ITtopaliativos[]> {
    return await this.ttopaliativosModel.find(filtro).exec();
  }
}
