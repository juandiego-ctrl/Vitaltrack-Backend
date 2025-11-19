// src/paciente/paciente.dto.ts

import { IsString, IsOptional, IsDate, IsNotEmpty, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class pacienteDto {
  @IsOptional()
  @IsString()
  id?: string; // ← MongoDB usa string, no number

  @IsNotEmpty({ message: 'El primer nombre es obligatorio' })
  @IsString()
  V1PrimerNom: string;

  @IsOptional()
  @IsString()
  V2SegundoNom?: string;

  @IsNotEmpty({ message: 'El primer apellido es obligatorio' })
  @IsString()
  V3PrimerApe: string;

  @IsOptional()
  @IsString()
  V4SegundoApe?: string;

  @IsNotEmpty()
  @IsString()
  V5TipoID: string;

  @IsNotEmpty({ message: 'El número de documento es obligatorio' })
  @IsString()
  V6NumID: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  V7FecNac?: Date;

  @IsNotEmpty()
  @IsString()
  V8Sexo: string;

  @IsOptional()
  @IsString()
  V9Ocup?: string;

  @IsOptional()
  @IsString()
  V10RegAfiliacion?: string;

  @IsOptional()
  @IsString()
  V11CodEAPB?: string;

  @IsOptional()
  @IsString()
  V12CodEtnia?: string;

  @IsOptional()
  @IsString()
  V13GrupoPob?: string;

  @IsOptional()
  @IsString()
  V14MpioRes?: string;

  @IsOptional()
  @IsString()
  V15NumTel?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  V16FecAfiliacion?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  FechaIngreso?: Date;
}

// =====================================================
// DTO para crear paciente manual con todo el historial
// =====================================================
export class CreateManualDto {
  @IsNotEmpty({ message: 'Debes enviar los datos del paciente' })
  paciente: pacienteDto;

  @IsOptional()
  @IsArray()
  diagnosticos?: any[];

  @IsOptional()
  @IsArray()
  antecedentes?: any[];

  @IsOptional()
  @IsArray()
  archivos?: any[];

  @IsOptional()
  @IsArray()
  ttocx?: any[];

  @IsOptional()
  @IsArray()
  ttocxreconst?: any[];

  @IsOptional()
  @IsArray()
  ttopaliativos?: any[];

  @IsOptional()
  @IsArray()
  ttoqt?: any[];

  @IsOptional()
  @IsArray()
  ttort?: any[];

  @IsOptional()
  @IsArray()
  ttotrasplante?: any[];
}