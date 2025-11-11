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

  // 🟢 Crear nuevo tratamiento de radioterapia
  async crearTtort(dto: ttortDto): Promise<ITtort> {
    const nuevo = new this.ttortModel(dto);
    return await nuevo.save();
  }

  // 🟢 Buscar por ID
  async buscarTtort(id: string): Promise<ITtort | null> {
    return await this.ttortModel.findById(id).exec();
  }

  // 🟢 Buscar todos
  async buscarTodos(): Promise<ITtort[]> {
    return await this.ttortModel.find().exec();
  }

  // 🟢 Buscar tratamientos por pacienteId
  async buscarPorPaciente(pacienteId: string): Promise<ITtort[]> {
    return await this.ttortModel.find({ pacienteId }).exec();
  }

  // 🟡 Actualizar
  async actualizarTtort(id: string, dto: ttortDto): Promise<ITtort | null> {
    return await this.ttortModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  // 🔴 Eliminar
  async eliminarTtort(id: string): Promise<boolean> {
    const res = await this.ttortModel.deleteOne({ _id: id }).exec();
    return res.deletedCount === 1;
  }

  // 🧩 Guardar desde arreglo (cargue masivo desde Excel)
  async guardarDesdeArray(datos: any[]): Promise<void> {
    if (!Array.isArray(datos) || datos.length === 0) return;

    const operaciones = datos.map(async (item) => {
      if (!item.pacienteId) return;

      const existe = await this.ttortModel.findOne({ pacienteId: item.pacienteId });

      if (existe) {
        await this.ttortModel.updateOne({ _id: existe._id }, item).exec();
      } else {
        const nuevo = new this.ttortModel(item);
        await nuevo.save();
      }
    });

    await Promise.all(operaciones);
  }
}
