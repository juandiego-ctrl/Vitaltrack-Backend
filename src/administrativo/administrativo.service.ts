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

  // METODO PARA CREAR REGISTRO ADMINISTRATIVO
  async crearAdministrativo(administrativo: administrativoDto): Promise<IAdministrativo> {
    const creacion = new this.administrativoModel(administrativo);
    return await creacion.save();
  }

  // METODO PARA BUSCAR UN REGISTRO ADMINISTRATIVO POR ID
  async buscarAdministrativo(id: string): Promise<IAdministrativo | null> {
    try {
      const administrativoEncontrado = await this.administrativoModel.findOne({ _id: id }).exec();
      return administrativoEncontrado;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // METODO PARA BUSCAR TODOS LOS REGISTROS ADMINISTRATIVOS
  async buscarTodos(): Promise<IAdministrativo[]> {
    return await this.administrativoModel.find().exec();
  }

  // METODO PARA ELIMINAR UN REGISTRO ADMINISTRATIVO POR ID
  async eliminarAdministrativo(id: string): Promise<any> {
    const respuesta = await this.administrativoModel.deleteOne({ _id: id }).exec();
    return respuesta.deletedCount === 1 ? respuesta : null;
  }

  // METODO PARA ACTUALIZAR UN REGISTRO ADMINISTRATIVO
  async actualizarAdministrativo(id: string, administrativoDto: administrativoDto): Promise<IAdministrativo | null> {
    try {
      const administrativoActualizado = await this.administrativoModel.findOneAndUpdate(
        { _id: id },
        administrativoDto,
        { new: true } // Retorna el documento actualizado
      ).exec();
      return administrativoActualizado;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // METODO PARA CARGAR REGISTROS DESDE EXCEL
  async guardarAdministrativos(administrativos: administrativoDto[]): Promise<any> {
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
      } catch (error) {
        resultados.push({ accion: 'error', error: error.message });
      }
    }

    return { ok: true, resultados };
  }



}
