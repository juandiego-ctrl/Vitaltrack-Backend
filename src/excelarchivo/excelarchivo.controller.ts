import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  BadRequestException,
  Query, // CORRECCIÓN: Importado para manejar query params en paginación
  UploadedFile, // CORRECCIÓN: Para manejar archivos subidos
  UseInterceptors, // CORRECCIÓN: Para interceptores de archivos
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // CORRECCIÓN: Importado para Multer
import { ExcelarchivoService } from './excelarchivo.service';
import { excelarchivoDto } from './excelarchivo.dto';
import { InternalServerErrorException } from '@nestjs/common';

@Controller('excelarchivo')
export class ExcelarchivoController {
  constructor(private readonly excelarchivoService: ExcelarchivoService) {}

  // 🔎 Consulta solo los datos del paciente por número de documento
  @Get('/consulta-paciente/:V6NumId')
  async consultaPaciente(@Param('V6NumId') V6NumId: string) {
    if (!V6NumId)
      throw new BadRequestException('Debe proporcionar un número de documento.');

    const resultado = await this.excelarchivoService.consultaPacientePorCedula(V6NumId);
    return resultado;
  }

  // 📋 Consulta general de todos los pacientes (con paginación opcional)
  @Get('/consulta-general')
  async consultaTodosLosPacientes(
    @Query('page') page: number = 1, // CORRECCIÓN: Agregado paginación (por defecto página 1)
    @Query('limit') limit: number = 10, // CORRECCIÓN: Límite por página (por defecto 10)
  ) {
    try {
      const pacientes = await this.excelarchivoService.consultaTodosLosPacientes(page, limit);
      return { ok: true, pacientes };
    } catch (error) {
      console.error('Error en consulta-general:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  // CORRECCIÓN: Nuevo endpoint para carga de archivo Excel
  @Post('cargue-general/:V6NumId')
  @UseInterceptors(FileInterceptor('file')) // CORRECCIÓN: Maneja el archivo subido como 'file'
  async cargueArchivo(
    @Param('V6NumId') V6NumId: string,
    @UploadedFile() file: Express.Multer.File, // CORRECCIÓN: Tipo para el archivo
  ) {
    if (!file) {
      throw new BadRequestException('Debe proporcionar un archivo Excel.');
    }
    const resultado = await this.excelarchivoService.procesarArchivoExcel(V6NumId, file);
    return { ok: true, mensaje: 'Archivo procesado correctamente', resultado };
  }

  // 🧩 Crear registro manual
  @Post()
  async crearExcelArchivo(@Body() dto: excelarchivoDto) {
    const respuesta = await this.excelarchivoService.crearExcelArchivo(dto);
    return { ok: true, respuesta };
  }

  // 🔍 Consultar un registro por ID
  @Get('/:id')
  async consultarExcelArchivo(@Param('id') id: string) {
    const data = await this.excelarchivoService.buscarExcelArchivo(id);
    if (!data) {
      return { ok: false, mensaje: 'No se encontró el archivo solicitado.' };
    }
    return { ok: true, data };
  }

  // 🗑️ Eliminar por ID
  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    const eliminado = await this.excelarchivoService.eliminarExcelArchivo(id);
    if (eliminado) {
      return { ok: true, mensaje: 'Archivo de Excel eliminado exitosamente.' };
    }
    return { ok: false, mensaje: 'El archivo de Excel no existe.' };
  }

  // ✏️ Actualizar por ID
  @Patch('/:id')
  async actualizar(@Param('id') id: string, @Body() dto: excelarchivoDto) {
    const actualizado = await this.excelarchivoService.actualizarExcelArchivo(id, dto);
    if (actualizado) {
      return { ok: true, actualizado };
    }
    return { ok: false, mensaje: 'El archivo de Excel no existe o no se pudo actualizar.' };
  }
}