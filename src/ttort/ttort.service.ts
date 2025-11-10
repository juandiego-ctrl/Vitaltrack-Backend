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

  async crearTtort(dto: ttortDto): Promise<ITtort> {
    const nuevo = new this.ttortModel(dto);
    return await nuevo.save();
  }

  async buscarTtort(id: string): Promise<ITtort | null> {
    return await this.ttortModel.findById(id).exec();
  }

  async buscarTodos(): Promise<ITtort[]> {
    return await this.ttortModel.find().exec();
  }

  async eliminarTtort(id: string): Promise<boolean> {
    const res = await this.ttortModel.deleteOne({ _id: id }).exec();
    return res.deletedCount === 1;
  }

  async actualizarTtort(id: string, dto: ttortDto): Promise<ITtort | null> {
    return await this.ttortModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async buscarPorPaciente(filtro: any): Promise<ITtort[]> {
    return await this.ttortModel.find(filtro).exec();
  }

  // ✅ Nuevo método para guardar desde un arreglo (para cargue Excel)
  async guardarDesdeArray(datos: any[]): Promise<void> {
    if (!Array.isArray(datos) || datos.length === 0) return;

    const operaciones = datos.map(async (item) => {
      if (!item.pacienteId) return;

      // 🔄 Buscar si ya existe un registro para ese paciente
      const existe = await this.ttortModel.findOne({ pacienteId: item.pacienteId });

      if (existe) {
        // Si ya existe, actualizar
        await this.ttortModel.updateOne({ _id: existe._id }, item).exec();
      } else {
        // Si no existe, crear uno nuevo
        const nuevo = new this.ttortModel(item);
        await nuevo.save();
      }
    });

    await Promise.all(operaciones);
  }
}
