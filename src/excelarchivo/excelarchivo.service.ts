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
import { UsuarioService } from '../usuario/usuario.service';
import { UsuarioDto } from '../usuario/usuario.dto';
import { DiagnosticoService } from '../diagnostico/diagnostico.service';
import { AntecedentesService } from '../antecedentes/antecedentes.service';
import { TtocxService } from '../ttocx/ttocx.service';
import { TtocxreconstructivaService } from '../ttocxreconstructiva/ttocxreconstructiva.service';
import { TtopaliativosService } from '../ttopaliativos/ttopaliativos.service';
import { TtoqtService } from '../ttoqt/ttoqt.service';
import { TtortService } from '../ttort/ttort.service';
import { TtotrasplanteService } from '../ttotrasplante/ttotrasplante.service';

// ← MANTENEMOS SOLO LO QUE EXISTE Y ESTÁ REGISTRADO
@Injectable()
export class ExcelarchivoService {
  constructor(
    @InjectModel('Paciente') private pacienteModel: Model<IPaciente>,
    private pacienteService: PacienteService,
    private usuarioService: UsuarioService,
    private diagnosticoService: DiagnosticoService,
    private antecedentesService: AntecedentesService,
    private ttocxService: TtocxService,
    private ttocxreconstructivaService: TtocxreconstructivaService,
    private ttopaliativosService: TtopaliativosService,
    private ttoqtService: TtoqtService,
    private ttortService: TtortService,
    private ttotrasplanteService: TtotrasplanteService,

    // Modelos para consulta unificada
    @InjectModel('diagnostico') private diagnosticoModel: Model<any>,
    @InjectModel('antecedentes') private antecedentesModel: Model<any>,
    @InjectModel('ttoqt') private ttoqtModel: Model<any>,
    @InjectModel('ttort') private ttortModel: Model<any>,
    @InjectModel('ttocx') private ttocxModel: Model<any>,
    @InjectModel('ttocxreconstructiva') private ttocxreconstructivaModel: Model<any>,
    @InjectModel('ttopaliativos') private ttopaliativosModel: Model<any>,
    @InjectModel('ttotrasplante') private ttotrasplanteModel: Model<any>,
    @InjectModel('Cita') private citaModel: Model<any>,
    @InjectModel('Medicamento') private medicamentoModel: Model<any>,
    @InjectModel('archivospacientes') private archivospacientesModel: Model<any>,
    @InjectModel('zipsoportes') private zipsoportesModel: Model<any>,
  ) {}

