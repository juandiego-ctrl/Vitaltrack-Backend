import * as XLSX from 'xlsx';
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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

  // 📌 CRUD básico
  async crearExcelArchivo(excelarchivo: excelarchivoDto): Promise<IExcelarchivo> {
    return await new this.excelarchivoModel(excelarchivo).save();
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

  async actualizarExcelArchivo(id: string, excelarchivoDto: excelarchivoDto): Promise<IExcelarchivo | null> {
    return await this.excelarchivoModel.findByIdAndUpdate(id, excelarchivoDto, { new: true }).exec();
  }

  // 🧩 Auxiliar: mapea campos de Excel a un objeto de modelo
  private extraerCampos(row: any, campos: string[], v6NumId: string) {
    const obj: any = { pacienteId: v6NumId };
    campos.forEach((campo) => {
      if (row[campo] !== undefined && row[campo] !== null && row[campo] !== '') {
        obj[campo] = row[campo];
      }
    });
    return obj;
  }

  // 📦 Procesa un archivo Excel completo
  async procesarCargueGeneral(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se ha recibido ningún archivo.');

    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const data: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      if (!data.length) throw new BadRequestException('El archivo Excel no contiene datos.');

      const resumen = {
        diagnosticos: 0,
        antecedentes: 0,
        archivospacientes: 0,
        ttocx: 0,
        ttocxreconstructiva: 0,
        ttopaliativos: 0,
        ttoqt: 0,
        ttort: 0,
        ttotrasplante: 0,
      };

      for (const row of data) {
        const v6NumId = row['V6NumID'] || row['V6NumId'];
        if (!v6NumId) continue; // ignora filas sin ID

        // Mapeos por servicio
        const diagObj = this.extraerCampos(row, ['V17CodCIE10', 'V18FecDiag', 'V19FecRemision'], v6NumId);
        if (Object.keys(diagObj).length > 1) {
          await this.diagnosticoService.guardarDesdeArray([diagObj]);
          resumen.diagnosticos++;
        }

        const antObj = this.extraerCampos(row, ['V42AntCancerPrim', 'V43FecDiagAnt'], v6NumId);
        if (Object.keys(antObj).length > 1) {
          await this.antecedentesService.guardarDesdeArray([antObj]);
          resumen.antecedentes++;
        }

        const ttoqtObj = this.extraerCampos(row, ['V45RecibioQuimio', 'V46NumFasesQuimio'], v6NumId);
        if (Object.keys(ttoqtObj).length > 1) {
          await this.ttoqtService.guardarDesdeArray([ttoqtObj]);
          resumen.ttoqt++;
        }

        const ttocxObj = this.extraerCampos(row, ['V74RecibioCirugia', 'V75NumCirugias'], v6NumId);
        if (Object.keys(ttocxObj).length > 1) {
          await this.ttocxService.guardarDesdeArray([ttocxObj]);
          resumen.ttocx++;
        }

        const ttortObj = this.extraerCampos(row, ['V86RecibioRadioterapia', 'V87NumSesionesRadio'], v6NumId);
        if (Object.keys(ttortObj).length > 1) {
          await this.ttortService.guardarDesdeArray([ttortObj]);
          resumen.ttort++;
        }

        const ttotrasObj = this.extraerCampos(row, ['V106RecibioTrasplanteCM', 'V107TipoTrasplanteCM'], v6NumId);
        if (Object.keys(ttotrasObj).length > 1) {
          await this.ttotrasplanteService.guardarDesdeArray([ttotrasObj]);
          resumen.ttotrasplante++;
        }

        const ttocxrObj = this.extraerCampos(row, ['V111RecibioCirugiaReconst', 'V112FecCirugiaReconst'], v6NumId);
        if (Object.keys(ttocxrObj).length > 1) {
          await this.ttocxreconstructivaService.guardarDesdeArray([ttocxrObj]);
          resumen.ttocxreconstructiva++;
        }

        const ttopalObj = this.extraerCampos(row, ['V114RecibioCuidadoPaliativo', 'V115FecPrimConsCP'], v6NumId);
        if (Object.keys(ttopalObj).length > 1) {
          await this.ttopaliativosService.guardarDesdeArray([ttopalObj]);
          resumen.ttopaliativos++;
        }

        const archObj = this.extraerCampos(row, ['datos_excel', 'soportes_pdf'], v6NumId);
        if (Object.keys(archObj).length > 1) {
          await this.archivospacientesService.guardarDesdeArray([archObj]);
          resumen.archivospacientes++;
        }
      }

      await new this.excelarchivoModel({
        nombreArchivo: file.originalname,
        fechaCargue: new Date(),
      }).save();

      return {
        ok: true,
        mensaje: '✅ Cargue general procesado con éxito.',
        resumen,
      };
    } catch (err) {
      console.error('❌ Error en procesarCargueGeneral:', err.message);
      throw new InternalServerErrorException('Error procesando el archivo Excel.');
    }
  }

  // 🔍 Consulta general por número de documento
  async consultaGeneral(V6NumId: string) {
    if (!V6NumId) throw new BadRequestException('Debe proporcionar un número de documento válido.');

    try {
      const paciente = await this.pacienteService.buscarPorPaciente({ pacienteId: V6NumId });
      const diagnosticos = await this.diagnosticoService.buscarPorPaciente(V6NumId);
      const antecedentes = await this.antecedentesService.buscarPorPaciente(V6NumId);
      const ttocxreconstructiva = await this.ttocxreconstructivaService.buscarPorPaciente(V6NumId);
      const ttopaliativos = await this.ttopaliativosService.buscarPorPaciente(V6NumId);
      const ttoqt = await this.ttoqtService.buscarPorPaciente(V6NumId);
      const ttort = await this.ttortService.buscarPorPaciente(V6NumId);
      const ttotrasplante = await this.ttotrasplanteService.buscarPorPaciente({ pacienteId: V6NumId });

      if (!paciente && !diagnosticos?.length && !antecedentes?.length) {
        return { ok: false, mensaje: 'No se encontraron registros para este paciente.' };
      }

      return {
        ok: true,
        paciente,
        diagnosticos,
        antecedentes,
        ttocxreconstructiva,
        ttopaliativos,
        ttoqt,
        ttort,
        ttotrasplante,
      };
    } catch (err) {
      console.error('❌ Error en consultaGeneral:', err.message);
      throw new InternalServerErrorException('Error realizando la consulta general.');
    }
  }
}
