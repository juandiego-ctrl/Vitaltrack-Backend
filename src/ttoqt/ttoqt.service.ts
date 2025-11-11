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

  // ✅ Buscar todos los tratamientos de un paciente
  async buscarPorPaciente(pacienteId: string): Promise<ITtoqt[]> {
    return await this.ttoqtModel.find({ pacienteId }).exec();
  }

  // ✅ Guardar desde un arreglo (para cargue Excel)
  async guardarDesdeArray(datos: any[]): Promise<void> {
    if (!Array.isArray(datos) || datos.length === 0) return;

    const operaciones = datos.map(async (item) => {
      if (!item.pacienteId) return;

      // 🔍 Buscar si ya existe un registro del tratamiento para este paciente
      const existe = await this.ttoqtModel.findOne({
        pacienteId: item.pacienteId,
        V86RecibioQT: item.V86RecibioQT, // ajusta si tu campo identificador del tratamiento es distinto
      }).exec();

      if (existe) {
        // 🔄 Si existe, actualiza
        await this.ttoqtModel.updateOne(
          { _id: existe._id },
          { $set: item }
        ).exec();
      } else {
        // 🆕 Si no existe, crea nuevo
        const nuevo = new this.ttoqtModel(item);
        await nuevo.save();
      }
    });

    await Promise.all(operaciones);
  }
}
