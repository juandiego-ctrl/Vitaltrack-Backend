// ttocxreconstructiva.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ttocxreconstructivaDto } from './ttocxreconstructiva.dto';
import { ITtocxreconstructiva } from './ttocxreconstructiva.modelo';

@Injectable()
export class TtocxreconstructivaService {
  constructor(
    @InjectModel('ttocxreconstructiva')
    private readonly ttocxreconstructivaModel: Model<ITtocxreconstructiva>,
  ) {}

  // ✅ Crear un nuevo registro
  async crearTtocxreconstructiva(dto: ttocxreconstructivaDto): Promise<ITtocxreconstructiva> {
    const nuevo = new this.ttocxreconstructivaModel(dto);
    return await nuevo.save();
  }

  // ✅ Buscar por ID
  async buscarTtocxreconstructiva(id: string): Promise<ITtocxreconstructiva | null> {
    return await this.ttocxreconstructivaModel.findById(id).exec();
  }

  // ✅ Buscar todos
  async buscarTodos(): Promise<ITtocxreconstructiva[]> {
    return await this.ttocxreconstructivaModel.find().exec();
  }

  // ✅ Eliminar por ID
  async eliminarTtocxreconstructiva(id: string): Promise<boolean> {
    const res = await this.ttocxreconstructivaModel.deleteOne({ _id: id }).exec();
    return res.deletedCount === 1;
  }

  // ✅ Actualizar por ID
  async actualizarTtocxreconstructiva(
    id: string,
    dto: ttocxreconstructivaDto,
  ): Promise<ITtocxreconstructiva | null> {
    return await this.ttocxreconstructivaModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  // ✅ Buscar por paciente
  async buscarPorPaciente(filtro: any): Promise<ITtocxreconstructiva[]> {
    return await this.ttocxreconstructivaModel.find(filtro).exec();
  }

  // ✅ Nuevo método: guardar desde arreglo (para cargue Excel)
  async guardarDesdeArray(datos: any[]): Promise<void> {
    if (!Array.isArray(datos) || datos.length === 0) return;

    const operaciones = datos.map(async (item) => {
      if (!item.pacienteId) return;

      // 🔍 Buscar si ya existe el registro del paciente con esa cirugía reconstructiva
      const existe = await this.ttocxreconstructivaModel.findOne({
        pacienteId: item.pacienteId,
        procedimiento: item.procedimiento, // ajusta el campo si es diferente
      });

      if (existe) {
        // Si existe, se actualiza
        await this.ttocxreconstructivaModel.updateOne({ _id: existe._id }, item).exec();
      } else {
        // Si no existe, se crea un nuevo registro
        const nuevo = new this.ttocxreconstructivaModel(item);
        await nuevo.save();
      }
    });

    await Promise.all(operaciones);
  }
}
