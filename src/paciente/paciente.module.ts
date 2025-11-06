import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PacienteController } from './paciente.controller';
import { PacienteService } from './paciente.service';
import { PacienteSchema } from './paciente.modelo';

// Importar todos los módulos que exportan servicios que usa PacienteService
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
    MongooseModule.forFeature([{ name: 'Paciente', schema: PacienteSchema }]),
    diagnosticoModule,             // 🔹 IMPORTANTE
    AntecedentesModule,            // 🔹
    ArchivospacientesModule,       // 🔹
    ttocxModule,                    // 🔹
    ttocxreconstructivaModule,      // 🔹
    ttopaliativosModule,            // 🔹
    ttoqtModule,                    // 🔹
    ttortModule,                    // 🔹
    ttotrasplanteModule,            // 🔹
  ],
  controllers: [PacienteController],
  providers: [PacienteService],
  exports: [PacienteService], // Exportar el servicio para que otros módulos puedan usarlo
})
export class PacienteModule {}
