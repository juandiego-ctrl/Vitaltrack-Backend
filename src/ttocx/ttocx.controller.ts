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

import { ttocxService } from './ttocx.service';
import { ttocxDto } from './ttocx.dto';

@Controller('ttocx')
export class ttocxController {
  constructor(private readonly ttocxService: ttocxService) {}

  @Post()
  async crearTtocx(@Body() ttocxDto: ttocxDto) {
    const respuesta = await this.ttocxService.crearTtocx(ttocxDto);
    return { ok: true, respuesta };
  }

  @Get('/:id')
  async consultarTtocx(@Param('id') id: string) {
    return await this.ttocxService.buscarTtocx(id);
  }

  @Get()
  async consultarTodos() {
    return await this.ttocxService.buscarTodos();
  }

  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    const eliminar = await this.ttocxService.eliminarTtocx(id);
    if (eliminar != null) {
      return 'Registro de tratamiento quirúrgico eliminado exitosamente';
    }
    return 'El registro de tratamiento quirúrgico no existe';
  }

  @Patch('/:id')
  async actualizar(@Param('id') id: string, @Body() ttocxDto: ttocxDto) {
    const ttocxActualizado = await this.ttocxService.actualizarTtocx(id, ttocxDto);
    if (ttocxActualizado) {
      return { ok: true, ttocxActualizado };
    }
    return {
      ok: false,
      mensaje: 'El registro de tratamiento quirúrgico no existe o no se pudo actualizar',
    };
  }

  // ✅ Solo UNA vez este endpoint
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const registros: ttocxDto[] = data.map((item) => ({
      V6NumID: item['V6NumID'],
      V74RecibioCirugia: item['V74RecibioCirugia'],
      V75NumCirugias: Number(item['V75NumCirugias']),
      V76FecPrimCir: item['V76FecPrimCir'] ? new Date(item['V76FecPrimCir']) : new Date(),
      V77CodIPSCir1: item['V77CodIPSCir1'],
      V78CodCUPSCir1: item['V78CodCUPSCir1'],
      V79UbicTempCir1: item['V79UbicTempCir1'],
      V80FecUltCir: item['V80FecUltCir'] ? new Date(item['V80FecUltCir']) : new Date(),
      V81MotUltCir: item['V81MotUltCir'],
      V82CodIPSCir2: item['V82CodIPSCir2'],
      V83CodCUPSCir2: item['V83CodCUPSCir2'],
      V84UbicTempCir2: item['V84UbicTempCir2'],
      V85EstVitalPostCir: item['V85EstVitalPostCir'],
    }));

    return this.ttocxService.guardarTtocxExcel(registros);
  }
}
