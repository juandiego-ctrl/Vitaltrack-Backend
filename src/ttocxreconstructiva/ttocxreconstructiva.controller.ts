// ttocxreconstructiva.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TtocxreconstructivaService } from './ttocxreconstructiva.service';
import { ttocxreconstructivaDto } from './ttocxreconstructiva.dto';

@Controller('ttocxreconstructiva')
export class TtocxreconstructivaController {
  constructor(private readonly ttocxreconstructivaService: TtocxreconstructivaService) {}

  @Post()
  async crear(@Body() dto: ttocxreconstructivaDto) {
    return await this.ttocxreconstructivaService.crearTtocxreconstructiva(dto);
  }

  @Get()
  async consultarTodos() {
    return await this.ttocxreconstructivaService.buscarTodos();
  }

  @Get('/:id')
  async consultarPorId(@Param('id') id: string) {
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
}
