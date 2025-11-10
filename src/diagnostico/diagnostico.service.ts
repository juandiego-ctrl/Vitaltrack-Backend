import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { diagnosticoDto } from './diagnostico.dto';
import { IDiagnostico } from './diagnostico.modelo';

@Injectable()
export class DiagnosticoService {
  constructor(
    @InjectModel('diagnostico')
    private diagnosticoModel: Model<IDiagnostico>,
  ) {}

  // Crear un diagnóstico
  async crearDiagnostico(dto: diagnosticoDto): Promise<IDiagnostico> {
    const creacion = new this.diagnosticoModel(dto);
    return await creacion.save();
  }

  // Buscar un diagnóstico por ID
  async buscarDiagnostico(id: string): Promise<IDiagnostico | null> {
    try {
      return await this.diagnosticoModel.findById(id).exec();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Buscar todos los diagnósticos
  async buscarTodos(): Promise<IDiagnostico[]> {
    return await this.diagnosticoModel.find().exec();
  }

  // Eliminar un diagnóstico por ID
  async eliminarDiagnostico(id: string): Promise<boolean> {
    const respuesta = await this.diagnosticoModel.deleteOne({ _id: id }).exec();
    return respuesta.deletedCount === 1;
  }

  // Actualizar un diagnóstico
  async actualizarDiagnostico(id: string, dto: diagnosticoDto): Promise<IDiagnostico | null> {
    try {
      return await this.diagnosticoModel
        .findByIdAndUpdate(id, dto, { new: true })
        .exec();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Guardar múltiples diagnósticos desde Array (para cargue centralizado)
  async guardarDesdeArray(
    lista: diagnosticoDto[],
  ): Promise<{ accion: string; diagnostico?: IDiagnostico; error?: string }[]> {
    const resultados: { accion: string; diagnostico?: IDiagnostico; error?: string }[] = [];

    for (const item of lista) {
      try {
        const nuevo = new this.diagnosticoModel(item);
        const guardado = await nuevo.save();
        resultados.push({ accion: 'creado', diagnostico: guardado });
      } catch (error: any) {
        resultados.push({ accion: 'error', error: error.message });
      }
    }

    return resultados;
  }

  // Buscar diagnósticos por paciente
  async buscarPorPaciente(filtro: any): Promise<IDiagnostico[]> {
    return await this.diagnosticoModel.find(filtro).exec();
  }
}
