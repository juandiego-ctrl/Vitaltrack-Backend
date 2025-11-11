import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ttocxreconstructivaDto } from "./ttocxreconstructiva.dto";
import { ITtocxreconstructiva } from "./ttocxreconstructiva.modelo";

@Injectable()
export class TtocxreconstructivaService {
  constructor(
    @InjectModel("ttocxreconstructiva")
    private readonly ttocxreconstructivaModel: Model<ITtocxreconstructiva>,
  ) {}

  // Crear un nuevo registro
  async crearTtocxreconstructiva(dto: ttocxreconstructivaDto): Promise<ITtocxreconstructiva> {
    const nuevo = new this.ttocxreconstructivaModel(dto);
    return await nuevo.save();
  }

  // Buscar por ID
  async buscarTtocxreconstructiva(id: string): Promise<ITtocxreconstructiva | null> {
    return await this.ttocxreconstructivaModel.findById(id).exec();
  }

  // Buscar todos
  async buscarTodos(): Promise<ITtocxreconstructiva[]> {
    return await this.ttocxreconstructivaModel.find().exec();
  }

  // Eliminar por ID
  async eliminarTtocxreconstructiva(id: string): Promise<boolean> {
    const res = await this.ttocxreconstructivaModel.deleteOne({ _id: id }).exec();
    return res.deletedCount === 1;
  }

  // Actualizar por ID
  async actualizarTtocxreconstructiva(
    id: string,
    dto: ttocxreconstructivaDto,
  ): Promise<ITtocxreconstructiva | null> {
    return await this.ttocxreconstructivaModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  // Buscar por paciente
  async buscarPorPaciente(pacienteId: string): Promise<ITtocxreconstructiva[]> {
    return await this.ttocxreconstructivaModel.find({ pacienteId }).exec();
  }

  // Guardar desde array (para cargue Excel)
  async guardarDesdeArray(
    datos: ttocxreconstructivaDto[]
  ): Promise<{ accion: string; ttocxreconstructiva?: ITtocxreconstructiva; error?: string }[]> {
    const resultados: { accion: string; ttocxreconstructiva?: ITtocxreconstructiva; error?: string }[] = [];

    for (const item of datos) {
      try {
        const existe = await this.ttocxreconstructivaModel.findOne({
          pacienteId: item.pacienteId,
        }).exec();

        if (existe) {
          const actualizado = await this.ttocxreconstructivaModel.findByIdAndUpdate(
            existe._id,
            item,
            { new: true },
          ).exec();
          resultados.push({ accion: "actualizado", ttocxreconstructiva: actualizado ?? undefined });
        } else {
          const nuevo = new this.ttocxreconstructivaModel(item);
          const guardado = await nuevo.save();
          resultados.push({ accion: "creado", ttocxreconstructiva: guardado });
        }
      } catch (error: any) {
        resultados.push({ accion: "error", error: error.message });
      }
    }

    return resultados;
  }
}
