import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExcelarchivoController } from './excelarchivo.controller';
import { ExcelarchivoService } from './excelarchivo.service';
import { ExcelarchivoSchema } from './excelarchivo.modelo';

// Importar módulos
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
import { UsuarioModule } from '../usuario/usuario.module';
import { CitasModule } from '../citas/citas.module';
import { MedicamentosModule } from '../medicamentos/medicamentos.module';

// Importar esquemas para inyección directa
import { diagnosticoSchema } from '../diagnostico/diagnostico.modelo';
import { AntecedentesSchema } from '../antecedentes/antecedentes.modelo';
import { ttocxSchema } from '../ttocx/ttocx.modelo';
import { ttortSchema } from '../ttort/ttort.modelo';
import { ttoqtSchema } from '../ttoqt/ttoqt.modelo';
import { ttocxreconstructivaSchema } from '../ttocxreconstructiva/ttocxreconstructiva.modelo';
import { ttopaliativosSchema } from '../ttopaliativos/ttopaliativos.modelo';
import { ttotrasplanteSchema } from '../ttotrasplante/ttotrasplante.modelo';
import { CitaSchema } from '../citas/schemas/cita.schema';
import { MedicamentoSchema } from '../medicamentos/schema/medicamento.schema';
import { archivospacientesSchema } from '../archivospacientes/archivospacientes.modelo';
import { ZipSoportesSchema } from '../zipsoportes/zipsoportes.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Excelarchivo', schema: ExcelarchivoSchema },
      // Modelos para consulta unificada
      { name: 'diagnostico', schema: diagnosticoSchema },
      { name: 'antecedentes', schema: AntecedentesSchema },
      { name: 'ttoqt', schema: ttoqtSchema },
      { name: 'ttort', schema: ttortSchema },
      { name: 'ttocx', schema: ttocxSchema },
      { name: 'ttocxreconstructiva', schema: ttocxreconstructivaSchema },
      { name: 'ttopaliativos', schema: ttopaliativosSchema },
      { name: 'ttotrasplante', schema: ttotrasplanteSchema },
      { name: 'Cita', schema: CitaSchema },
      { name: 'Medicamento', schema: MedicamentoSchema },
      { name: 'archivospacientes', schema: archivospacientesSchema },
      { name: 'zipsoportes', schema: ZipSoportesSchema },
    ]),
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
    UsuarioModule,
    CitasModule,
    MedicamentosModule,
  ],
  controllers: [ExcelarchivoController],
  providers: [ExcelarchivoService],
})
export class ExcelarchivoModule {}