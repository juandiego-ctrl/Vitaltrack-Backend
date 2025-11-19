import { Controller, Post, Body, Logger, Get } from '@nestjs/common';
import { MedicamentosService } from './medicamentos.service';

@Controller('medicamentos')
export class MedicamentosController {
  private readonly logger = new Logger(MedicamentosController.name);

  constructor(private readonly service: MedicamentosService) {}

  @Post()
  async crear(@Body() body: any) {
    this.logger.log('Creando medicamento:', JSON.stringify(body));
    return this.service.crear(body);
  }

  @Post('tratamiento')
  async crearTratamiento(@Body() body: {
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
    this.logger.log('Recibiendo tratamiento:', JSON.stringify(body));
    return this.service.crearTratamiento(body);
  }

  @Get('activos')
  async obtenerActivos() {
    return this.service.obtenerActivos();
  }

  // Endpoint de prueba
  @Post('test-email')
  async testEmail(@Body() body: { correo: string }) {
    return this.service.crearTratamiento({
      paciente: 'Paciente Prueba',
      correo: body.correo,
      telefono: '3001234567',
      medicamentos: [
        {
          medicamento: 'Paracetamol 500mg',
          frecuencia: 'Cada 8 horas',
          fechaInicio: '2024-01-15',
          fechaFin: '2024-01-20',
        },
        {
          medicamento: 'Ibuprofeno 400mg',
          frecuencia: 'Cada 12 horas',
          fechaInicio: '2024-01-15',
          fechaFin: '2024-01-18',
        },
      ],
    });
  }
}