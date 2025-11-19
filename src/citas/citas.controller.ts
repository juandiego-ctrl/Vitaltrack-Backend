// src/citas/citas.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Put,
} from '@nestjs/common';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { MailerService } from '../medicamentos/mailer/mailer.service'; // ← Ruta correcta si tu mailer está ahí

@Controller('citas')
export class CitasController {
  constructor(
    private readonly citasService: CitasService,
    private readonly mailerService: MailerService, // ← Inyectado correctamente
  ) {}

  @Post()
  create(@Body() createCitaDto: CreateCitaDto) {
    return this.citasService.create(createCitaDto);
  }

  @Get()
  findAll() {
    return this.citasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCitaDto: UpdateCitaDto) {
    return this.citasService.update(id, updateCitaDto);
  }

  @Put(':id')
  updatePut(@Param('id') id: string, @Body() updateCitaDto: UpdateCitaDto) {
    return this.citasService.update(id, updateCitaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.citasService.remove(id);
  }

  // RECORDATORIO DE CITA POR EMAIL
  @Post('recordatorio')
  async enviarRecordatorio(
    @Body()
    datos: {
      paciente: string;
      medico: string;
      fecha: string; // formato YYYY-MM-DD
      hora: string; // formato HH:mm
      correo: string;
    },
  ) {
    const fechaBonita = new Date(datos.fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
      .replace(/^\w/, (c) => c.toUpperCase());

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Recordatorio de Cita - VitalTrack</title>
      </head>
      <body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif">
        <div style="max-width:600px;margin:30px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)">
          <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:30px;text-align:center;color:white">
            <h1 style="margin:0;font-size:28px">Recordatorio de Cita</h1>
            <p style="margin:10px 0 0;font-size:16px;opacity:0.9">VitalTrack te recuerda tu consulta</p>
          </div>

          <div style="padding:30px">
            <h2 style="color:#2c3e50;margin-top:0">¡Hola ${datos.paciente}!</h2>
            
            <div style="background:#e8f5e8;padding:25px;border-radius:10px;border-left:6px solid #4caf50;margin:25px 0">
              <p style="margin:0 0 15px;font-size:18px;color:#2e7d32">Tienes una cita médica programada:</p>
              <h3 style="margin:0;font-size:26px;color:#1b5e20;font-weight:bold">${datos.medico}</h3>
            </div>

            <p style="font-size:16px"><strong>Fecha:</strong> ${fechaBonita}</p>
            <p style="font-size:16px"><strong>Hora:</strong> ${datos.hora}</p>

            <div style="margin:35px 0;padding:20px;background:#fff3cd;border-left:5px solid #ffc107;border-radius:8px">
              <p style="margin:0;color:#856404;font-weight:bold">¡No olvides llegar 10 minutos antes!</p>
              <p style="margin:8px 0 0;color:#856404">Si necesitas reprogramar, contáctanos con anticipación.</p>
            </div>
          </div>

          <div style="background:#2c3e50;color:#bdc3c7;padding:25px;text-align:center;font-size:14px">
            <p style="margin:0">VitalTrack • Tu salud, nuestra prioridad</p>
            <p style="margin:8px 0 0;opacity:0.8">Mensaje automático • No responder</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.mailerService.enviarCorreo({
        to: datos.correo,
        subject: `Recordatorio: Cita con ${datos.medico} el ${datos.fecha}`,
        html,
      });

      return { success: true, message: 'Recordatorio de cita enviado correctamente' };
    } catch (error: any) {
      console.error('Error enviando recordatorio de cita:', error);
      return {
        success: false,
        message: 'Error al enviar el correo',
        error: error.message || error,
      };
    }
  }
}