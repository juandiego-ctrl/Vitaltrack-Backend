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
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelarchivoService } from './excelarchivo.service';
import { excelarchivoDto } from './excelarchivo.dto';

@Controller('excelarchivo')
export class ExcelarchivoController {
  constructor(private readonly excelarchivoService: ExcelarchivoService) {}

  // 🧩 Crear registro manual
  @Post()
  async crearExcelArchivo(@Body() excelarchivoDto: excelarchivoDto) {
    const respuesta = await this.excelarchivoService.crearExcelArchivo(excelarchivoDto);
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

  // 📋 Consultar todos los registros
  @Get()
  async consultarTodos() {
    const data = await this.excelarchivoService.buscarTodos();
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
  async actualizar(@Param('id') id: string, @Body() excelarchivoDto: excelarchivoDto) {
    const actualizado = await this.excelarchivoService.actualizarExcelArchivo(id, excelarchivoDto);
    if (actualizado) {
      return { ok: true, actualizado };
    }
    return { ok: false, mensaje: 'El archivo de Excel no existe o no se pudo actualizar.' };
  }

  // 📦 Cargue General desde archivo Excel
  @Post('/cargue-general/:V6NumId')
  @UseInterceptors(FileInterceptor('file'))
  async cargueGeneral(
    @Param('V6NumId') V6NumId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!V6NumId) throw new BadRequestException('El parámetro V6NumId es obligatorio.');
    if (!file) throw new BadRequestException('Debe adjuntar un archivo Excel.');

    const resultado = await this.excelarchivoService.procesarCargueGeneral(file);
    return resultado;
  }

  // 🔎 Consulta General por número de documento
  @Get('/consulta-general/:V6NumId')
  async consultaGeneral(@Param('V6NumId') V6NumId: string) {
    if (!V6NumId) throw new BadRequestException('Debe proporcionar un número de documento.');

    const resultado = await this.excelarchivoService.consultaGeneral(V6NumId);
    return resultado;
  }
}
