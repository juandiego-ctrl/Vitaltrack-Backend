// antecedentes.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAntecedentes } from './antecedentes.modelo';
import { AntecedentesDto } from './antecedentes.dto';

@Injectable()
export class AntecedentesService {
  constructor(
    @InjectModel('Antecedentes') private readonly antecedentesModel: Model<IAntecedentes>,
  ) {}

  async crearAntecedente(data: AntecedentesDto): Promise<IAntecedentes> {
    if (!data.V6NumId) {
      throw new Error('El campo V6NumId es obligatorio para asociar el antecedente al paciente.');
    }
    const nuevo = new this.antecedentesModel(data);
    return await nuevo.save();
  }

  async buscarAntecedente(id: string): Promise<IAntecedentes | null> {
    return await this.antecedentesModel.findById(id).exec();
  }

  async buscarTodosAntecedentes(): Promise<IAntecedentes[]> {
    return await this.antecedentesModel.find().exec();
  }

  async eliminarAntecedente(id: string): Promise<boolean> {
    const result = await this.antecedentesModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }

  async actualizarAntecedente(id: string, data: AntecedentesDto): Promise<IAntecedentes | null> {
    return await this.antecedentesModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async guardarDesdeArray(datos: AntecedentesDto[]): Promise<{ accion: string; antecedente?: IAntecedentes; error?: string }[]> {
    const resultados: { accion: string; antecedente?: IAntecedentes; error?: string }[] = [];

    for (const item of datos) {
      try {
        const nuevo = new this.antecedentesModel(item);
        const creado = await nuevo.save();
        resultados.push({ accion: 'creado', antecedente: creado });
      } catch (error: any) {
        resultados.push({ accion: 'error', error: error.message });
      }
    }

    return resultados;
  }

  async buscarPorPaciente(V6NumId: string): Promise<IAntecedentes[]> {
    return await this.antecedentesModel.find({ V6NumId }).exec();
  }
}
