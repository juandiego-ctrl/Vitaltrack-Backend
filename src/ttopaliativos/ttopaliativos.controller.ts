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

import { ttopaliativosService } from './ttopaliativos.service';
import { ttopaliativosDto } from './ttopaliativos.dto';

@Controller('ttopaliativos')
export class ttopaliativosController {
  constructor(private readonly ttopaliativosService: ttopaliativosService) {}

  // ... métodos existentes

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcel(@UploadedFile() file: Express.Multer.File) {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const registros: ttopaliativosDto[] = data.map((item) => ({
      V6NumID: item['V6NumID'],
      V114RecibioCuidadoPaliativo: item['V114RecibioCuidadoPaliativo'],
      V114_1CP_MedEspecialista: item['V114_1CP_MedEspecialista'],
      V114_2CP_ProfSaludNoMed: item['V114_2CP_ProfSaludNoMed'],
      V114_3CP_MedOtraEspecialidad: item['V114_3CP_MedOtraEspecialidad'],
      V114_4CP_MedGeneral: item['V114_4CP_MedGeneral'],
      V114_5CP_TrabajoSocial: item['V114_5CP_TrabajoSocial'],
      V114_6CP_OtroProfSalud: item['V114_6CP_OtroProfSalud'],
      V115FecPrimConsCP: item['V115FecPrimConsCP'] ? new Date(item['V115FecPrimConsCP']) : null,
      V116CodIPS_CP: item['V116CodIPS_CP'],
      V117ValoradoPsiquiatria: item['V117ValoradoPsiquiatria'],
      V118FecPrimConsPsiq: item['V118FecPrimConsPsiq'] ? new Date(item['V118FecPrimConsPsiq']) : null,
      V119CodIPS_Psiq: item['V119CodIPS_Psiq'],
      V120ValoradoNutricion: item['V120ValoradoNutricion'],
      V121FecPrimConsNutr: item['V121FecPrimConsNutr'] ? new Date(item['V121FecPrimConsNutr']) : null,
      V122CodIPS_Nutr: item['V122CodIPS_Nutr'],
      V123TipoSoporteNutricional: item['V123TipoSoporteNutricional'],
      V124TerapiasComplementarias: item['V124TerapiasComplementarias'],
    }));

    return this.ttopaliativosService.guardarTtopaliativosExcel(registros);
  }
}
