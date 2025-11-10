// ttoqt.service.ts
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

  // ✅ Crear un nuevo registro
  async crearTtoqt(dto: ttoqtDto): Promise<ITtoqt> {
    const nuevo = new this.ttoqtModel(dto);
    return await nuevo.save();
  }

  // ✅ Buscar por ID
  async buscarTtoqt(id: string): Promise<ITtoqt | null> {
    return await this.ttoqtModel.findById(id).exec();
  }

  // ✅ Buscar todos
  async buscarTodos(): Promise<ITtoqt[]> {
    return await this.ttoqtModel.find().exec();
  }

  // ✅ Eliminar por ID
  async eliminarTtoqt(id: string): Promise<boolean> {
    const res = await this.ttoqtModel.deleteOne({ _id: id }).exec();
    return res.deletedCount === 1;
  }

  // ✅ Actualizar por ID
  async actualizarTtoqt(id: string, dto: ttoqtDto): Promise<ITtoqt | null> {
    return await this.ttoqtModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  // ✅ Buscar por paciente
  async buscarPorPaciente(filtro: any): Promise<ITtoqt[]> {
    return await this.ttoqtModel.find(filtro).exec();
  }

  // ✅ Nuevo método para guardar desde un arreglo (para cargue Excel)
  async guardarDesdeArray(datos: any[]): Promise<void> {
    if (!Array.isArray(datos) || datos.length === 0) return;

    const operaciones = datos.map(async (item) => {
      if (!item.pacienteId) return;

      // 🔄 Buscar si ya existe un registro de ese paciente y tratamiento
      const existe = await this.ttoqtModel.findOne({
        pacienteId: item.pacienteId,
        tratamiento: item.tratamiento,
      });

      if (existe) {
        // Si ya existe, actualizar
        await this.ttoqtModel.updateOne({ _id: existe._id }, item).exec();
      } else {
        // Si no existe, crear uno nuevo
        const nuevo = new this.ttoqtModel(item);
        await nuevo.save();
      }
    });

    await Promise.all(operaciones);
  }
}