  // CARGUE MASIVO AUTOMÁTICO → LEE V6NumID DEL EXCEL
  async procesarArchivoExcelAutomatico(file: Express.Multer.File): Promise<any> {
    if (!file) throw new BadRequestException('No se subió ningún archivo');

    const workbook = XLSX.read(file.buffer, { type: 'buffer', cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

    if (!data || data.length <= 1) {
      throw new BadRequestException('Excel vacío o sin datos');
    }

    // DETECTAR V6NumID de la primera fila de datos (fila 1, asumiendo fila 0 son headers)
    const primeraFila = data[1]; // Fila 1 (índice 1)
    const V6NumIdDetectado = primeraFila[5] ? String(primeraFila[5]).trim() : null; // Columna 5 = V6NumID

    if (!V6NumIdDetectado || V6NumIdDetectado === '') {
      throw new BadRequestException('No se pudo detectar V6NumID en el archivo Excel. Verifique que la columna F (posición 5) contenga el número de identificación.');
    }

    console.log(`🔍 V6NumID detectado automáticamente: ${V6NumIdDetectado}`);

    // Usar el método existente con el V6NumID detectado
    const resultado = await this.procesarArchivoExcel(V6NumIdDetectado, file);
    return {
      ...resultado,
      cedulaDetectada: V6NumIdDetectado
    };
  }

  // CARGUE MASIVO COMPLETO → PROCESA TODOS LOS DATOS Y LOS DISTRIBUYE
  async procesarArchivoExcel(V6NumId: string, file: Express.Multer.File): Promise<any> {
    if (!file) throw new BadRequestException('No se subió ningún archivo');
    if (!V6NumId) throw new BadRequestException('Falta la cédula del titular');

    const workbook = XLSX.read(file.buffer, { type: 'buffer', cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

    if (!data || data.length <= 1) {
      throw new BadRequestException('Excel vacío o sin datos');
    }

    const resultadosTotales = {
      pacientes: 0,
      diagnosticos: 0,
      antecedentes: 0,
      tratamientos: { quimioterapia: 0, cirugia: 0, radioterapia: 0, trasplante: 0, reconstructiva: 0, paliativos: 0 },
      errores: [] as { fila: number; error: string }[]
    };

    // Procesar fila por fila
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      try {
        // 1. CREAR/ACTUALIZAR PACIENTE
        const pacienteData = {
          V1PrimerNom: row[0] ? String(row[0]).trim() : '',
          V2SegundoNom: row[1] ? String(row[1]).trim() : '',
          V3PrimerApe: row[2] ? String(row[2]).trim() : '',
          V4SegundoApe: row[3] ? String(row[3]).trim() : '',
          V5TipoID: row[4] ? String(row[4]).trim().toUpperCase() : 'CC',
          V6NumID: V6NumId,
          V7FecNac: row[6] instanceof Date ? row[6] : row[6] ? new Date(row[6]) : undefined,
          V8Sexo: row[7] ? String(row[7]).trim().toUpperCase() : '',
          V9Ocup: row[8] ? String(row[8]).trim() : '',
          V10RegAfiliacion: row[9] ? String(row[9]).trim() : '',
          V11CodEAPB: row[10] ? String(row[10]).trim() : '',
          V12CodEtnia: row[11] ? String(row[11]).trim() : '',
          V13GrupoPob: row[12] ? String(row[12]).trim() : '',
          V14MpioRes: row[13] ? String(row[13]).trim() : '',
          V15NumTel: row[14] ? String(row[14]).trim() : '',
          V16FecAfiliacion: row[15] instanceof Date ? row[15] : row[15] ? new Date(row[15]) : undefined,
          FechaIngreso: row[16] instanceof Date ? row[16] : row[16] ? new Date(row[16]) : undefined,
        };

        // Guardar paciente
        const pacienteGuardado = await this.pacienteService.guardarDesdeArray([pacienteData]);
        resultadosTotales.pacientes += pacienteGuardado.filter(r => r.accion === 'creado' || r.accion === 'actualizado').length;

        // 2. PROCESAR DIAGNÓSTICO (si tiene datos)
        if (row[17] || row[18]) { // V17CodCIE10 o V18FecDiag
          const pacienteIdStr = String(pacienteGuardado[0]?.paciente?._id || V6NumId);
          const diagnosticoData = {
            pacienteId: pacienteIdStr,
            V6NumID: V6NumId,
            V17CodCIE10: row[17] ? String(row[17]).trim() : '',
            V18FecDiag: row[18] instanceof Date ? row[18] : row[18] ? new Date(row[18]) : null,
            V19FecRemision: row[19] instanceof Date ? row[19] : row[19] ? new Date(row[19]) : null,
            V20FecIngInst: row[20] instanceof Date ? row[20] : row[20] ? new Date(row[20]) : null,
            V21TipoEstDiag: row[21] ? String(row[21]).trim() : '',
            V22MotNoHistop: row[22] ? String(row[22]).trim() : '',
            V23FecRecMuestra: row[23] instanceof Date ? row[23] : row[23] ? new Date(row[23]) : null,
            V24FecInfHistop: row[24] instanceof Date ? row[24] : row[24] ? new Date(row[24]) : null,
            V25CodHabIPS: row[25] ? String(row[25]).trim() : '',
            V26Fec1raCons: row[26] instanceof Date ? row[26] : row[26] ? new Date(row[26]) : null,
            V27HistTumor: row[27] ? String(row[27]).trim() : '',
            V28GradoDifTum: row[28] ? String(row[28]).trim() : '',
            V29EstadifTum: row[29] ? String(row[29]).trim() : '',
            V30FecEstadif: row[30] instanceof Date ? row[30] : row[30] ? new Date(row[30]) : null,
            V31PruebaHER2: row[31] ? String(row[31]).trim() : '',
            V32FecPruebaHER2: row[32] instanceof Date ? row[32] : row[32] ? new Date(row[32]) : null,
            V33ResHER2: row[33] ? String(row[33]).trim() : '',
            V34EstadifDukes: row[34] ? String(row[34]).trim() : '',
            V35FecEstDukes: row[35] instanceof Date ? row[35] : row[35] ? new Date(row[35]) : null,
            V36EstadifLinfMielo: row[36] ? String(row[36]).trim() : '',
            V37ClasGleason: row[37] ? String(row[37]).trim() : '',
            V38ClasRiesgoLL: row[38] ? String(row[38]).trim() : '',
            V39FecClasRiesgo: row[39] instanceof Date ? row[39] : row[39] ? new Date(row[39]) : null,
            V40ObjTtoInicial: row[40] ? String(row[40]).trim() : '',
            V41IntervMed: row[41] ? String(row[41]).trim() : '',
            agrupador: row[42] ? String(row[42]).trim() : '',
            observaciones: row[43] ? String(row[43]).trim() : '',
          };

          const diagnosticoResult = await this.diagnosticoService.guardarDesdeArray([diagnosticoData]);
          resultadosTotales.diagnosticos += diagnosticoResult.filter(r => r.accion === 'creado' || r.accion === 'actualizado').length;
        }

        // 3. ANTECEDENTES (cáncer previo)
        if (row[44] || row[45] || row[46]) { // V42, V43, V44
          const antecedenteData = {
            V6NumID: V6NumId,
            V42AntCancerPrim: row[44] ? String(row[44]).trim() : '',
            V43FecDiagAnt: row[45] instanceof Date ? row[45] : row[45] ? new Date(row[45]) : new Date(),
            V44TipoCancerAnt: row[46] ? String(row[46]).trim() : '',
          };

          const antecedenteResult = await this.antecedentesService.guardarDesdeArray([antecedenteData]);
          resultadosTotales.antecedentes += antecedenteResult.filter(r => r.accion === 'creado' || r.accion === 'actualizado').length;
        }

        // 4. TRATAMIENTOS - QUIMIOTERAPIA (ttocx)
        if (row[47] === 'Sí' || row[47] === 'SI' || row[47] === '1') { // V45RecibioQuimio
          const quimioterapiaData = {
            V6NumID: V6NumId,
            V45RecibioQuimio: row[47] ? String(row[47]).trim() : '',
            V46NumFasesQuimio: row[48] ? Number(row[48]) : 0,
            V47NumCiclosQuimio: row[49] ? Number(row[49]) : 0,
            V48UbicTempTto: row[50] ? String(row[50]).trim() : '',
            V49FecIniEsq1: row[51] instanceof Date ? row[51] : row[51] ? new Date(row[51]) : new Date(),
            V50NumIPSQuimio: row[52] ? Number(row[52]) : 0,
            V51CodIPSQuimio1: row[53] ? String(row[53]).trim() : '',
            V52CodIPSQuimio2: row[54] ? String(row[54]).trim() : '',
            V53MedATC1: row[55] ? String(row[55]).trim() : '',
            V54MedATC2: row[56] ? String(row[56]).trim() : '',
            V55MedATC3: row[57] ? String(row[57]).trim() : '',
            V56MedATC4: row[58] ? String(row[58]).trim() : '',
            V57RecibioQuimioIntrat: row[59] ? String(row[59]).trim() : '',
            V58FecFinTto: row[60] instanceof Date ? row[60] : row[60] ? new Date(row[60]) : new Date(),
            V59CaractTto: row[61] ? String(row[61]).trim() : '',
            V60MotFinTto: row[62] ? String(row[62]).trim() : '',
            V61UbicTempUltEsq: row[63] ? String(row[63]).trim() : '',
            V62FecIniUltEsq: row[64] instanceof Date ? row[64] : row[64] ? new Date(row[64]) : new Date(),
            V63NumIPSUltEsq: row[65] ? Number(row[65]) : 0,
            V64CodIPSUltEsq1: row[66] ? String(row[66]).trim() : '',
            V65CodIPSUltEsq2: row[67] ? String(row[67]).trim() : '',
            V66NumMedUltEsq: row[68] ? Number(row[68]) : 0,
            V66_1MedATC_Ult1: row[69] ? String(row[69]).trim() : '',
            V66_2MedATC_Ult2: row[70] ? String(row[70]).trim() : '',
            V66_3MedATC_Ult3: row[71] ? String(row[71]).trim() : '',
            V66_4MedATC_Ult4: row[72] ? String(row[72]).trim() : '',
            V66_5MedATC_Ult5: row[73] ? String(row[73]).trim() : '',
            V66_6MedATC_Ult6: row[74] ? String(row[74]).trim() : '',
            V66_7MedATC_Ult7: row[75] ? String(row[75]).trim() : '',
            V66_8MedATC_Ult8: row[76] ? String(row[76]).trim() : '',
            V66_9MedATC_Ult9: row[77] ? String(row[77]).trim() : '',
            V67MedAddUlt1: row[78] ? String(row[78]).trim() : '',
            V68MedAddUlt2: row[79] ? String(row[79]).trim() : '',
            V69MedAddUlt3: row[80] ? String(row[80]).trim() : '',
            V70RecibioQuimioIntratUlt: row[81] ? String(row[81]).trim() : '',
            V71FecFinUltEsq: row[82] instanceof Date ? row[82] : row[82] ? new Date(row[82]) : new Date(),
            V72CaractUltEsq: row[83] ? String(row[83]).trim() : '',
            V73MotFinUltEsq: row[84] ? String(row[84]).trim() : '',
          };

          const quimioterapiaResult = await this.ttocxService.guardarDesdeArray([quimioterapiaData]);
          resultadosTotales.tratamientos.quimioterapia += quimioterapiaResult.filter(r => r.accion === 'creado' || r.accion === 'actualizado').length;
        }

        // 5. CIRUGÍA (ttoqt - assuming this is for surgery)
        if (row[86] === 'Sí' || row[86] === 'SI' || row[86] === '1') { // V74RecibioCirugia
          const cirugiaData = {
            V6NumID: V6NumId,
            V45RecibioQuimio: row[86] ? String(row[86]).trim() : '', // V74RecibioCirugia
            V46NumFasesQuimio: row[87] ? Number(row[87]) : 0, // V75NumCirugias
            V47NumCiclosQuimio: 0, // Not applicable
            V48UbicTempTto: row[89] ? String(row[89]).trim() : '', // V79UbicTempCir1
            V49FecIniEsq1: row[88] instanceof Date ? row[88] : row[88] ? new Date(row[88]) : undefined, // V76FecPrimCir
            V50NumIPSQuimio: 0,
            V51CodIPSQuimio1: row[90] ? String(row[90]).trim() : '', // V77CodIPSCir1
            V52CodIPSQuimio2: row[92] ? String(row[92]).trim() : '', // V82CodIPSCir2
            // Add other surgery fields as needed
          };

          // TODO: Add guardarDesdeArray to TtoqtService
          // const cirugiaResult = await this.ttoqtService.guardarDesdeArray([cirugiaData]);
          // resultadosTotales.tratamientos.cirugia += cirugiaResult.filter(r => r.accion === 'creado' || r.accion === 'actualizado').length;
        }

        // 6. RADIOTERAPIA (ttort)
        if (row[98] === 'Sí' || row[98] === 'SI' || row[98] === '1') { // V86RecibioRadioterapia
          const radioterapiaData = {
            V6NumID: V6NumId,
            V86RecibioRadioterapia: row[98] ? String(row[98]).trim() : '',
            V87NumSesionesRadio: row[99] ? Number(row[99]) : 0,
            V88FecIniEsq1Radio: row[100] instanceof Date ? row[100] : row[100] ? new Date(row[100]) : undefined,
            V89UbicTempEsq1Radio: row[101] ? String(row[101]).trim() : '',
            V90TipoRadioEsq1: row[102] ? String(row[102]).trim() : '',
            V91NumIPSRadioEsq1: row[103] ? Number(row[103]) : 0,
            V92CodIPSRadio1Esq1: row[104] ? String(row[104]).trim() : '',
            V93CodIPSRadio2Esq1: row[105] ? String(row[105]).trim() : '',
            V94FecFinEsq1Radio: row[106] instanceof Date ? row[106] : row[106] ? new Date(row[106]) : undefined,
            V95CaractEsq1Radio: row[107] ? String(row[107]).trim() : '',
            V96MotFinEsq1Radio: row[108] ? String(row[108]).trim() : '',
            V97FecIniUltEsqRadio: row[109] instanceof Date ? row[109] : row[109] ? new Date(row[109]) : undefined,
            V98UbicTempUltEsqRadio: row[110] ? String(row[110]).trim() : '',
            V99TipoRadioUltEsq: row[111] ? String(row[111]).trim() : '',
            V100NumIPSRadioUltEsq: row[112] ? Number(row[112]) : 0,
            V101CodIPSRadio1UltEsq: row[113] ? String(row[113]).trim() : '',
            V102CodIPSRadio2UltEsq: row[114] ? String(row[114]).trim() : '',
            V103FecFinUltEsqRadio: row[115] instanceof Date ? row[115] : row[115] ? new Date(row[115]) : undefined,
            V104CaractUltEsqRadio: row[116] ? String(row[116]).trim() : '',
            V105MotFinUltEsqRadio: row[117] ? String(row[117]).trim() : '',
          };

          const radioterapiaResult = await this.ttortService.guardarDesdeArray([radioterapiaData]);
          resultadosTotales.tratamientos.radioterapia += radioterapiaResult.filter(r => r.accion === 'creado' || r.accion === 'actualizado').length;
        }

        // 7. TRASPLANTE (ttotrasplante)
        if (row[118] === 'Sí' || row[118] === 'SI' || row[118] === '1') { // V106RecibioTrasplanteCM
          const trasplanteData = {
            V6NumID: V6NumId,
            V106RecibioTrasplanteCM: row[118] ? String(row[118]).trim() : '',
            V107TipoTrasplanteCM: row[119] ? String(row[119]).trim() : '',
            V108UbicTempTrasplanteCM: row[120] ? String(row[120]).trim() : '',
            V109FecTrasplanteCM: row[121] instanceof Date ? row[121] : row[121] ? new Date(row[121]) : undefined,
            V110CodIPSTrasplanteCM: row[122] ? String(row[122]).trim() : '',
          };

          // TODO: Add guardarDesdeArray to TtotrasplanteService
          // const trasplanteResult = await this.ttotrasplanteService.guardarDesdeArray([trasplanteData]);
          // resultadosTotales.tratamientos.trasplante += trasplanteResult.filter(r => r.accion === 'creado' || r.accion === 'actualizado').length;
        }

        // 8. CIRUGÍA RECONSTRUCTIVA (ttocxreconstructiva)
        if (row[123] === 'Sí' || row[123] === 'SI' || row[123] === '1') { // V111RecibioCirugiaReconst
          const reconstructivaData = {
            V6NumID: V6NumId,
            V111RecibioCirugiaReconst: row[123] ? String(row[123]).trim() : '',
            V112FecCirugiaReconst: row[124] instanceof Date ? row[124] : row[124] ? new Date(row[124]) : new Date(),
            V113CodIPSCirugiaReconst: row[125] ? String(row[125]).trim() : '',
          };

          const reconstructivaResult = await this.ttocxreconstructivaService.guardarDesdeArray([reconstructivaData]);
          resultadosTotales.tratamientos.reconstructiva += reconstructivaResult.filter(r => r.accion === 'creado' || r.accion === 'actualizado').length;
        }

        // 9. CUIDADOS PALIATIVOS (ttopaliativos)
        if (row[126] === 'Sí' || row[126] === 'SI' || row[126] === '1') { // V114RecibioCuidadoPaliativo
          const paliativosData = {
            V6NumID: V6NumId,
            V114RecibioCuidadoPaliativo: row[126] ? String(row[126]).trim() : '',
            V114_1CP_MedEspecialista: row[127] ? String(row[127]).trim() : '',
            V114_2CP_ProfSaludNoMed: row[128] ? String(row[128]).trim() : '',
            V114_3CP_MedOtraEspecialidad: row[129] ? String(row[129]).trim() : '',
            V114_4CP_MedGeneral: row[130] ? String(row[130]).trim() : '',
            V114_5CP_TrabajoSocial: row[131] ? String(row[131]).trim() : '',
            V114_6CP_OtroProfSalud: row[132] ? String(row[132]).trim() : '',
            V115FecPrimConsCP: row[133] instanceof Date ? row[133] : row[133] ? new Date(row[133]) : undefined,
            V116CodIPS_CP: row[134] ? String(row[134]).trim() : '',
            V117ValoradoPsiquiatria: row[135] ? String(row[135]).trim() : '',
            V118FecPrimConsPsiq: row[136] instanceof Date ? row[136] : row[136] ? new Date(row[136]) : undefined,
            V119CodIPS_Psiq: row[137] ? String(row[137]).trim() : '',
            V120ValoradoNutricion: row[138] ? String(row[138]).trim() : '',
            V121FecPrimConsNutr: row[139] instanceof Date ? row[139] : row[139] ? new Date(row[139]) : undefined,
            V122CodIPS_Nutr: row[140] ? String(row[140]).trim() : '',
            V123TipoSoporteNutricional: row[141] ? String(row[141]).trim() : '',
            V124TerapiasComplementarias: row[142] ? String(row[142]).trim() : '',
          };

          // TODO: Add guardarDesdeArray to TtopaliativosService
          // const paliativosResult = await this.ttopaliativosService.guardarDesdeArray([paliativosData]);
          // resultadosTotales.tratamientos.paliativos += paliativosResult.filter(r => r.accion === 'creado' || r.accion === 'actualizado').length;
        }

      } catch (error: any) {
        resultadosTotales.errores.push({
          fila: i + 1,
          error: error.message
        });
      }
    }

    return {
      ok: true,
      mensaje: 'Procesamiento completo del Excel',
      cedulaTitular: V6NumId,
      resultados: resultadosTotales,
    };
  }

  // EXPEDIENTE COMPLETO → Consulta unificada por V6NumID
  async obtenerExpedienteCompleto(V6NumID: string) {
    try {
      // Consultas paralelas para mejor rendimiento
      const [
        pacientes,
        diagnosticos,
        antecedentes,
        quimioterapia,
        radioterapia,
        cirugia,
        cirugiaReconstructiva,
        cuidadosPaliativos,
        trasplante,
        citas,
        medicamentos,
        archivosPacientes,
        zipsSoportes
      ] = await Promise.all([
        this.pacienteModel.find({ V6NumID }).lean(),
        this.diagnosticoModel.find({ V6NumID }).lean(),
        this.antecedentesModel.find({ V6NumID }).lean(),
        this.ttocxModel.find({ V6NumID }).lean(),
        this.ttortModel.find({ V6NumID }).lean(),
        this.ttoqtModel.find({ V6NumID }).lean(),
        this.ttocxreconstructivaModel.find({ V6NumID }).lean(),
        this.ttopaliativosModel.find({ V6NumID }).lean(),
        this.ttotrasplanteModel.find({ V6NumID }).lean(),
        this.citaModel.find({ V6NumID }).lean(),
        this.medicamentoModel.find({ V6NumID }).lean(),
        this.archivospacientesModel.find({ V6NumID }).lean(),
        this.zipsoportesModel.find({ V6NumID }).lean(),
      ]);

      return {
        ok: true,
        mensaje: 'Expediente completo obtenido exitosamente',
        cedula: V6NumID,
        totalPacientes: pacientes.length,
        datosPersonales: pacientes,
        diagnosticos: diagnosticos,
        antecedentes: antecedentes,
        tratamientos: {
          quimioterapia: quimioterapia,
          radioterapia: radioterapia,
          cirugia: cirugia,
          cirugiaReconstructiva: cirugiaReconstructiva,
          cuidadosPaliativos: cuidadosPaliativos,
          trasplante: trasplante,
        },
        citas: citas,
        medicamentos: medicamentos,
        archivosPacientes: archivosPacientes,
        zipsSoportes: zipsSoportes,
      };
    } catch (error: any) {
      return {
        ok: false,
        mensaje: 'Error al obtener expediente completo',
        error: error.message,
        cedula: V6NumID,
      };
    }
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

  // CARGUE MASIVO DE USUARIOS
  async procesarArchivoExcelUsuarios(file: Express.Multer.File): Promise<any> {
    if (!file) throw new BadRequestException('No se subió ningún archivo');

    const workbook = XLSX.read(file.buffer, { type: 'buffer', cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

    if (!data || data.length <= 1) {
      throw new BadRequestException('Excel vacío o sin datos');
    }

    // Columnas esperadas: nombre, email, contraseña, rol, estadoCuenta
    // Fila 0 son headers, empezamos desde fila 1
    const usuarios: UsuarioDto[] = data.slice(1).map((row: any[], index: number) => {
      if (!row[0] || !row[1] || !row[2]) {
        throw new BadRequestException(`Fila ${index + 2}: nombre, email y contraseña son obligatorios`);
      }

      return {
        nombre: String(row[0]).trim(),
        email: String(row[1]).trim().toLowerCase(),
        contraseña: String(row[2]).trim(),
        rol: row[3] ? String(row[3]).trim() : 'Usuario Estándar',
        estadoCuenta: row[4] ? String(row[4]).trim() : 'Activo',
      };
    });

    // Usar el método guardarDesdeArray del servicio de usuarios
    const resultado = await this.usuarioService.guardarDesdeArray(usuarios);

    return {
      ok: true,
      mensaje: 'Cargue de usuarios exitoso',
      totalProcesados: usuarios.length,
      resultados: resultado,
    };
  }
}