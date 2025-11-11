import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ttocxDto } from './ttocx.dto';
import { ITtocx } from './ttocx.modelo';

@Injectable()
export class TtocxService {
  constructor(@InjectModel('ttocx') private ttocxModel: Model<ITtocx>) {}

  // Crear un registro
  async crearTtocx(ttocx: ttocxDto): Promise<ITtocx> {
    const nuevo = new this.ttocxModel(ttocx);
    return await nuevo.save();
  }

  // Buscar por ID
  async buscarPorId(id: string): Promise<ITtocx | null> {
    return await this.ttocxModel.findById(id).exec();
  }

  // Buscar todos los registros
  async buscarTodos(): Promise<ITtocx[]> {
    return await this.ttocxModel.find().exec();
  }

  // Eliminar registro
  async eliminar(id: string): Promise<boolean> {
    const res = await this.ttocxModel.deleteOne({ _id: id }).exec();
    return res.deletedCount === 1;
  }

  // Actualizar registro
  async actualizar(id: string, ttocx: ttocxDto): Promise<ITtocx | null> {
    return await this.ttocxModel.findByIdAndUpdate(id, ttocx, { new: true }).exec();
  }

  // Guardar registros desde array (para cargue masivo)
  async guardarDesdeArray(
    registros: ttocxDto[],
  ): Promise<{ accion: string; ttocx?: ITtocx; error?: string }[]> {
    const resultados: { accion: string; ttocx?: ITtocx; error?: string }[] = [];

    for (const registro of registros) {
      try {
        if (!registro.pacienteId) {
          resultados.push({
            accion: 'error',
            error: 'El campo pacienteId es obligatorio en el registro.',
          });
          continue;
        }

        const existe = await this.ttocxModel.findOne({ pacienteId: registro.pacienteId }).exec();

        if (existe) {
          const actualizado = await this.ttocxModel
            .findByIdAndUpdate(existe._id, registro, { new: true })
            .exec();
          resultados.push({ accion: 'actualizado', ttocx: actualizado ?? undefined });
        } else {
          const nuevo = new this.ttocxModel(registro);
          const guardado = await nuevo.save();
          resultados.push({ accion: 'creado', ttocx: guardado });
        }
      } catch (error: any) {
        resultados.push({ accion: 'error', error: error.message });
      }
    }

    return resultados;
  }

  // Buscar registros por paciente
  async buscarPorPaciente(pacienteId: string): Promise<ITtocx[]> {
    return await this.ttocxModel.find({ pacienteId }).exec();
  }
}
