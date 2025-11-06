import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as xlsx from 'xlsx';
import { ttoqtService } from './ttoqt.service';
import { ttoqtDto } from './ttoqt.dto';

@Controller('ttoqt')
export class ttoqtController {
  constructor(private readonly ttoqtService: ttoqtService) {}

  @Post()
  async crearTtoqt(@Body() ttoqtDto: ttoqtDto) {
    const respuesta = await this.ttoqtService.crearTtoqt(ttoqtDto);
    return { ok: true, respuesta };
  }

  @Get('/:id')
  async consultarTtoqt(@Param('id') id: string) {
    return await this.ttoqtService.buscarTtoqt(id);
  }

  @Get()
  async consultarTodos() {
    return await this.ttoqtService.buscarTodos();
  }

  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    const eliminar = await this.ttoqtService.eliminarTtoqt(id);
    return eliminar
      ? 'Registro de tratamiento de quimioterapia eliminado exitosamente'
      : 'El registro de tratamiento de quimioterapia no existe';
  }

  @Patch('/:id')
  async actualizar(@Param('id') id: string, @Body() ttoqtDto: ttoqtDto) {
    const ttoqtActualizado = await this.ttoqtService.actualizarTtoqt(id, ttoqtDto);
    return ttoqtActualizado
      ? { ok: true, ttoqtActualizado }
      : { ok: false, mensaje: 'El registro de tratamiento de quimioterapia no existe o no se pudo actualizar' };
  }

  // ✅ Endpoint para carga masiva desde Excel
 @Post('upload')
@UseInterceptors(FileInterceptor('file'))
async uploadExcel(@UploadedFile() file: Express.Multer.File) {
  const workbook = xlsx.read(file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const registros: ttoqtDto[] = data.map((item) => ({
    V6NumID: item['V6NumID'],
    V45RecibioQuimio: item['V45RecibioQuimio'],
    V46NumFasesQuimio: Number(item['V46NumFasesQuimio']),
    V47NumCiclosQuimio: Number(item['V47NumCiclosQuimio']),
    V48UbicTempTto: item['V48UbicTempTto'],
    V49FecIniEsq1: item['V49FecIniEsq1'] ? new Date(item['V49FecIniEsq1']) : new Date(),
    V50NumIPSQuimio: Number(item['V50NumIPSQuimio']),
    V51CodIPSQuimio1: item['V51CodIPSQuimio1'],
    V52CodIPSQuimio2: item['V52CodIPSQuimio2'],
    V53MedATC1: item['V53MedATC1'],
    V54MedATC2: item['V54MedATC2'],
    V55MedATC3: item['V55MedATC3'],
    V56MedATC4: item['V56MedATC4'],
    V57RecibioQuimioIntrat: item['V57RecibioQuimioIntrat'],
    V58FecFinTto: item['V58FecFinTto'] ? new Date(item['V58FecFinTto']) : new Date(),
    V59CaractTto: item['V59CaractTto'],
    V60MotFinTto: item['V60MotFinTto'],
    V61UbicTempUltEsq: item['V61UbicTempUltEsq'],
    V62FecIniUltEsq: item['V62FecIniUltEsq'] ? new Date(item['V62FecIniUltEsq']) : new Date(),
    V63NumIPSUltEsq: Number(item['V63NumIPSUltEsq']),
    V64CodIPSUltEsq1: item['V64CodIPSUltEsq1'],
    V65CodIPSUltEsq2: item['V65CodIPSUltEsq2'],
    V66NumMedUltEsq: Number(item['V66NumMedUltEsq']),
    V66_1MedATC_Ult1: item['V66_1MedATC_Ult1'],
    V66_2MedATC_Ult2: item['V66_2MedATC_Ult2'],
    V66_3MedATC_Ult3: item['V66_3MedATC_Ult3'],
    V66_4MedATC_Ult4: item['V66_4MedATC_Ult4'],
    V66_5MedATC_Ult5: item['V66_5MedATC_Ult5'],
    V66_6MedATC_Ult6: item['V66_6MedATC_Ult6'],
    V66_7MedATC_Ult7: item['V66_7MedATC_Ult7'],
    V66_8MedATC_Ult8: item['V66_8MedATC_Ult8'],
    V66_9MedATC_Ult9: item['V66_9MedATC_Ult9'],
    V67MedAddUlt1: item['V67MedAddUlt1'],
    V68MedAddUlt2: item['V68MedAddUlt2'],
    V69MedAddUlt3: item['V69MedAddUlt3'],
    V70RecibioQuimioIntratUlt: item['V70RecibioQuimioIntratUlt'],
    V71FecFinUltEsq: item['V71FecFinUltEsq'] ? new Date(item['V71FecFinUltEsq']) : new Date(),
    V72CaractUltEsq: item['V72CaractUltEsq'],
    V73MotFinUltEsq: item['V73MotFinUltEsq'],
  }));

  const resultados = await this.ttoqtService.guardarTtoqtExcel(registros);
  return { ok: true, resultados };
}
}