import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter;

  constructor() {
    // Verificar que las variables de entorno existan
    const mailUser = process.env.MAIL_USER;
    const mailPass = process.env.MAIL_PASS;

    if (!mailUser || !mailPass) {
      this.logger.error('Variables de entorno MAIL_USER o MAIL_PASS no están configuradas');
      throw new Error('Configuración de correo incompleta');
    }

    this.logger.log(`Configurando transporter para: ${mailUser}`);

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true para puerto 465, false para 587
      auth: {
        user: mailUser,
        pass: mailPass,
      },
      // Opciones adicionales para debugging
      logger: false, // cambiar a true para ver logs de nodemailer
      debug: false, // cambiar a true para ver detalles de conexión
    });

    // Verificar la conexión al iniciar
    this.verificarConexion();
  }

  private async verificarConexion() {
    try {
      await this.transporter.verify();
      this.logger.log('Conexión SMTP verificada exitosamente');
    } catch (error) {
      this.logger.error('Error al verificar conexión SMTP:', error.message);
    }
  }

  async enviarCorreo({ to, subject, text, html }: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }) {
    try {
      this.logger.log(`Enviando correo a: ${to}`);
      
      const info = await this.transporter.sendMail({
        from: `"VitalTrack" <${process.env.MAIL_USER}>`,
        to,
        subject,
        text,
        html,
      });

      this.logger.log(`Correo enviado exitosamente. MessageID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      this.logger.error('Error al enviar correo:', error.message);
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
      subject: `Tratamiento para ${datos.nombrePaciente}`,
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
              Tratamiento Médico
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
                <strong>Importante:</strong> Siga las indicaciones de su médico. No suspenda el tratamiento sin consultar.
              </div>
            </div>
            
            <footer style="margin-top: 30px; text-align: center; color: #7f8c8d; font-size: 12px;">
              <p>Este es un mensaje automático, por favor no responder.</p>
            </footer>
          </div>
        </body>
      </html>
    `;
  }
}