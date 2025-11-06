import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ttortService } from './ttort.service';
import { ttortDto } from './ttort.dto';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as xlsx from 'xlsx';


@Controller('ttort')
export class ttortController {
  constructor(private readonly ttortService: ttortService) {}

  @Post()
  async crearTtort(@Body() ttortDto: ttortDto) {
    const respuesta = await this.ttortService.crearTtort(ttortDto);
    return { ok: true, respuesta };
  }

  @Get("/:id")
  async consultarTtort(@Param("id") id: string) {
    return await this.ttortService.buscarTtort(id);
  }

  @Get()
  async consultarTodos() {
    return await this.ttortService.buscarTodos();
  }

  @Delete("/:id")
  async eliminar(@Param("id") id: string) {
    const eliminar = await this.ttortService.eliminarTtort(id);
    if (eliminar != null) {
      return "Registro de tratamiento de radioterapia eliminado exitosamente";
    }
    return "El registro de tratamiento de radioterapia no existe";
  }

  @Patch("/:id")
  async actualizar(@Param("id") id: string, @Body() ttortDto: ttortDto) {
    const ttortActualizado = await this.ttortService.actualizarTtort(id, ttortDto);
    if (ttortActualizado) {
      return { ok: true, ttortActualizado };
    }
    return { ok: false, mensaje: "El registro de tratamiento de radioterapia no existe o no se pudo actualizar" };
  }
  @Post('upload')
@UseInterceptors(FileInterceptor('file'))
async uploadExcel(@UploadedFile() file: Express.Multer.File) {
  const workbook = xlsx.read(file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const registros = data.map((item) => ({
    V6NumID: item['V6NumID'],
    V86RecibioRadioterapia: item['V86RecibioRadioterapia'],
    V87NumSesionesRadio: Number(item['V87NumSesionesRadio']),
    V88FecIniEsq1Radio: item['V88FecIniEsq1Radio'] ? new Date(item['V88FecIniEsq1Radio']) : new Date(),
    V89UbicTempEsq1Radio: item['V89UbicTempEsq1Radio'],
    V90TipoRadioEsq1: item['V90TipoRadioEsq1'],
    V91NumIPSRadioEsq1: Number(item['V91NumIPSRadioEsq1']),
    V92CodIPSRadio1Esq1: item['V92CodIPSRadio1Esq1'],
    V93CodIPSRadio2Esq1: item['V93CodIPSRadio2Esq1'],
    V94FecFinEsq1Radio: item['V94FecFinEsq1Radio'] ? new Date(item['V94FecFinEsq1Radio']) : new Date(),
    V95CaractEsq1Radio: item['V95CaractEsq1Radio'],
    V96MotFinEsq1Radio: item['V96MotFinEsq1Radio'],
    V97FecIniUltEsqRadio: item['V97FecIniUltEsqRadio'] ? new Date(item['V97FecIniUltEsqRadio']) : new Date(),
    V98UbicTempUltEsqRadio: item['V98UbicTempUltEsqRadio'],
    V99TipoRadioUltEsq: item['V99TipoRadioUltEsq'],
    V100NumIPSRadioUltEsq: Number(item['V100NumIPSRadioUltEsq']),
    V101CodIPSRadio1UltEsq: item['V101CodIPSRadio1UltEsq'],
    V102CodIPSRadio2UltEsq: item['V102CodIPSRadio2UltEsq'],
    V103FecFinUltEsqRadio: item['V103FecFinUltEsqRadio'] ? new Date(item['V103FecFinUltEsqRadio']) : new Date(),
    V104CaractUltEsqRadio: item['V104CaractUltEsqRadio'],
    V105MotFinUltEsqRadio: item['V105MotFinUltEsqRadio'],
  }));

  return await this.ttortService.guardarTtortExcel(registros);
}

}
