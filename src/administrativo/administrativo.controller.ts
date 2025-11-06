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

import { AdministrativoService } from './administrativo.service';
import { administrativoDto } from './administrativo.dto';

@Controller('administrativo')
export class administrativoController {
  constructor(private readonly administrativoService: AdministrativoService) {}

  @Post()
  async crearAdministrativo(@Body() administrativoDto: administrativoDto) {
    const respuesta = await this.administrativoService.crearAdministrativo(administrativoDto);
    return { ok: true, respuesta };
  }

  @Get('/:id')
  async consultarAdministrativo(@Param('id') id: string) {
    return await this.administrativoService.buscarAdministrativo(id);
  }

  @Get()
  async consultarTodos() {
    return await this.administrativoService.buscarTodos();
  }

  @Delete('/:id')
  async eliminar(@Param('id') id: string) {
    const eliminar = await this.administrativoService.eliminarAdministrativo(id);
    if (eliminar != null) {
      return 'Registro administrativo eliminado exitosamente';
    }
    return 'El registro administrativo no existe';
  }

  @Patch('/:id')
  async actualizar(@Param('id') id: string, @Body() administrativoDto: administrativoDto) {
    const administrativoActualizado = await this.administrativoService.actualizarAdministrativo(id, administrativoDto);
    if (administrativoActualizado) {
      return { ok: true, administrativoActualizado };
    }
    return { ok: false, mensaje: 'El registro administrativo no existe o no se pudo actualizar' };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

   const administrativos = data.map((item) => ({
  V6NumID: item['V6NumID'],
  V125TipoTtoCorte: item['V125TipoTtoCorte'],
  V126ResFinalManejoOnc: item['V126ResFinalManejoOnc'],
  V127EstadoVital: item['V127EstadoVital'],
  V128NovedadAdm: item['V128NovedadAdm'],
  V129NovedadClin: item['V129NovedadClin'],
  V130FecDesafiliacion: item['V130FecDesafiliacion'] ? new Date(item['V130FecDesafiliacion']) : undefined,
  V131FecMuerte: item['V131FecMuerte'] ? new Date(item['V131FecMuerte']) : undefined,
  V132CausaMuerte: item['V132CausaMuerte'],
  V133CodUnicoID: item['V133CodUnicoID'],
  V134FecCorte: item['V134FecCorte'] ? new Date(item['V134FecCorte']) : undefined,
}));


    return this.administrativoService.guardarAdministrativos(administrativos);
  }
}
