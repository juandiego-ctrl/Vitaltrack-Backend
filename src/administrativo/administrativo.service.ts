import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { administrativoDto } from './administrativo.dto';
import { IAdministrativo } from './administrativo.modelo';

@Injectable()
export class AdministrativoService {
  constructor(
    @InjectModel('administrativo') private administrativoModel: Model<IAdministrativo>,
  ) {}

  // Crear registro administrativo
  async crearAdministrativo(administrativo: administrativoDto): Promise<IAdministrativo> {
    const creacion = new this.administrativoModel(administrativo);
    return await creacion.save();
  }

  // Buscar registro por ID
  async buscarAdministrativo(id: string): Promise<IAdministrativo | null> {
    try {
      return await this.administrativoModel.findOne({ _id: id }).exec();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Buscar todos los registros
  async buscarTodos(): Promise<IAdministrativo[]> {
    return await this.administrativoModel.find().exec();
  }

  // Eliminar registro por ID
  async eliminarAdministrativo(id: string): Promise<any> {
    const respuesta = await this.administrativoModel.deleteOne({ _id: id }).exec();
    return respuesta.deletedCount === 1 ? respuesta : null;
  }

  // Actualizar registro por ID
  async actualizarAdministrativo(id: string, administrativoDto: administrativoDto): Promise<IAdministrativo | null> {
    try {
      return await this.administrativoModel.findOneAndUpdate(
        { _id: id },
        administrativoDto,
        { new: true } // Retorna el documento actualizado
      ).exec();
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Guardar múltiples registros (Excel / Array) - preparado para centralizar cargue
  async guardarDesdeArray(administrativos: administrativoDto[]): Promise<any> {
    const resultados: { accion: string; administrativo?: IAdministrativo; error?: string }[] = [];

    for (const admin of administrativos) {
      try {
        const existe = await this.administrativoModel.findOne({ V133CodUnicoID: admin.V133CodUnicoID }).exec();

        if (existe) {
          const actualizado = await this.administrativoModel.findOneAndUpdate(
            { V133CodUnicoID: admin.V133CodUnicoID },
            admin,
            { new: true }
          ).exec();

          if (actualizado) {
            resultados.push({ accion: 'actualizado', administrativo: actualizado });
          } else {
            resultados.push({ accion: 'error', error: 'No se pudo actualizar' });
          }

        } else {
          const nuevo = new this.administrativoModel(admin);
          const guardado = await nuevo.save();
          resultados.push({ accion: 'creado', administrativo: guardado });
        }
      } catch (error: any) {
        resultados.push({ accion: 'error', error: error.message });
      }
    }

    return { ok: true, resultados };
  }
}
