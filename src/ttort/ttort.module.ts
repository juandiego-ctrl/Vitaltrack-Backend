import { Module } from '@nestjs/common';
import { TtortController } from './ttort.controller';
import { TtortService } from './ttort.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ttortSchema } from './ttort.modelo';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ttort', schema: ttortSchema }]),
  ],
  controllers: [TtortController],
  providers: [TtortService],
  exports: [TtortService], // Exportar el servicio para que otros módulos puedan usarlo
})
export class ttortModule {}
