import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelarchivoService } from './excelarchivo.service';
import { excelarchivoDto } from './excelarchivo.dto';

@Controller('excelarchivo')
export class excelarchivoController {
  constructor(private readonly excelarchivoService: ExcelarchivoService) {}

  @Post()
  async crearExcelArchivo(@Body() excelarchivoDto: excelarchivoDto) {
    const respuesta = await this.excelarchivoService.crearExcelArchivo(excelarchivoDto);
    return { ok: true, respuesta };
  }

  @Get('/:id')
  async consultarExcelArchivo(@Param('id') id: string) {
    return await this.excelarchivoService.buscarExcelArchivo(id);
  }

  @Get()
  async consultarTodos() {
    return await this.excelarchivoService.buscarTodos();
  }

  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    const eliminar = await this.excelarchivoService.eliminarExcelArchivo(id);
    if (eliminar != null) {
      return 'Archivo de Excel eliminado exitosamente';
    }
    return 'El archivo de Excel no existe';
  }

  @Patch('/:id')
  async actualizar(@Param('id') id: string, @Body() excelarchivoDto: excelarchivoDto) {
    const excelArchivoActualizado = await this.excelarchivoService.actualizarExcelArchivo(id, excelarchivoDto);
    if (excelArchivoActualizado) {
      return { ok: true, excelArchivoActualizado };
    }
    return { ok: false, mensaje: 'El archivo de Excel no existe o no se pudo actualizar' };
  }

  // 📌 Nuevo endpoint para Cargue General con V6NumId
  @Post('/cargue-general/:V6NumId')
  @UseInterceptors(FileInterceptor('file'))
  async cargueGeneral(
    @Param('V6NumId') V6NumId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!V6NumId) {
      return { ok: false, mensaje: 'El parámetro V6NumId es obligatorio' };
    }
    return await this.excelarchivoService.procesarCargueGeneral(file);
  }

  @Get('/consulta-general/:V6NumId')
  async consultaGeneral(@Param('V6NumId') V6NumId: string) {
    return await this.excelarchivoService.consultaGeneral(V6NumId);
  }

}
