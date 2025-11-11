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
  async guardarDesdeArray(datos: any[]): Promise<void> {
    if (!Array.isArray(datos) || datos.length === 0) return;

    const operaciones = datos.map(async (item) => {
      if (!item.pacienteId) return;

      const existe = await this.ttotrasplanteModel.findOne({ pacienteId: item.pacienteId }).exec();

      if (existe) {
        await this.ttotrasplanteModel.updateOne({ _id: existe._id }, item).exec();
      } else {
        const nuevo = new this.ttotrasplanteModel(item);
        await nuevo.save();
      }
    });

    await Promise.all(operaciones);
  }
}
