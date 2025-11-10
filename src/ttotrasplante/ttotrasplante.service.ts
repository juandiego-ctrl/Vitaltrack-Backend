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
    return await this.ttotrasplanteModel.findById(id).exec();
  }

  async buscarTodos(): Promise<ITtotrasplante[]> {
    return await this.ttotrasplanteModel.find().exec();
  }

  async eliminarTtotrasplante(id: string): Promise<boolean> {
    const res = await this.ttotrasplanteModel.deleteOne({ _id: id }).exec();
    return res.deletedCount === 1;
  }

  async actualizarTtotrasplante(id: string, dto: ttotrasplanteDto): Promise<ITtotrasplante | null> {
    return await this.ttotrasplanteModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async buscarPorPaciente(filtro: any): Promise<ITtotrasplante[]> {
    return await this.ttotrasplanteModel.find(filtro).exec();
  }

  // ✅ Nuevo método para guardar desde un arreglo (para cargue Excel)
  async guardarDesdeArray(datos: any[]): Promise<void> {
    if (!Array.isArray(datos) || datos.length === 0) return;

    const operaciones = datos.map(async (item) => {
      if (!item.pacienteId) return;

      // 🔄 Buscar si ya existe un registro de ese paciente
      const existe = await this.ttotrasplanteModel.findOne({ pacienteId: item.pacienteId });

      if (existe) {
        // Si ya existe, actualizar
        await this.ttotrasplanteModel.updateOne({ _id: existe._id }, item).exec();
      } else {
        // Si no existe, crear uno nuevo
        const nuevo = new this.ttotrasplanteModel(item);
        await nuevo.save();
      }
    });

    await Promise.all(operaciones);
  }
}
