import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PacienteModule } from './paciente/paciente.module';
import { diagnosticoModule } from './diagnostico/diagnostico.module';
import { AntecedentesModule } from './antecedentes/antecedentes.module';
import { ttoqtModule } from './ttoqt/ttoqt.module';
import { ttocxModule } from './ttocx/ttocx.module';
import { ttortModule } from './ttort/ttort.module';
import { ttotrasplanteModule } from './ttotrasplante/ttotrasplante.module';
import { ttocxreconstructivaModule } from './ttocxreconstructiva/ttocxreconstructiva.module';
import { ttopaliativosModule } from './ttopaliativos/ttopaliativos.module';
import { ExcelarchivoModule } from './excelarchivo/excelarchivo.module';
import { zipsoportesModule } from './zipsoportes/zipsoportes.module';
import { ArchivospacientesModule } from './archivospacientes/archivospacientes.module';
import { UsuarioModule } from './usuario/usuario.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AdministrativoModule } from './administrativo/administrativo.module';
import { CitasModule } from './citas/citas.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://Admin:Cac2025@cluster0.3sdxh.mongodb.net/vitaltrack'),
    PacienteModule, diagnosticoModule, AntecedentesModule, ttoqtModule, ttocxModule, 
    ttortModule, ttotrasplanteModule, ttocxreconstructivaModule, ttopaliativosModule
    , ExcelarchivoModule, zipsoportesModule, ArchivospacientesModule, 
    UsuarioModule,AuthModule, AdministrativoModule,CitasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

