import { Module } from '@nestjs/common';
import { TtoqtController } from './ttoqt.controller';
import { TtoqtService } from './ttoqt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ttoqtSchema } from './ttoqt.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ttoqt', schema: ttoqtSchema }]),
  ],
  controllers: [TtoqtController],
  providers: [TtoqtService],
  exports: [TtoqtService], // Exportar el servicio para que otros módulos puedan usarlo
})
export class ttoqtModule {}
