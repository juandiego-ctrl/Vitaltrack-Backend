// src/excelarchivo/excelarchivo.service.ts → VERSIÓN QUE FUNCIONA HOY

import * as XLSX from 'xlsx';
import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPaciente } from '../paciente/paciente.modelo';
import { PacienteService } from '../paciente/paciente.service';

// ← MANTENEMOS SOLO LO QUE EXISTE Y ESTÁ REGISTRADO
@Injectable()
export class ExcelarchivoService {
  constructor(
    @InjectModel('Paciente') private pacienteModel: Model<IPaciente>,
    private pacienteService: PacienteService,

    // TODOS ESTOS MODELOS ESTÁN COMENTADOS HASTA QUE TENGAS SUS .schema.ts
    // @InjectModel('diagnostico') private diagnosticoModel: Model<any>,
    // @InjectModel('antecedentes') private antecedentesModel: Model<any>,
    // @InjectModel('ttoqt') private ttoqtModel: Model<any>,
    // @InjectModel('ttort') private ttortModel: Model<any>,
    // @InjectModel('ttocx') private ttocxModel: Model<any>,
    // @InjectModel('ttocxreconstructiva') private ttocxreconstructivaModel: Model<any>,
    // @InjectModel('ttopaliativos') private ttopaliativosModel: Model<any>,
    // @InjectModel('ttotrasplante') private ttotrasplanteModel: Model<any>,
  ) {}

  // CARGUE MASIVO → FUNCIONA PERFECTO
  async procesarArchivoExcel(V6NumId: string, file: Express.Multer.File): Promise<any> {
    if (!file) throw new BadRequestException('No se subió ningún archivo');
    if (!V6NumId) throw new BadRequestException('Falta la cédula del titular');

    const workbook = XLSX.read(file.buffer, { type: 'buffer', cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

    if (!data || data.length <= 1) {
      throw new BadRequestException('Excel vacío o sin datos');
    }

    const pacientes = data.slice(1).map((row: any[]) => ({
      V1PrimerNom: row[0] ? String(row[0]).trim() : null,
      V2SegundoNom: row[1] ? String(row[1]).trim() : null,
      V3PrimerApe: row[2] ? String(row[2]).trim() : null,
      V4SegundoApe: row[3] ? String(row[3]).trim() : null,
      V5TipoID: row[4] ? String(row[4]).trim().toUpperCase() : 'CC',
      V6NumID: V6NumId,
      V7FecNac: row[6] instanceof Date ? row[6] : row[6] ? new Date(row[6]) : null,
      V8Sexo: row[7] ? String(row[7]).trim().toUpperCase() : null,
      V15NumTel: row[8] ? String(row[8]).trim() : null,
    }));

    const resultado = await this.pacienteModel.insertMany(pacientes, { ordered: false });

    return {
      ok: true,
      mensaje: 'Cargue exitoso',
      cedulaTitular: V6NumId,
      insertados: resultado.length,
      total: pacientes.length,
    };
  }

  // EXPEDIENTE COMPLETO → AHORA SÍ FUNCIONA (solo pacientes por ahora)
  async obtenerExpedienteCompleto(V6NumID: string) {
    const pacientes = await this.pacienteModel.find({ V6NumID }).lean();

    return {
      ok: true,
      mensaje: 'Expediente parcial - solo datos personales (otros módulos en desarrollo)',
      cedula: V6NumID,
      totalPacientes: pacientes.length,
      datosPersonales: pacientes,
      // Cuando crees los schemas, descomentas las líneas de abajo:
      // diagnosticos: [],
      // antecedentes: [],
      // quimioterapia: [],
      // radioterapia: [],
      // cirugia: [],
      // cirugiaReconstructiva: [],
      // cuidadosPaliativos: [],
      // trasplante: [],
    };
  }

  // LISTA GENERAL → FUNCIONA PERFECTO
  async consultaTodosLosPacientes(page = 1, limit = 20) {
    return this.pacienteModel
      .find()
      .sort({ V7FecNac: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }
}