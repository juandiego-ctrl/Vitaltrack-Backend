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
  async guardarDesdeArray(
    lista: ttoqtDto[],
  ): Promise<{ accion: string; registro?: ITtoqt; error?: string }[]> {
    const resultados: { accion: string; registro?: ITtoqt; error?: string }[] = [];

    for (const item of lista) {
      try {
        // 🔍 Buscar si ya existe un registro del tratamiento para este paciente
        const existe = await this.ttoqtModel.findOne({
          pacienteId: item.pacienteId,
          V45RecibioQuimio: item.V45RecibioQuimio, // Campo identificador
        }).exec();

        if (existe) {
          // 🔄 Si existe, actualiza
          const actualizado = await this.ttoqtModel.findByIdAndUpdate(
            existe._id,
            item,
            { new: true }
          ).exec();
          if (actualizado) {
            resultados.push({ accion: 'actualizado', registro: actualizado });
          } else {
            resultados.push({ accion: 'error', error: 'Error al actualizar registro' });
          }
        } else {
          // 🆕 Si no existe, crea nuevo
          const nuevo = new this.ttoqtModel(item);
          const guardado = await nuevo.save();
          resultados.push({ accion: 'creado', registro: guardado });
        }
      } catch (error: any) {
        resultados.push({ accion: 'error', error: error.message });
      }
    }

    return resultados;
  }
}
