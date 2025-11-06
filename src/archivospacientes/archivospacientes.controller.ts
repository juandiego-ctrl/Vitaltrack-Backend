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

import { ArchivospacientesService } from './archivospacientes.service';
import { ArchivospacientesDto } from './archivospacientes.dto';

@Controller('archivospacientes')
export class ArchivospacientesController {
  constructor(
    private readonly archivospacientesService: ArchivospacientesService,
  ) {}

  @Post()
  async crearArchivoPaciente(@Body() archivospacientesDto: ArchivospacientesDto) {
    const respuesta = await this.archivospacientesService.crearArchivoPaciente(
      archivospacientesDto,
    );
    return { ok: true, respuesta };
  }

  @Get('/:id')
  async consultarArchivoPaciente(@Param('id') id: string) {
    return await this.archivospacientesService.buscarArchivoPaciente(id);
  }

  @Get()
  async consultarTodos() {
    return await this.archivospacientesService.buscarTodos();
  }

  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    const eliminar = await this.archivospacientesService.eliminarArchivoPaciente(
      id,
    );
    if (eliminar != null) {
      return 'Archivo de paciente eliminado exitosamente';
    }
    return 'El archivo de paciente no existe';
  }

  @Patch('/:id')
  async actualizar(
    @Param('id') id: string,
    @Body() archivospacientesDto: ArchivospacientesDto,
  ) {
    const archivoPacienteActualizado =
      await this.archivospacientesService.actualizarArchivoPaciente(
        id,
        archivospacientesDto,
      );
    if (archivoPacienteActualizado) {
      return { ok: true, archivoPacienteActualizado };
    }
    return {
      ok: false,
      mensaje: 'El archivo de paciente no existe o no se pudo actualizar',
    };
  }

  // ✅ Endpoint para cargar Excel
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const archivos: ArchivospacientesDto[] = data.map((item) => ({
      V6NumID: item['V6NumID'],
      id: item['id'],
      datos_excel: item['datos_excel']
        ? JSON.parse(item['datos_excel'])
        : {},
      soportes_pdf: item['soportes_pdf']?.split(',') || [],
    }));

    return this.archivospacientesService.guardarArchivosExcel(archivos);
  }
}
