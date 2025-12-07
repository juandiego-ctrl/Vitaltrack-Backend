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
  async buscarPorPaciente(pacienteId: string): Promise<ITtopaliativos[]> {
    return await this.ttopaliativosModel.find({ pacienteId }).exec();
  }

  // ✅ Guardar desde array para cargue masivo
  async guardarDesdeArray(
    lista: ttopaliativosDto[],
  ): Promise<{ accion: string; registro?: ITtopaliativos; error?: string }[]> {
    const resultados: { accion: string; registro?: ITtopaliativos; error?: string }[] = [];

    for (const item of lista) {
      try {
        // Buscar si ya existe un registro de ttopaliativos para este paciente
        const existe = await this.ttopaliativosModel.findOne({
          pacienteId: item.pacienteId,
          V114RecibioCuidadoPaliativo: item.V114RecibioCuidadoPaliativo, // Campo identificador
        }).exec();

        if (existe) {
          // 🔄 Actualizar si ya existe
          const actualizado = await this.ttopaliativosModel.findByIdAndUpdate(
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
          // 🆕 Crear nuevo registro
          const nuevo = new this.ttopaliativosModel(item);
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
