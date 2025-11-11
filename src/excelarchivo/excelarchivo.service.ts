import * as XLSX from 'xlsx';
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { excelarchivoDto } from './excelarchivo.dto';
import { IExcelarchivo } from './excelarchivo.modelo';
import { PacienteService } from '../paciente/paciente.service';
import { IPaciente } from '../paciente/paciente.modelo';

@Injectable()
export class ExcelarchivoService {
  constructor(
    @InjectModel('excelarchivo')
    private excelarchivoModel: Model<IExcelarchivo>,

    private pacienteService: PacienteService,

    @InjectModel('Paciente')
    private pacienteModel: Model<IPaciente>,
  ) {}

  // 📌 CRUD básico para Excelarchivo
  async crearExcelArchivo(dto: excelarchivoDto): Promise<IExcelarchivo> {
    return await new this.excelarchivoModel(dto).save();
  }

  async buscarExcelArchivo(id: string): Promise<IExcelarchivo | null> {
    return await this.excelarchivoModel.findById(id).exec();
  }

  async buscarTodos(): Promise<IExcelarchivo[]> {
    return await this.excelarchivoModel.find().sort({ fechaCargue: -1 }).exec();
  }

  async eliminarExcelArchivo(id: string): Promise<boolean> {
    const res = await this.excelarchivoModel.deleteOne({ _id: id }).exec();
    return res.deletedCount === 1;
  }

  async actualizarExcelArchivo(
    id: string,
    dto: excelarchivoDto,
  ): Promise<IExcelarchivo | null> {
    return await this.excelarchivoModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }

  // CORRECCIÓN: Nuevo método para procesar archivo Excel y guardar pacientes
  async procesarArchivoExcel(V6NumId: string, file: Express.Multer.File): Promise<any> {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' }); // CORRECCIÓN: Lee el buffer del archivo
      const sheetName = workbook.SheetNames[0]; // Asume la primera hoja
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Convierte a JSON

      // CORRECCIÓN: Mapear datos a modelo IPaciente (ajusta según tu esquema real)
      const pacientes: Partial<IPaciente>[] = data.slice(1).map((row: any[]) => ({
        V1PrimerNom: row[0],
        V2SegundoNom: row[1],
        V3PrimerApe: row[2],
        V4SegundoApe: row[3],
        V5TipoID: row[4],
        V6NumID: row[5] || V6NumId, // Usa V6NumId si no está en el row
        V7FecNac: row[6],
        V8Sexo: row[7],
        V15NumTel: row[8],
        // Agrega más campos según tu esquema IPaciente
      }));

      // CORRECCIÓN: Guardar en bulk para eficiencia
      const insertados = await this.pacienteModel.insertMany(pacientes);
      return { totalInsertados: insertados.length };
    } catch (error) {
      console.error('Error procesando archivo:', error);
      throw new InternalServerErrorException('Error al procesar el archivo Excel.');
    }
  }

  // 🔍 Consulta de un paciente por número de documento
  async consultaPacientePorCedula(V6NumId: string) {
    if (!V6NumId) {
      throw new BadRequestException('Debe proporcionar un número de documento válido.');
    }

    try {
      const paciente = await this.pacienteService.buscarPorCedula(V6NumId);

      if (!paciente) {
        return {
          ok: false,
          mensaje: 'No se encontró ningún paciente con ese número de documento.',
        };
      }

      return {
        ok: true,
        paciente,
      };
    } catch (err: any) {
      console.error('❌ Error en consultaPacientePorCedula:', err.message);
      throw new InternalServerErrorException(
        'Error realizando la consulta del paciente.',
      );
    }
  }

  // 📋 Consulta de todos los pacientes (con paginación)
  async consultaTodosLosPacientes(page: number = 1, limit: number = 10): Promise<IPaciente[]> {
    try {
      // CORRECCIÓN: Agregada paginación y ordenamiento (por fecha de nacimiento descendente)
      return await this.pacienteModel
        .find()
        .sort({ V7FecNac: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
    } catch (error) {
      console.error('Error al consultar todos los pacientes:', error);
      throw new InternalServerErrorException('Error al consultar todos los pacientes');
    }
  }
}