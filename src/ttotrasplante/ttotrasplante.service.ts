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

  async crearTtotrasplante(dto: ttotrasplanteDto): Promise<ITtotrasplante> {
    const nuevo = new this.ttotrasplanteModel(dto);
    return await nuevo.save();
  }

  async buscarTtotrasplante(id: string): Promise<ITtotrasplante | null> {
    return this.ttotrasplanteModel.findById(id).exec();
  }

  async buscarTodos(): Promise<ITtotrasplante[]> {
    return this.ttotrasplanteModel.find().exec();
  }

  async eliminarTtotrasplante(id: string): Promise<boolean> {
    const resultado = await this.ttotrasplanteModel.deleteOne({ _id: id }).exec();
    return resultado.deletedCount === 1;
  }

  async actualizarTtotrasplante(id: string, dto: ttotrasplanteDto): Promise<ITtotrasplante | null> {
    return this.ttotrasplanteModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async buscarPorPaciente(filtro: { pacienteId: string }): Promise<ITtotrasplante[]> {
    return this.ttotrasplanteModel.find(filtro).exec();
  }

  // ✅ Método para cargue masivo desde Excel
  async guardarDesdeArray(
    lista: ttotrasplanteDto[],
  ): Promise<{ accion: string; registro?: ITtotrasplante; error?: string }[]> {
    const resultados: { accion: string; registro?: ITtotrasplante; error?: string }[] = [];

    for (const item of lista) {
      try {
        const existe = await this.ttotrasplanteModel.findOne({
          pacienteId: item.pacienteId,
          V106RecibioTrasplanteCM: item.V106RecibioTrasplanteCM, // Campo identificador
        }).exec();

        if (existe) {
          // 🔄 Actualizar si ya existe
          const actualizado = await this.ttotrasplanteModel.findByIdAndUpdate(
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
          const nuevo = new this.ttotrasplanteModel(item);
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
