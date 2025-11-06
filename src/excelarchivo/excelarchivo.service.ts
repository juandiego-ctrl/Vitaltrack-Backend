import * as XLSX from 'xlsx';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { excelarchivoDto } from './excelarchivo.dto';
import { IExcelarchivo } from './excelarchivo.modelo';

import { PacienteService } from '../paciente/paciente.service';
import { diagnosticoService } from '../diagnostico/diagnostico.service';
import { AntecedentesService } from '../antecedentes/antecedentes.service';
import { ArchivospacientesService } from '../archivospacientes/archivospacientes.service';
import { ttocxService } from '../ttocx/ttocx.service';
import { ttocxreconstructivaService } from '../ttocxreconstructiva/ttocxreconstructiva.service';
import { ttopaliativosService } from '../ttopaliativos/ttopaliativos.service';
import { ttoqtService } from '../ttoqt/ttoqt.service';
import { ttortService } from '../ttort/ttort.service';
import { ttotrasplanteService } from '../ttotrasplante/ttotrasplante.service';

@Injectable()
export class excelarchivoService {
  constructor(
    @InjectModel('excelarchivo') private excelarchivoModel: Model<IExcelarchivo>,
    private pacienteService: PacienteService,
    private diagnosticoService: diagnosticoService,
    private antecedentesService: AntecedentesService,
    private archivospacientesService: ArchivospacientesService,
    private ttocxService: ttocxService,
    private ttocxreconstructivaService: ttocxreconstructivaService,
    private ttopaliativosService: ttopaliativosService,
    private ttoqtService: ttoqtService,
    private ttortService: ttortService,
    private ttotrasplanteService: ttotrasplanteService,
  ) {}

  async crearExcelArchivo(excelarchivo: excelarchivoDto): Promise<IExcelarchivo> {
    const creacion = new this.excelarchivoModel(excelarchivo);
    return await creacion.save();
  }

  async buscarExcelArchivo(id: string): Promise<IExcelarchivo | null> {
    return this.excelarchivoModel.findById(id).exec();
  }

  async buscarTodos(): Promise<IExcelarchivo[]> {
    return await this.excelarchivoModel.find().exec();
  }

  

  async eliminarExcelArchivo(id: string): Promise<any> {
    const respuesta = await this.excelarchivoModel.deleteOne({ _id: id }).exec();
    return respuesta.deletedCount === 1 ? respuesta : null;
  }

  async actualizarExcelArchivo(id: string, excelarchivoDto: excelarchivoDto): Promise<IExcelarchivo | null> {
    return this.excelarchivoModel.findOneAndUpdate({ _id: id }, excelarchivoDto, { new: true }).exec();
  }

  private extraerCampos(row: any, campos: string[], v6NumId: any) {
    const obj: any = { V6NumId: v6NumId };
    campos.forEach(campo => {
      if (row[campo] !== undefined && row[campo] !== null && row[campo] !== '') {
        obj[campo] = row[campo];
      }
    });
    return obj;
  }

