import * as XLSX from 'xlsx';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { excelarchivoDto } from './excelarchivo.dto';
import { IExcelarchivo } from './excelarchivo.modelo';

import { PacienteService } from '../paciente/paciente.service';
import { DiagnosticoService } from '../diagnostico/diagnostico.service';
import { AntecedentesService } from '../antecedentes/antecedentes.service';
import { ArchivospacientesService } from '../archivospacientes/archivospacientes.service';
import { TtocxService } from '../ttocx/ttocx.service';
import { TtocxreconstructivaService } from '../ttocxreconstructiva/ttocxreconstructiva.service';
import { TtopaliativosService } from '../ttopaliativos/ttopaliativos.service';
import { TtoqtService } from '../ttoqt/ttoqt.service';
import { TtortService } from '../ttort/ttort.service';
import { TtotrasplanteService } from '../ttotrasplante/ttotrasplante.service';
import { Express } from 'express';

@Injectable()
export class ExcelarchivoService {
  constructor(
    @InjectModel('excelarchivo') private excelarchivoModel: Model<IExcelarchivo>,
    private pacienteService: PacienteService,
    private diagnosticoService: DiagnosticoService,
    private antecedentesService: AntecedentesService,
    private archivospacientesService: ArchivospacientesService,
    private ttocxService: TtocxService,
    private ttocxreconstructivaService: TtocxreconstructivaService,
    private ttopaliativosService: TtopaliativosService,
    private ttoqtService: TtoqtService,
    private ttortService: TtortService,
    private ttotrasplanteService: TtotrasplanteService,
  ) {}

  // CRUD básico
  async crearExcelArchivo(excelarchivo: excelarchivoDto): Promise<IExcelarchivo> {
    return await new this.excelarchivoModel(excelarchivo).save();
  }

  async buscarExcelArchivo(id: string): Promise<IExcelarchivo | null> {
    return await this.excelarchivoModel.findById(id).exec();
  }

  async buscarTodos(): Promise<IExcelarchivo[]> {
    return await this.excelarchivoModel.find().exec();
  }

  async eliminarExcelArchivo(id: string): Promise<boolean> {
    const res = await this.excelarchivoModel.deleteOne({ _id: id }).exec();
    return res.deletedCount === 1;
  }

  async actualizarExcelArchivo(id: string, excelarchivoDto: excelarchivoDto): Promise<IExcelarchivo | null> {
    return await this.excelarchivoModel.findByIdAndUpdate(id, excelarchivoDto, { new: true }).exec();
  }

  // Método auxiliar para mapear campos de Excel
  private extraerCampos(row: any, campos: string[], v6NumId: string) {
    const obj: any = { pacienteId: v6NumId }; // estandarizamos a pacienteId para servicios
    campos.forEach(campo => {
      if (row[campo] !== undefined && row[campo] !== null && row[campo] !== '') {
        obj[campo] = row[campo];
      }
    });
    return obj;
  }

  // Procesar cargue general desde Excel
  async procesarCargueGeneral(file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!data.length) throw new Error('El archivo Excel no contiene datos');

    const resumen = {
      diagnosticos: 0, antecedentes: 0, archivospacientes: 0,
      ttocx: 0, ttocxreconstructiva: 0, ttopaliativos: 0, ttoqt: 0,
      ttort: 0, ttotrasplante: 0
    };

    for (const row of data) {
      const v6NumId = row['V6NumID'] || row['V6NumId'];
      if (!v6NumId) throw new Error(`Falta V6NumId en una fila: ${JSON.stringify(row)}`);

      // Cargue de cada módulo usando guardarDesdeArray si aplica
      const diagObj = this.extraerCampos(row, ['V17CodCIE10','V18FecDiag','V19FecRemision'], v6NumId);
      if (Object.keys(diagObj).length > 1) { await this.diagnosticoService.guardarDesdeArray([diagObj]); resumen.diagnosticos++; }

      const antObj = this.extraerCampos(row, ['V42AntCancerPrim','V43FecDiagAnt'], v6NumId);
      if (Object.keys(antObj).length > 1) { await this.antecedentesService.guardarDesdeArray([antObj]); resumen.antecedentes++; }

      const ttoqtObj = this.extraerCampos(row, ['V45RecibioQuimio','V46NumFasesQuimio'], v6NumId);
      if (Object.keys(ttoqtObj).length > 1) { await this.ttoqtService.guardarDesdeArray([ttoqtObj]); resumen.ttoqt++; }

      const ttocxObj = this.extraerCampos(row, ['V74RecibioCirugia','V75NumCirugias'], v6NumId);
      if (Object.keys(ttocxObj).length > 1) { await this.ttocxService.guardarDesdeArray([ttocxObj]); resumen.ttocx++; }

      const ttortObj = this.extraerCampos(row, ['V86RecibioRadioterapia','V87NumSesionesRadio'], v6NumId);
      if (Object.keys(ttortObj).length > 1) { await this.ttortService.guardarDesdeArray([ttortObj]); resumen.ttort++; }

      const ttotrasObj = this.extraerCampos(row, ['V106RecibioTrasplanteCM','V107TipoTrasplanteCM'], v6NumId);
      if (Object.keys(ttotrasObj).length > 1) { await this.ttotrasplanteService.guardarDesdeArray([ttotrasObj]); resumen.ttotrasplante++; }

      const ttocxrObj = this.extraerCampos(row, ['V111RecibioCirugiaReconst','V112FecCirugiaReconst'], v6NumId);
      if (Object.keys(ttocxrObj).length > 1) { await this.ttocxreconstructivaService.guardarDesdeArray([ttocxrObj]); resumen.ttocxreconstructiva++; }

      const ttopalObj = this.extraerCampos(row, ['V114RecibioCuidadoPaliativo','V115FecPrimConsCP'], v6NumId);
      if (Object.keys(ttopalObj).length > 1) { await this.ttopaliativosService.guardarDesdeArray([ttopalObj]); resumen.ttopaliativos++; }

      const archObj = this.extraerCampos(row, ['datos_excel','soportes_pdf'], v6NumId);
      if (Object.keys(archObj).length > 1) { await this.archivospacientesService.guardarDesdeArray([archObj]); resumen.archivospacientes++; }
    }

    // Guardar registro del Excel cargado
    await new this.excelarchivoModel({
      nombreArchivo: file.originalname,
      fechaCargue: new Date()
    }).save();

    return { ok: true, mensaje: 'Cargue general procesado con éxito', resumen };
  }

  // Consulta general de un paciente
  async consultaGeneral(V6NumId: string) {
    return {
      ok: true,
      paciente: await this.pacienteService.buscarPorPaciente({ pacienteId: V6NumId }),
      diagnosticos: await this.diagnosticoService.buscarPorPaciente({ pacienteId: V6NumId }),
      antecedentes: await this.antecedentesService.buscarPorPaciente({ pacienteId: V6NumId }),
      archivos: await this.archivospacientesService.buscarPorPaciente(V6NumId),
      ttocx: await this.ttocxService.buscarPorPaciente(V6NumId),
      ttocxreconstructiva: await this.ttocxreconstructivaService.buscarPorPaciente({ pacienteId: V6NumId }),
      ttopaliativos: await this.ttopaliativosService.buscarPorPaciente({ pacienteId: V6NumId }),
      ttoqt: await this.ttoqtService.buscarPorPaciente({ pacienteId: V6NumId }),
      ttort: await this.ttortService.buscarPorPaciente({ pacienteId: V6NumId }),
      ttotrasplante: await this.ttotrasplanteService.buscarPorPaciente({ pacienteId: V6NumId }),
    };
  }
}
