import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { excelarchivoController } from './excelarchivo.controller';
import { ExcelarchivoService } from './excelarchivo.service';
import { excelarchivoSchema } from './excelarchivo.modelo';

import { PacienteModule } from '../paciente/paciente.module'; // ✅ Importar
import { diagnosticoModule } from '../diagnostico/diagnostico.module';
import { AntecedentesModule } from '../antecedentes/antecedentes.module';
import { ArchivospacientesModule } from '../archivospacientes/archivospacientes.module';
import { ttocxModule } from '../ttocx/ttocx.module';
import { ttocxreconstructivaModule } from '../ttocxreconstructiva/ttocxreconstructiva.module';
import { ttopaliativosModule } from '../ttopaliativos/ttopaliativos.module';
import { ttoqtModule } from '../ttoqt/ttoqt.module';
import { ttortModule } from '../ttort/ttort.module';
import { ttotrasplanteModule } from '../ttotrasplante/ttotrasplante.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'excelarchivo', schema: excelarchivoSchema }]),
    PacienteModule, // ✅ Esto resuelve el error
    diagnosticoModule,
    AntecedentesModule,
    ArchivospacientesModule,
    ttocxModule,
    ttocxreconstructivaModule,
    ttopaliativosModule,
    ttoqtModule,
    ttortModule,
    ttotrasplanteModule,
  ],
  controllers: [excelarchivoController],
  providers: [ExcelarchivoService],
})
export class ExcelarchivoModule {}
