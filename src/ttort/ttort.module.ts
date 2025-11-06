import { Module } from '@nestjs/common';
import { ttortController } from './ttort.controller';
import { ttortService } from './ttort.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ttortSchema } from './ttort.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ttort', schema: ttortSchema }]),
  ],
  controllers: [ttortController],
  providers: [ttortService],
  exports: [ttortService], // Exportar el servicio para que otros módulos puedan usarlo
})
export class ttortModule {}
