import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Module({
  providers: [MailerService],
  exports: [MailerService], // <- MUY IMPORTANTE para usarlo desde medicamentos.service
})
export class MailerModule {}
