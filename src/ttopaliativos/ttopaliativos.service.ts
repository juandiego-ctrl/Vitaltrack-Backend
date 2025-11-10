// ttopaliativos.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ttopaliativosDto } from './ttopaliativos.dto';
import { ITtopaliativos } from './ttopaliativos.modelo';

@Injectable()
export class TtopaliativosService {
  constructor(
    @InjectModel('ttopaliativos')
    private readonly ttopaliativosModel: Model<ITtopaliativos>,
  ) {}

  // ✅ Crear un registro
  async crearTtopaliativos(dto: ttopaliativosDto): Promise<ITtopaliativos> {
    const nuevo = new this.ttopaliativosModel(dto);
    return await nuevo.save();
  }

  // ✅ Buscar por ID
  async buscarPorId(id: string): Promise<ITtopaliativos | null> {
    return await this.ttopaliativosModel.findById(id).exec();
  }

  // ✅ Buscar todos
  async buscarTodos(): Promise<ITtopaliativos[]> {
    return await this.ttopaliativosModel.find().exec();
  }

  // ✅ Eliminar por ID
  async eliminar(id: string): Promise<boolean> {
    const res = await this.ttopaliativosModel.deleteOne({ _id: id }).exec();
    return res.deletedCount === 1;
  }

  // ✅ Actualizar por ID
  async actualizar(
    id: string,
    dto: ttopaliativosDto,
  ): Promise<ITtopaliativos | null> {
    return await this.ttopaliativosModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  // ✅ Buscar registros por paciente
  async buscarPorPaciente(filtro: any): Promise<ITtopaliativos[]> {
    return await this.ttopaliativosModel.find(filtro).exec();
  }

  // ✅ Guardar desde array para cargue masivo
  async guardarDesdeArray(datos: any[]): Promise<void> {
    if (!Array.isArray(datos) || datos.length === 0) return;

    const operaciones = datos.map(async (item) => {
      if (!item.pacienteId) return;

      // Buscar si ya existe el registro para este paciente
      const existe = await this.ttopaliativosModel.findOne({ pacienteId: item.pacienteId });

      if (existe) {
        // Actualizar si ya existe
        await this.ttopaliativosModel.updateOne({ _id: existe._id }, item).exec();
      } else {
        // Crear nuevo registro
        const nuevo = new this.ttopaliativosModel(item);
        await nuevo.save();
      }
    });

    await Promise.all(operaciones);
  }
}
