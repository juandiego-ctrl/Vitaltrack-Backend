// src/citas/dto/create-cita.dto.ts
import { IsNotEmpty, IsString, IsDateString, IsEmail } from 'class-validator';

export class CreateCitaDto {
  @IsNotEmpty()
  @IsString()
  pacienteId: string;

  @IsNotEmpty()
  @IsString()
  medicoId: string;

  @IsNotEmpty()
  @IsDateString()
  fecha: string; // ← mejor string (YYYY-MM-DD)

  @IsNotEmpty()
  @IsString()
  horaInicio: string;

  @IsNotEmpty()
  @IsString()
  horaFin: string;

  @IsString()
  motivo?: string; // opcional

  // ¡AQUÍ ESTÁ LA CORRECCIÓN!
  @IsNotEmpty({ message: 'El correo del paciente es obligatorio' })
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  correoPaciente: string;
}