  async procesarCargueGeneral(file: Express.Multer.File, V6NumId: string) {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data: any[] = XLSX.utils.sheet_to_json(sheet);

      if (!data.length) {
        throw new Error('El archivo Excel no contiene datos');
      }

      const resumen = {
        diagnosticos: 0, antecedentes: 0, archivospacientes: 0,
        ttocx: 0, ttocxreconstructiva: 0, ttopaliativos: 0, ttoqt: 0,
        ttort: 0, ttotrasplante: 0
      };

      for (const row of data) {
        const v6NumId = row['V6NumId'] || row['V6NumID'];
        if (!v6NumId) {
          throw new Error(`Falta V6NumId en una fila: ${JSON.stringify(row)}`);
        }

        // 1. Diagnóstico
        const diagObj = this.extraerCampos(row, [
          "V17CodCIE10","V18FecDiag","V19FecRemision","V20FecIngInst","V21TipoEstDiag","V22MotNoHistop",
          "V23FecRecMuestra","V24FecInfHistop","V25CodHabIPS","V26Fec1raCons","V27HistTumor","V28GradoDifTum",
          "V29EstadifTum","V30FecEstadif","V31PruebaHER2","V32FecPruebaHER2","V33ResHER2","V34EstadifDukes",
          "V35FecEstDukes","V36EstadifLinfMielo","V37ClasGleason","V38ClasRiesgoLL","V39FecClasRiesgo",
          "V40ObjTtoInicial","V41IntervMed","agrupador","observaciones"
        ], v6NumId);
        if (Object.keys(diagObj).length > 1) {
          await this.diagnosticoService.crearDiagnostico(diagObj);
          resumen.diagnosticos++;
        }

        // 2. Antecedentes
        const antObj = this.extraerCampos(row, ["V42AntCancerPrim","V43FecDiagAnt","V44TipoCancerAnt"], v6NumId);
        if (Object.keys(antObj).length > 1) {
          await this.antecedentesService.crearAntecedente(antObj);
          resumen.antecedentes++;
        }

        // 3. TTO Quimio
        const ttoqtObj = this.extraerCampos(row, [
          "V45RecibioQuimio","V46NumFasesQuimio","V47NumCiclosQuimio","V48UbicTempTto","V49FecIniEsq1",
          "V50NumIPSQuimio","V51CodIPSQuimio1","V52CodIPSQuimio2","V53MedATC1","V54MedATC2","V55MedATC3",
          "V56MedATC4","V57RecibioQuimioIntrat","V58FecFinTto","V59CaractTto","V60MotFinTto","V61UbicTempUltEsq",
          "V62FecIniUltEsq","V63NumIPSUltEsq","V64CodIPSUltEsq1","V65CodIPSUltEsq2","V66NumMedUltEsq",
          "V66_1MedATC_Ult1","V66_2MedATC_Ult2","V66_3MedATC_Ult3","V66_4MedATC_Ult4","V66_5MedATC_Ult5",
          "V66_6MedATC_Ult6","V66_7MedATC_Ult7","V66_8MedATC_Ult8","V66_9MedATC_Ult9","V67MedAddUlt1",
          "V68MedAddUlt2","V69MedAddUlt3","V70RecibioQuimioIntratUlt","V71FecFinUltEsq","V72CaractUltEsq",
          "V73MotFinUltEsq"
        ], v6NumId);
        if (Object.keys(ttoqtObj).length > 1) {
          await this.ttoqtService.crearTtoqt(ttoqtObj);
          resumen.ttoqt++;
        }

        // 4. TTO Cirugía
        const ttocxObj = this.extraerCampos(row, [
          "V74RecibioCirugia","V75NumCirugias","V76FecPrimCir","V77CodIPSCir1","V78CodCUPSCir1","V79UbicTempCir1",
          "V80FecUltCir","V81MotUltCir","V82CodIPSCir2","V83CodCUPSCir2","V84UbicTempCir2","V85EstVitalPostCir"
        ], v6NumId);
        if (Object.keys(ttocxObj).length > 1) {
          await this.ttocxService.crearTtocx(ttocxObj);
          resumen.ttocx++;
        }

        // 5. TTO Radioterapia
        const ttortObj = this.extraerCampos(row, [
          "V86RecibioRadioterapia","V87NumSesionesRadio","V88FecIniEsq1Radio","V89UbicTempEsq1Radio",
          "V90TipoRadioEsq1","V91NumIPSRadioEsq1","V92CodIPSRadio1Esq1","V93CodIPSRadio2Esq1","V94FecFinEsq1Radio",
          "V95CaractEsq1Radio","V96MotFinEsq1Radio","V97FecIniUltEsqRadio","V98UbicTempUltEsqRadio","V99TipoRadioUltEsq",
          "V100NumIPSRadioUltEsq","V101CodIPSRadio1UltEsq","V102CodIPSRadio2UltEsq","V103FecFinUltEsqRadio",
          "V104CaractUltEsqRadio","V105MotFinUltEsqRadio"
        ], v6NumId);
        if (Object.keys(ttortObj).length > 1) {
          await this.ttortService.crearTtort(ttortObj);
          resumen.ttort++;
        }

        // 6. TTO Trasplante
        const ttotrasObj = this.extraerCampos(row, [
          "V106RecibioTrasplanteCM","V107TipoTrasplanteCM","V108UbicTempTrasplanteCM","V109FecTrasplanteCM","V110CodIPSTrasplanteCM"
        ], v6NumId);
        if (Object.keys(ttotrasObj).length > 1) {
          await this.ttotrasplanteService.crearTtotrasplante(ttotrasObj);
          resumen.ttotrasplante++;
        }

        // 7. TTO Cirugía Reconstructiva
        const ttocxrObj = this.extraerCampos(row, [
          "V111RecibioCirugiaReconst","V112FecCirugiaReconst","V113CodIPSCirugiaReconst"
        ], v6NumId);
        if (Object.keys(ttocxrObj).length > 1) {
          await this.ttocxreconstructivaService.crearTtocxreconstructiva(ttocxrObj);
          resumen.ttocxreconstructiva++;
        }

        // 8. TTO Paliativos
        const ttopalObj = this.extraerCampos(row, [
          "V114RecibioCuidadoPaliativo","V114_1CP_MedEspecialista","V114_2CP_ProfSaludNoMed","V114_3CP_MedOtraEspecialidad",
          "V114_4CP_MedGeneral","V114_5CP_TrabajoSocial","V114_6CP_OtroProfSalud","V115FecPrimConsCP","V116CodIPS_CP",
          "V117ValoradoPsiquiatria","V118FecPrimConsPsiq","V119CodIPS_Psiq","V120ValoradoNutricion","V121FecPrimConsNutr",
          "V122CodIPS_Nutr","V123TipoSoporteNutricional","V124TerapiasComplementarias"
        ], v6NumId);
        if (Object.keys(ttopalObj).length > 1) {
          await this.ttopaliativosService.crearTtopaliativos(ttopalObj);
          resumen.ttopaliativos++;
        }

        // 9. Archivos pacientes
        const archObj = this.extraerCampos(row, ["datos_excel","soportes_pdf"], v6NumId);
        if (Object.keys(archObj).length > 1) {
          await this.archivospacientesService.crearArchivoPaciente(archObj);
          resumen.archivospacientes++;
        }
      }

      const registro = new this.excelarchivoModel({
        nombreArchivo: file.originalname,
        fechaCargue: new Date(),
      });
      await registro.save();

      return { ok: true, mensaje: 'Cargue general procesado con éxito', resumen };
    } catch (error) {
      console.error('Error procesando cargue general:', error);
      return { ok: false, mensaje: 'Error procesando el archivo', error };
    }
  }

