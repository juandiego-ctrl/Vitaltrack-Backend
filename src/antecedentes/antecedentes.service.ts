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

  // Crear un registro
  async crearAntecedente(data: AntecedentesDto): Promise<IAntecedentes> {
    const nuevo = new this.antecedentesModel(data);
    return await nuevo.save();
  }

  // Buscar por ID
  async buscarAntecedente(id: string): Promise<IAntecedentes | null> {
    return await this.antecedentesModel.findById(id).exec();
  }

  // Buscar todos
  async buscarTodosAntecedentes(): Promise<IAntecedentes[]> {
    return await this.antecedentesModel.find().exec();
  }

  // Eliminar por ID
  async eliminarAntecedente(id: string): Promise<boolean> {
    const result = await this.antecedentesModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }

  // Actualizar por ID
  async actualizarAntecedente(id: string, data: AntecedentesDto): Promise<IAntecedentes | null> {
    return await this.antecedentesModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  // Guardar múltiples registros desde Array (Excel centralizado)
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

  // Buscar por paciente (para integrarse a cargue central)
  async buscarPorPaciente(query: any): Promise<IAntecedentes[]> {
    return await this.antecedentesModel.find(query).exec();
  }
}
