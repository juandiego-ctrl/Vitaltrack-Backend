// src/medicamentos/mailer/mailer.module.ts
import { Global, Module } from '@nestjs/common';  // ← Agrega "Global" aquí
import { MailerService } from './mailer.service';

@Global()   // ← ESTA LÍNEA ES LA QUE RESUELVE TODO
@Module({
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}