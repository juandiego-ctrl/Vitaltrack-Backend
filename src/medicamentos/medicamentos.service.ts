import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Medicamento } from './schema/medicamento.schema';
import { MailerService } from './mailer/mailer.service';

@Injectable()
export class MedicamentosService {
  private readonly logger = new Logger(MedicamentosService.name);

  constructor(
    @InjectModel(Medicamento.name)
    private readonly medicamentoModel: Model<Medicamento>,
    private readonly mailerService: MailerService,
  ) {}

  async crear(data: any) {
    const med = new this.medicamentoModel(data);
    const resultado = await med.save();

    // Si viene con correo, enviar email
    if (data.correo && data.paciente) {
      try {
        await this.mailerService.enviarTratamiento({
          email: data.correo,
          nombrePaciente: data.paciente,
          medicamentos: [
            {
              nombre: data.medicamento,
              dosis: 'Según indicación médica',
              frecuencia: data.frecuencia,
              duracion: `Desde ${data.fechaInicio} hasta ${data.fechaFin}`,
            },
          ],
        });
        this.logger.log(`Email enviado a: ${data.correo}`);
      } catch (error) {
        this.logger.error('Error al enviar email:', error.message);
        // No lanzar error para que no falle el guardado
      }
    }

    return resultado;
  }

  async crearTratamiento(data: {
    paciente: string;
    correo: string;
    telefono: string;
    medicamentos: Array<{
      medicamento: string;
      frecuencia: string;
      fechaInicio: string;
      fechaFin: string;
    }>;
  }) {
    try {
      this.logger.log('Guardando tratamiento para:', data.paciente);

      // Guardar cada medicamento en la base de datos
      const medicamentosGuardados = await Promise.all(
        data.medicamentos.map(med => {
          const medicamento = new this.medicamentoModel({
            paciente: data.paciente,
            medicamento: med.medicamento,
            frecuencia: med.frecuencia,
            fechaInicio: med.fechaInicio,
            fechaFin: med.fechaFin,
            telefono: data.telefono,
            correo: data.correo,
            activo: true,
          });
          return medicamento.save();
        })
      );

      this.logger.log('Medicamentos guardados, enviando email...');

      // Preparar datos para el email
      const medicamentosParaEmail = data.medicamentos.map(med => ({
        nombre: med.medicamento,
        dosis: 'Según indicación médica',
        frecuencia: med.frecuencia,
        duracion: `Desde ${med.fechaInicio} hasta ${med.fechaFin}`,
      }));

      // Enviar email con el tratamiento
      await this.mailerService.enviarTratamiento({
        email: data.correo,
        nombrePaciente: data.paciente,
        medicamentos: medicamentosParaEmail,
      });

      return {
        success: true,
        mensaje: 'Tratamiento guardado y email enviado',
        medicamentos: medicamentosGuardados,
      };
    } catch (error) {
      this.logger.error('Error al crear tratamiento:', error);
      throw error;
    }
  }

  async obtenerActivos() {
    return this.medicamentoModel.find({ activo: true }).exec();
  }

}