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

import { ttocxreconstructivaService } from './ttocxreconstructiva.service';
import { ttocxreconstructivaDto } from './ttocxreconstructiva.dto';

@Controller('ttocxreconstructiva')
export class ttocxreconstructivaController {
  constructor(private readonly ttocxreconstructivaService: ttocxreconstructivaService) {}

  @Post()
  async crearTtocxreconstructiva(@Body() dto: ttocxreconstructivaDto) {
    return await this.ttocxreconstructivaService.crearTtocxreconstructiva(dto);
  }

  @Get()
  async consultarTodos() {
    return await this.ttocxreconstructivaService.buscarTodos();
  }

  @Get('/:id')
  async consultarTtocxreconstructiva(@Param('id') id: string) {
    return await this.ttocxreconstructivaService.buscarTtocxreconstructiva(id);
  }

  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    return await this.ttocxreconstructivaService.eliminarTtocxreconstructiva(id);
  }

  @Patch('/:id')
  async actualizar(@Param('id') id: string, @Body() dto: ttocxreconstructivaDto) {
    return await this.ttocxreconstructivaService.actualizarTtocxreconstructiva(id, dto);
  }

  // 🔽 Asegúrate de tener este método completo:
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const registros: ttocxreconstructivaDto[] = data.map((item) => ({
      V6NumID: item['V6NumID'],
      V111RecibioCirugiaReconst: item['V111RecibioCirugiaReconst'],
      V112FecCirugiaReconst: item['V112FecCirugiaReconst']
        ? new Date(item['V112FecCirugiaReconst'])
        : new Date(),
      V113CodIPSCirugiaReconst: item['V113CodIPSCirugiaReconst'],
    }));

    return this.ttocxreconstructivaService.guardarTtocxreconstructivaExcel(registros);
  }
}
