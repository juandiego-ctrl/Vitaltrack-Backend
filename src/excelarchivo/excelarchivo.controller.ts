import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelarchivoService } from './excelarchivo.service';

@Controller('excelarchivo')
export class ExcelarchivoController {
  constructor(private readonly excelarchivoService: ExcelarchivoService) {}

  // 1. CARGUE MASIVO AUTOMÁTICO
  @Post('cargar-pacientes')
  @UseInterceptors(FileInterceptor('file'))
  async cargarPacientes(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Debe subir un archivo Excel');

    const resultado = await this.excelarchivoService.procesarArchivoExcelAutomatico(file);

    return {
       ok: true,
       mensaje: `Cargue exitoso. ${resultado.insertados} registros procesados`,
       cedulaTitular: resultado.cedulaDetectada,
       detalles: resultado,
     };
  }

  // 1b. CARGUE MASIVO MANUAL (para compatibilidad)
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
      mensaje: `Cargue exitoso. ${resultado.insertados} pacientes asociados a la cédula ${V6NumID}`,
      cedulaTitular: V6NumID,
      detalles: resultado,
    };
  }

  // 2. EXPEDIENTE COMPLETO
  @Get('expediente/:V6NumID')
  async obtenerExpedienteCompleto(@Param('V6NumID') V6NumID: string) {
    if (!V6NumID) throw new BadRequestException('Cédula requerida');
    return await this.excelarchivoService.obtenerExpedienteCompleto(V6NumID);
  }

  // 3. LISTA TODOS (admin)
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

  // 4. CONSULTA GENERAL (para frontend existente) ← NUEVA RUTA
  @Get('consulta-general')
  async consultaGeneral(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const pacientes = await this.excelarchivoService.consultaTodosLosPacientes(
      Number(page),
      Number(limit),
    );

    return {
      ok: true,
      mensaje: 'Consulta general exitosa',
      page,
      limit,
      total: pacientes.length,
      pacientes,
    };
  }

  // 5. CARGUE MASIVO DE USUARIOS
  @Post('cargar-usuarios')
  @UseInterceptors(FileInterceptor('file'))
  async cargarUsuarios(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Debe subir un archivo Excel');

    const resultado = await this.excelarchivoService.procesarArchivoExcelUsuarios(file);

    return {
      ok: true,
      mensaje: `Cargue de usuarios exitoso. ${resultado.totalProcesados} usuarios procesados`,
      detalles: resultado,
    };
  }
}