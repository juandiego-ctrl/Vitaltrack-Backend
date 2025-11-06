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

import { diagnosticoService } from './diagnostico.service';
import { diagnosticoDto } from './diagnostico.dto';

@Controller('diagnostico')
export class diagnosticoController {
  constructor(private readonly diagnosticoService: diagnosticoService) {}

  @Post()
  async crearDiagnostico(@Body() diagnosticoDto: diagnosticoDto) {
    const respuesta = await this.diagnosticoService.crearDiagnostico(diagnosticoDto);
    return { ok: true, respuesta };
  }

  @Get('/:id')
  async consultarDiagnostico(@Param('id') id: string) {
    return await this.diagnosticoService.buscarDiagnostico(id);
  }

  @Get()
  async consultarTodos() {
    return await this.diagnosticoService.buscarTodos();
  }

  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    const eliminar = await this.diagnosticoService.eliminarDiagnostico(id);
    if (eliminar != null) {
      return 'Diagnóstico eliminado exitosamente';
    }
    return 'El diagnóstico no existe';
  }

  @Patch('/:id')
  async actualizar(
    @Param('id') id: string,
    @Body() diagnosticoDto: diagnosticoDto,
  ) {
    const diagnosticoActualizado = await this.diagnosticoService.actualizarDiagnostico(
      id,
      diagnosticoDto,
    );
    if (diagnosticoActualizado) {
      return { ok: true, diagnosticoActualizado };
    }
    return { ok: false, mensaje: 'El diagnóstico no existe o no se pudo actualizar' };
  }

  // ✅ NUEVO: Endpoint para carga desde Excel
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const diagnosticos: diagnosticoDto[] = data.map((item) => ({
      V6NumID: item['V6NumID'],
      id: item['id'],
      V17CodCIE10: item['V17CodCIE10'],
      V18FecDiag: item['V18FecDiag'] ? new Date(item['V18FecDiag']) : null,
      V19FecRemision: item['V19FecRemision'] ? new Date(item['V19FecRemision']) : null,
      V20FecIngInst: item['V20FecIngInst'] ? new Date(item['V20FecIngInst']) : null,
      V21TipoEstDiag: item['V21TipoEstDiag'],
      V22MotNoHistop: item['V22MotNoHistop'],
      V23FecRecMuestra: item['V23FecRecMuestra'] ? new Date(item['V23FecRecMuestra']) : null,
      V24FecInfHistop: item['V24FecInfHistop'] ? new Date(item['V24FecInfHistop']) : null,
      V25CodHabIPS: item['V25CodHabIPS'],
      V26Fec1raCons: item['V26Fec1raCons'] ? new Date(item['V26Fec1raCons']) : null,
      V27HistTumor: item['V27HistTumor'],
      V28GradoDifTum: item['V28GradoDifTum'],
      V29EstadifTum: item['V29EstadifTum'],
      V30FecEstadif: item['V30FecEstadif'] ? new Date(item['V30FecEstadif']) : null,
      V31PruebaHER2: item['V31PruebaHER2'],
      V32FecPruebaHER2: item['V32FecPruebaHER2'] ? new Date(item['V32FecPruebaHER2']) : null,
      V33ResHER2: item['V33ResHER2'],
      V34EstadifDukes: item['V34EstadifDukes'],
      V35FecEstDukes: item['V35FecEstDukes'] ? new Date(item['V35FecEstDukes']) : null,
      V36EstadifLinfMielo: item['V36EstadifLinfMielo'],
      V37ClasGleason: item['V37ClasGleason'],
      V38ClasRiesgoLL: item['V38ClasRiesgoLL'],
      V39FecClasRiesgo: item['V39FecClasRiesgo'] ? new Date(item['V39FecClasRiesgo']) : null,
      V40ObjTtoInicial: item['V40ObjTtoInicial'],
      V41IntervMed: item['V41IntervMed'],
      agrupador: item['agrupador'],
      observaciones: item['observaciones'],
    }));

    return this.diagnosticoService.guardarDiagnosticosExcel(diagnosticos);
  }
}
