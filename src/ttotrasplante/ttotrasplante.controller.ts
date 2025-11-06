import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ttotrasplanteService } from './ttotrasplante.service';
import { ttotrasplanteDto } from './ttotrasplante.dto';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';


@Controller('ttotrasplante')
export class ttotrasplanteController {
  constructor(private readonly ttotrasplanteService: ttotrasplanteService) {}

  @Post()
  async crearTtotrasplante(@Body() ttotrasplanteDto: ttotrasplanteDto) {
    const respuesta = await this.ttotrasplanteService.crearTtotrasplante(ttotrasplanteDto);
    return { ok: true, respuesta };
  }

  @Get("/:id")
  async consultarTtotrasplante(@Param("id") id: string) {
    return await this.ttotrasplanteService.buscarTtotrasplante(id);
  }

  @Get()
  async consultarTodos() {
    return await this.ttotrasplanteService.buscarTodos();
  }

  @Delete("/:id")
  async eliminar(@Param("id") id: string) {
    const eliminar = await this.ttotrasplanteService.eliminarTtotrasplante(id);
    if (eliminar != null) {
      return "Registro de trasplante eliminado exitosamente";
    }
    return "El registro de trasplante no existe";
  }

  @Patch("/:id")
  async actualizar(@Param("id") id: string, @Body() ttotrasplanteDto: ttotrasplanteDto) {
    const ttotrasplanteActualizado = await this.ttotrasplanteService.actualizarTtotrasplante(id, ttotrasplanteDto);
    if (ttotrasplanteActualizado) {
      return { ok: true, ttotrasplanteActualizado };
    }
    return { ok: false, mensaje: "El registro de trasplante no existe o no se pudo actualizar" };
  }
  @Post('/upload')
@UseInterceptors(FileInterceptor('file'))
async importarExcel(@UploadedFile() file: Express.Multer.File) {
  const workbook = XLSX.read(file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const data: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const registros: ttotrasplanteDto[] = data.map((item) => ({
    V6NumID: item['V6NumID'],
    V106RecibioTrasplanteCM: item.V106RecibioTrasplanteCM,
    V107TipoTrasplanteCM: item.V107TipoTrasplanteCM,
    V108UbicTempTrasplanteCM: item.V108UbicTempTrasplanteCM,
    V109FecTrasplanteCM: item.V109FecTrasplanteCM ? new Date(item.V109FecTrasplanteCM) : null,
    V110CodIPSTrasplanteCM: item.V110CodIPSTrasplanteCM,
  }));

  return await this.ttotrasplanteService.guardarDesdeExcel(registros);
}

}
