// src/medicamentos/medicamentos.cron.ts

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MedicamentosService } from './medicamentos.service';
import { MailerService } from './mailer/mailer.service';

// Ajusta esta interfaz según tu modelo real de Medicamento
interface MedicamentoActivo {
  _id: any;
  paciente: string;
  correo: string;
  medicamento: string;
  dosis?: string;        // opcional si no siempre existe
  frecuencia: string;
  fechaInicio: string | Date;
  fechaFin: string | Date;
}

@Injectable()
export class MedicamentosCron {
  private readonly logger = new Logger(MedicamentosCron.name);

  constructor(
    private readonly service: MedicamentosService,
    private readonly mailer: MailerService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async enviarRecordatorios() {
    this.logger.log('Iniciando envío de recordatorios diarios de medicamentos...');

    try {
      const lista: MedicamentoActivo[] = await this.service.obtenerActivos();
      const hoyISO = new Date().toISOString().split('T')[0];

      const hoyBonito = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).replace(/^\w/, (c) => c.toUpperCase());

      let enviados = 0;

      for (const med of lista) {
        // Normalizamos las fechas a string en formato YYYY-MM-DD
        const inicio = this.toISODateString(med.fechaInicio);
        const fin = this.toISODateString(med.fechaFin);

        if (inicio <= hoyISO && fin >= hoyISO) {
          await this.mailer.enviarCorreo({
            to: med.correo,
            subject: `Recordatorio: ${med.medicamento} – ${hoyBonito}`,
            html: this.generarHTMLRecordatorio({
              paciente: med.paciente,
              medicamento: med.medicamento,
              dosis: med.dosis,
              frecuencia: med.frecuencia,
              fecha: hoyBonito,
            }),
          });

          enviados++;
          this.logger.log(`Recordatorio enviado a ${med.paciente} (${med.correo})`);
        }
      }

      this.logger.log(`Proceso completado → ${enviados} recordatorio(s) enviado(s)`);
    } catch (error) {
      this.logger.error('Error en el cron de recordatorios', error);
    }
  }

  // Función auxiliar segura para convertir cualquier fecha a YYYY-MM-DD
  private toISODateString(date: string | Date | any): string {
    if (!date) return '0000-00-00';
    if (typeof date === 'string') return date.split('T')[0];
    if (date instanceof Date) return date.toISOString().split('T')[0];
    return String(date).split('T')[0];
  }

  private generarHTMLRecordatorio(datos: {
    paciente: string;
    medicamento: string;
    dosis?: string;
    frecuencia: string;
    fecha: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recordatorio de Medicamento</title>
      </head>
      <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif">
        <div style="max-width:600px;margin:30px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)">
          <div style="background:linear-gradient(135deg,#3498db,#2980b9);padding:30px;text-align:center;color:white">
            <h1 style="margin:0;font-size:28px">Recordatorio de Medicamento</h1>
            <p style="margin:10px 0 0;font-size:16px;opacity:0.9">VitalTrack cuida de ti</p>
          </div>

          <div style="padding:30px">
            <h2 style="color:#2c3e50;margin-top:0">¡Hola ${datos.paciente}!</h2>
            
            <div style="background:#e8f4fc;padding:25px;border-radius:10px;border-left:6px solid #3498db;margin:25px 0">
              <p style="margin:0 0 12px;font-size:18px;color:#2c3e50">Hoy debes tomar:</p>
              <h3 style="margin:0;font-size:26px;color:#2980b9;font-weight:bold">
                ${datos.medicamento}
              </h3>
            </div>

            ${datos.dosis ? `<p><strong>Dosis:</strong> ${datos.dosis}</p>` : ''}
            <p><strong>Frecuencia:</strong> ${datos.frecuencia}</p>
            <p><strong>Fecha:</strong> ${datos.fecha}</p>

            <div style="margin:35px 0;padding:20px;background:#fff8e1;border-left:5px solid #ffc107;border-radius:8px">
              <p style="margin:0;color:#856404;font-weight:bold">¡No olvides tomarlo a tiempo!</p>
              <p style="margin:8px 0 0;color:#856404">Tu salud es lo primero.</p>
            </div>
          </div>

          <div style="background:#2c3e50;color:#bdc3c7;padding:25px;text-align:center;font-size:14px">
            <p style="margin:0">VitalTrack • Tu compañero de salud</p>
            <p style="margin:8px 0 0;opacity:0.8">Mensaje automático • No responder</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}