import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExcelarchivoController } from './excelarchivo.controller';
import { ExcelarchivoService } from './excelarchivo.service';
import { ExcelarchivoSchema } from './excelarchivo.modelo';

import { PacienteModule } from '../paciente/paciente.module';
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
    MongooseModule.forFeature([{ name: 'Excelarchivo', schema: ExcelarchivoSchema }]), // ✅ Cambiar a 'Excelarchivo'
    PacienteModule,
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
  controllers: [ExcelarchivoController],
  providers: [ExcelarchivoService],
})
export class ExcelarchivoModule {}