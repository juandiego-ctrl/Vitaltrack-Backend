import { Module } from '@nestjs/common';
import { ArchivospacientesController } from './archivospacientes.controller';
import { ArchivospacientesService } from './archivospacientes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { archivospacientesSchema } from './archivospacientes.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'archivospacientes', schema: archivospacientesSchema }]),
  ],
  controllers: [ArchivospacientesController],
  providers: [ArchivospacientesService],
  exports: [ArchivospacientesService], 
})
export class ArchivospacientesModule {}