async consultaGeneral(V6NumId: string) {
  // Normalizar: probar como string y como número
  const numIdNumber = Number(V6NumId);
  const query = {
    $or: [
      { V6NumId: V6NumId },        // string exacto
      { V6NumId: numIdNumber },    // número exacto
      { V6NumID: V6NumId },        // por si en la colección está con mayúsculas
      { V6NumID: numIdNumber }
    ]
  };

  const paciente = await this.pacienteService.buscarPorPaciente(query);
  const diagnosticos = await this.diagnosticoService.buscarPorPaciente(query);
  const antecedentes = await this.antecedentesService.buscarPorPaciente(query);
  const archivos = await this.archivospacientesService.buscarPorPaciente(query);
  const ttocx = await this.ttocxService.buscarPorPaciente(query);
  const ttocxreconstructiva = await this.ttocxreconstructivaService.buscarPorPaciente(query);
  const ttopaliativos = await this.ttopaliativosService.buscarPorPaciente(query);
  const ttoqt = await this.ttoqtService.buscarPorPaciente(query);
  const ttort = await this.ttortService.buscarPorPaciente(query);
  const ttotrasplante = await this.ttotrasplanteService.buscarPorPaciente(query);

  return {
    ok: true,
    V6NumId,
    paciente,
    diagnosticos,
    antecedentes,
    archivos,
    ttocx,
    ttocxreconstructiva,
    ttopaliativos,
    ttoqt,
    ttort,
    ttotrasplante
  };
}

}
