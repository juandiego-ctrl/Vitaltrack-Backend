import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ttotrasplanteDto } from './ttotrasplante.dto';
import { ITtotrasplante } from './ttotrasplante.modelo';

@Injectable()
export class TtotrasplanteService {
  constructor(
    @InjectModel('ttotrasplante')
    private readonly ttotrasplanteModel: Model<ITtotrasplante>,
  ) {}

  // 📌 Crear un registro
  async crearTtotrasplante(dto: ttotrasplanteDto): Promise<ITtotrasplante> {
    const nuevo = new this.ttotrasplanteModel(dto);
    return await nuevo.save();
  }

  // 📌 Buscar por ID
  async buscarPorId(id: string): Promise<ITtotrasplante | null> {
    try {
      return await this.ttotrasplanteModel.findById(id).exec();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // 📌 Buscar todos
  async buscarTodos(): Promise<ITtotrasplante[]> {
    return await this.ttotrasplanteModel.find().exec();
  }

  // 📌 Eliminar por ID
  async eliminar(id: string): Promise<boolean> {
    const respuesta = await this.ttotrasplanteModel.deleteOne({ _id: id }).exec();
    return respuesta.deletedCount === 1;
  }

  // 📌 Actualizar por ID
  async actualizar(id: string, dto: ttotrasplanteDto): Promise<ITtotrasplante | null> {
    try {
      return await this.ttotrasplanteModel.findByIdAndUpdate(id, dto, {
        new: true,
      }).exec();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // 📌 Guardar múltiples registros desde Excel
  async guardarDesdeExcel(
    registros: ttotrasplanteDto[],
  ): Promise<{ accion: string; ttotrasplante?: ITtotrasplante; error?: string }[]> {
    const resultados: { accion: string; ttotrasplante?: ITtotrasplante; error?: string }[] = [];

    for (const registro of registros) {
      try {
        const guardado = await this.crear(registro);
        resultados.push({ accion: 'creado', ttotrasplante: guardado });
      } catch (error: any) {
        resultados.push({ accion: 'error', error: error.message });
      }
    }

    return resultados;
  }

  // 📌 Buscar por paciente (filtros dinámicos)
  async buscarPorPaciente(filtro: any): Promise<ITtotrasplante[]> {
    return await this.ttotrasplanteModel.find(filtro).exec();
  }
}
