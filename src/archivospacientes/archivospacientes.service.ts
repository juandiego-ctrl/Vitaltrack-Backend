import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArchivospacientesDto } from './archivospacientes.dto';
import { IArchivospacientes } from './archivospacientes.modelo';

@Injectable()
export class ArchivospacientesService {
  constructor(
    @InjectModel('archivospacientes')
    private archivospacientesModel: Model<IArchivospacientes>,
  ) {}

  // Crear un archivo de paciente
  async crearArchivoPaciente(dto: ArchivospacientesDto): Promise<IArchivospacientes> {
    const creacion = new this.archivospacientesModel(dto);
    return await creacion.save();
  }

  // Buscar archivo por ID
  async buscarArchivoPaciente(id: string): Promise<IArchivospacientes | null> {
    return await this.archivospacientesModel.findById(id).exec();
  }

  // Buscar todos los archivos
  async buscarTodos(): Promise<IArchivospacientes[]> {
    return await this.archivospacientesModel.find().exec();
  }

  // Eliminar archivo por ID
  async eliminarArchivoPaciente(id: string): Promise<boolean> {
    const respuesta = await this.archivospacientesModel.deleteOne({ _id: id }).exec();
    return respuesta.deletedCount === 1;
  }

  // Actualizar archivo
  async actualizarArchivoPaciente(
    id: string,
    dto: ArchivospacientesDto,
  ): Promise<IArchivospacientes | null> {
    return await this.archivospacientesModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }

  // Guardar múltiples archivos desde Array (para cargue centralizado)
  async guardarDesdeArray(
    datos: ArchivospacientesDto[],
  ): Promise<{ accion: string; archivo?: IArchivospacientes; error?: string }[]> {
    const resultados: { accion: string; archivo?: IArchivospacientes; error?: string }[] = [];

    for (const item of datos) {
      try {
        const existe = await this.archivospacientesModel.findOne({ id: item.id }).exec();

        if (existe) {
          const actualizado = await this.archivospacientesModel
            .findOneAndUpdate({ id: item.id }, item, { new: true })
            .exec();
          resultados.push({ accion: 'actualizado', archivo: actualizado ?? undefined });
        } else {
          const nuevo = new this.archivospacientesModel(item);
          const creado = await nuevo.save();
          resultados.push({ accion: 'creado', archivo: creado });
        }
      } catch (error: any) {
        resultados.push({ accion: 'error', error: error.message });
      }
    }

    return resultados;
  }

  // Buscar archivos por paciente (para integrarse al cargue centralizado)
  async buscarPorPaciente(pacienteId: string): Promise<IArchivospacientes[]> {
    return await this.archivospacientesModel.find({ pacienteId }).exec();
  }
}
