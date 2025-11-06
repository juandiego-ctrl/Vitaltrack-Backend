// src/citas/dto/create-cita.dto.ts
import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateCitaDto {
  @IsNotEmpty()
  @IsString()
  pacienteId: string;

  @IsNotEmpty()
  @IsString()
  medicoId: string;

  @IsNotEmpty()
  @IsDateString()
  fecha: Date;

  @IsNotEmpty()
  @IsString()
  horaInicio: string;

  @IsNotEmpty()
  @IsString()
  horaFin: string;

  @IsString()
  motivo: string;
}
