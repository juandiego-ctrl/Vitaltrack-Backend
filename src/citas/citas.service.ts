// src/citas/citas.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cita, CitaDocument } from './schemas/cita.schema';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';

@Injectable()
export class CitasService {
  constructor(@InjectModel(Cita.name) private citaModel: Model<CitaDocument>) {}

  async create(createCitaDto: CreateCitaDto): Promise<Cita> {
    const cita = new this.citaModel(createCitaDto);
    return cita.save();
  }

  async findAll(): Promise<Cita[]> {
    return this.citaModel.find().exec();
  }

  async findOne(id: string): Promise<Cita> {
    const cita = await this.citaModel.findById(id).exec();
    if (!cita) throw new NotFoundException(`Cita con id ${id} no encontrada`);
    return cita;
  }

  async update(id: string, updateCitaDto: UpdateCitaDto): Promise<Cita> {
    const cita = await this.citaModel
      .findByIdAndUpdate(id, updateCitaDto, { new: true })
      .exec();
    if (!cita) throw new NotFoundException(`Cita con id ${id} no encontrada`);
    return cita;
  }

  async remove(id: string): Promise<void> {
    const result = await this.citaModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Cita con id ${id} no encontrada`);
  }

  // Buscar citas por paciente (por cédula)
  async buscarPorPaciente(V6NumID: string): Promise<Cita[]> {
    return await this.citaModel.find({ V6NumID }).exec();
  }
}
