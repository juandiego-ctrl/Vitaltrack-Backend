import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AntecedentesController } from './antecedentes.controller';
import { AntecedentesService } from './antecedentes.service';
import { AntecedentesSchema } from './antecedentes.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Antecedentes', schema: AntecedentesSchema }]),
  ],
  controllers: [AntecedentesController],
  providers: [AntecedentesService],
  exports: [AntecedentesService], // 👈 Esto lo hace accesible a otros módulos
})
export class AntecedentesModule {}
