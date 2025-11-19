// medicamentos.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicamento } from './schema/medicamento.schema';

@Injectable()
export class MedicamentosService {
  constructor(
    @InjectModel(Medicamento.name)
    private readonly medicamentoModel: Model<Medicamento>,
  ) {}

  async crear(data: any) {
    const med = new this.medicamentoModel(data);
    return med.save();
  }

  async obtenerActivos() {
    return this.medicamentoModel.find({ activo: true }).exec();
  }
}
