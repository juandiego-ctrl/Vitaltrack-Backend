// src/citas/citas.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { Cita, CitaSchema } from './schemas/cita.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cita.name, schema: CitaSchema }])],
  controllers: [CitasController],
  providers: [CitasService],
})
export class CitasModule {}
