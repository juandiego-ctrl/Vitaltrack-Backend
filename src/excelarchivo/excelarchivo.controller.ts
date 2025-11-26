// excelarchivo.controller.ts → VERSIÓN FINAL OFICIAL (para tu sistema real)

import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Query,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelarchivoService } from './excelarchivo.service';

@Controller('excelarchivo')
export class ExcelarchivoController {
  constructor(private readonly excelarchivoService: ExcelarchivoService) {}

  // ================================================
  // 1. CARGUE MASIVO DE PACIENTES (TITULAR + ACOMPAÑANTES)
  // ================================================
  @Post('cargar-pacientes/:V6NumID')
  @UseInterceptors(FileInterceptor('file'))
  async cargarPacientesPorTitular(
    @Param('V6NumID') V6NumID: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Debe subir un archivo Excel');
    if (!V6NumID || V6NumID.trim() === '')
      throw new BadRequestException('Debe proporcionar la cédula del titular');

    const resultado = await this.excelarchivoService.procesarArchivoExcel(V6NumID, file);

    return {
      ok: true,
      mensaje: `Cargue exitoso. ${resultado.totalInsertados} pacientes asociados a la cédula ${V6NumID}`,
      cedulaTitular: V6NumID,
      detalles: resultado,
    };
  }

  // ================================================
  // 2. CONSULTA COMPLETA DEL EXPEDIENTE POR CÉDULA
  // ================================================
  @Get('expediente/:V6NumID')
  async obtenerExpedienteCompleto(@Param('V6NumID') V6NumID: string) {
    if (!V6NumID) throw new BadRequestException('Cédula requerida');

    const expediente = await this.excelarchivoService.obtenerExpedienteCompleto(V6NumID);

    return {
      ok: true,
      cedula: V6NumID,
      totalRegistros: Object.values(expediente).flat().length,
      expediente,
    };
  }

  // ================================================
  // 3. LISTA DE TODOS LOS PACIENTES (para admin)
  // ================================================
  @Get('todos')
  async listarTodos(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const pacientes = await this.excelarchivoService.consultaTodosLosPacientes(
      Number(page),
      Number(limit),
    );
    return {
      ok: true,
      page,
      limit,
      total: pacientes.length,
      pacientes,
    };
  }
}