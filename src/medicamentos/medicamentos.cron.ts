// medicamentos/medicamentos.cron.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MedicamentosService } from './medicamentos.service';
import { MailerService } from './mailer/mailer.service'; 

@Injectable()
export class MedicamentosCron {
  constructor(
    private service: MedicamentosService,
    private mailer: MailerService,
  ) {}

  // Corre todos los días a las 8:00 AM
  @Cron('0 8 * * *')
  async enviarRecordatorios() {
    const lista = await this.service.obtenerActivos();

    const hoy = new Date().toISOString().split("T")[0];

    for (const med of lista) {
      if (med.fechaInicio <= hoy && med.fechaFin >= hoy) {
        await this.mailer.enviarCorreo({
          to: med.correo,
          subject: `Recordatorio de medicamento: ${med.medicamento}`,
          text: `
Hola ${med.paciente},
Recuerda tomar tu medicamento: ${med.medicamento}
Frecuencia: ${med.frecuencia}
Fecha: ${hoy}
`,
        });
      }
    }
  }
}
