import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ttocxDto } from './ttocx.dto';
import { ITtocx } from './ttocx.modelo';

@Injectable()
export class TtocxService {
  constructor(
    @InjectModel('ttocx') private ttocxModel: Model<ITtocx>,
  ) {}

  // 📌 Crear un registro de tratamiento quirúrgico
  async crearTtocx(ttocx: ttocxDto): Promise<ITtocx> {
    const creacion = new this.ttocxModel(ttocx);
    return await creacion.save();
  }

  // 📌 Buscar un registro por ID
  async buscarPorId(id: string): Promise<ITtocx | null> {
    try {
      return await this.ttocxModel.findOne({ _id: id }).exec();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // 📌 Buscar todos los registros de tratamiento quirúrgico
  async buscarTodos(): Promise<ITtocx[]> {
    return await this.ttocxModel.find().exec();
  }

  // 📌 Eliminar un registro por ID
  async eliminar(id: string): Promise<boolean> {
    const respuesta = await this.ttocxModel.deleteOne({ _id: id }).exec();
    return respuesta.deletedCount === 1;
  }

  // 📌 Actualizar un registro de tratamiento quirúrgico
  async actualizar(id: string, ttocxDto: ttocxDto): Promise<ITtocx | null> {
    try {
      return await this.ttocxModel.findOneAndUpdate(
        { _id: id },
        ttocxDto,
        { new: true }, // retorna el documento actualizado
      ).exec();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // 📌 Carga masiva desde archivo Excel
  async guardarDesdeExcel(
    registros: ttocxDto[],
  ): Promise<{ accion: string; ttocx?: ITtocx; error?: string }[]> {
    const resultados: { accion: string; ttocx?: ITtocx; error?: string }[] = [];

    for (const registro of registros) {
      try {
        const nuevo = new this.ttocxModel(registro);
        const guardado = await nuevo.save();
        resultados.push({ accion: 'creado', ttocx: guardado });
      } catch (error: any) {
        resultados.push({ accion: 'error', error: error.message });
      }
    }

    return resultados;
  }

  // 📌 Buscar registros por paciente
  async buscarPorPaciente(filtro: any): Promise<ITtocx[]> {
    return await this.ttocxModel.find(filtro).exec();
  }
}
