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
import { PacienteService } from './paciente.service';
import { pacienteDto } from './paciente.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as xlsx from 'xlsx';
import { CreateManualDto } from './crear-manual.dto';

@Controller('paciente')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Post()
  async crearPaciente(@Body() pacienteDto: pacienteDto) {
    const respuesta = await this.pacienteService.CrearPaciente(pacienteDto);
    return { ok: true, respuesta };
  }

  @Get('/:cedula')
  async ConsultarPaciente(@Param('cedula') cedula: string) {
    return await this.pacienteService.BuscarCedula(cedula);
  }

  @Get()
  async ConsultarTodos() {
    return await this.pacienteService.BuscarTodo();
  }

  @Delete('/:cedula')
  async Eliminar(@Param('cedula') cedula: string) {
    const eliminar = await this.pacienteService.EliminarPaciente(cedula);
    if (eliminar != null) {
      return 'exitoso';
    }
    return 'El Paciente no existe';
  }

  @Patch('/:cedula')
  async Actualizar(
    @Param('cedula') cedula: string,
    @Body() pacienteDto: pacienteDto,
  ) {
    const pacienteActualizado = await this.pacienteService.ActualizarPaciente(
      cedula,
      pacienteDto,
    );
    if (pacienteActualizado) {
      return { ok: true, pacienteActualizado };
    }
    return { ok: false, mensaje: 'El paciente no existe o no se pudo actualizar' };
  }

  // 🚀 Nuevo endpoint para subir archivo Excel
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

const pacientes = data.map((item) => ({
  id: undefined, // ✅ Esto evita el error de que 'id' falta
  V1PrimerNom: item['V1PrimerNom'],
  V2SegundoNom: item['V2SegundoNom'],
  V3PrimerApe: item['V3PrimerApe'],
  V4SegundoApe: item['V4SegundoApe'],
  V5TipoID: item['V5TipoID'],
  V6NumID: item['V6NumID'],
  V7FecNac: new Date(item['V7FecNac']),
  V8Sexo: item['V8Sexo'],
  V9Ocup: item['V9Ocup'],
  V10RegAfiliacion: item['V10RegAfiliacion'],
  V11CodEAPB: item['V11CodEAPB'],
  V12CodEtnia: item['V12CodEtnia'],
  V13GrupoPob: item['V13GrupoPob'],
  V14MpioRes: item['V14MpioRes'],
  V15NumTel: item['V15NumTel'],
  V16FecAfiliacion: new Date(item['V16FecAfiliacion']),
  FechaIngreso: new Date(), // o item['FechaIngreso'] si viene del Excel
}));


    return this.pacienteService.guardarPacientes(pacientes);
  }
  @Get('/historial/:cedula')
    async obtenerHistorial(@Param('cedula') cedula: string) {
      return await this.pacienteService.obtenerHistorialCompleto(cedula);
    }

  @Post('manual')
  async crearManual(@Body() data: CreateManualDto) {
  return await this.pacienteService.crearPacienteManual(data);
}

}
