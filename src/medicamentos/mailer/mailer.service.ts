// src/mailer/mailer.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private api: TransactionalEmailsApi;

  constructor() {
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      this.logger.error('❌ BREVO_API_KEY no configurada');
      throw new Error('Configuración de Brevo incompleta');
    }

    // Configuración correcta del SDK (2025)
    this.api = new TransactionalEmailsApi();
    this.api.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);
    this.logger.log('✅ Brevo configurado correctamente');
  }

  async enviarCorreo({ to, subject, html }: {
    to: string;
    subject: string;
    html: string;
  }) {
    try {
      this.logger.log(`📧 Enviando correo a: ${to}`);
      
      // Estructura del email según SDK actual
      const emailData = {
        to: [{ email: to }],
        sender: { name: 'VitalTrack', email: 'noreply@brevo.com' },
        subject,
        htmlContent: html,
      };

      const { body } = await this.api.sendTransacEmail(emailData);

      if (body.messageId) {
        this.logger.log(`✅ Correo enviado exitosamente. ID: ${body.messageId}`);
        return { success: true, id: body.messageId };
      } else {
        throw new Error('No se recibió ID de mensaje válido');
      }
    } catch (error: any) {
      this.logger.error('❌ Error de Brevo:', error?.body?.message || error.message);
      throw error;
    }
  }

  async enviarTratamiento(datos: {
    email: string;
    nombrePaciente: string;
    medicamentos: any[];
  }) {
    const html = this.generarHTMLTratamiento(datos);

    return this.enviarCorreo({
      to: datos.email,
      subject: `💊 Tratamiento para ${datos.nombrePaciente}`,
      html,
    });
  }

  private generarHTMLTratamiento(datos: any): string {
    const medicamentosHTML = datos.medicamentos
      .map(med => `
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">${med.nombre || 'N/A'}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${med.dosis || 'N/A'}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${med.frecuencia || 'N/A'}</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${med.duracion || 'N/A'}</td>
        </tr>
      `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Tratamiento Médico</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <h1 style="color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px;">
              💊 Tratamiento Médico - VitalTrack
            </h1>
            
            <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 20px;">
              <h2 style="color: #2980b9;">Paciente: ${datos.nombrePaciente}</h2>
              
              <h3 style="color: #27ae60; margin-top: 30px;">Medicamentos Prescritos:</h3>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <thead>
                  <tr style="background-color: #3498db; color: white;">
                    <th style="padding: 10px; border: 1px solid #ddd;">Medicamento</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Dosis</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Frecuencia</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  ${medicamentosHTML}
                </tbody>
              </table>
              
              <div style="margin-top: 30px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107;">
                <strong>⚠️ Importante:</strong> Siga las indicaciones de su médico. No suspenda el tratamiento sin consultar.
              </div>
            </div>
            
            <footer style="margin-top: 30px; text-align: center; color: #7f8c8d; font-size: 12px;">
              <p>Este es un mensaje automático de VitalTrack.</p>
              <p>Por favor no responder a este correo.</p>
            </footer>
          </div>
        </body>
      </html>
    `;
  }
}