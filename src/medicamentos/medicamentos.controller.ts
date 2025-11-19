// MedicamentosController - Asegúrate de tener esta estructura

import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { MedicamentosService } from './medicamentos.service';
import { MailerService } from './mailer/mailer.service'; // Ajusta la ruta según tu estructura

@Controller('medicamentos')
export class MedicamentosController {
  constructor(
    private readonly medicamentosService: MedicamentosService,
    private readonly mailerService: MailerService, // ← AGREGA ESTO
  ) {}

  // Tus otros endpoints...

  @Post('test-email-simple')
  async testEmailSimple(@Body() body: { email: string }) {
    try {
      console.log('📧 Intentando enviar correo de prueba a:', body.email);
      
      const resultado = await this.mailerService.enviarCorreo({
        to: body.email,
        subject: '✅ Prueba de correo VitalTrack',
        html: `
          <h1>¡Correo de prueba!</h1>
          <p>Si recibes este correo, el servicio está funcionando correctamente.</p>
          <p>Hora de envío: ${new Date().toLocaleString()}</p>
        `,
      });
      
      console.log('✅ Resultado:', resultado);
      
      return {
        success: true,
        message: 'Correo enviado correctamente',
        resultado,
      };
    } catch (error) {
      console.error('❌ Error al enviar correo:', error);
      return {
        success: false,
        error: error.message,
        stack: error.stack,
      };
    }
  }

  @Post('tratamiento')
  async crearTratamiento(@Body() datos: any) {
    try {
      console.log('=== INICIANDO ENVÍO DE TRATAMIENTO ===');
      console.log('Email destino:', datos.email);
      console.log('Paciente:', datos.nombrePaciente);
      
      const resultado = await this.mailerService.enviarTratamiento(datos);
      
      console.log('=== RESULTADO ENVÍO ===');
      console.log(JSON.stringify(resultado));
      
      return {
        success: true,
        message: 'Tratamiento enviado correctamente',
        resultado,
      };
    } catch (error) {
      console.error('=== ERROR EN ENVÍO ===');
      console.error(error);
      throw error;
    }
  }
}