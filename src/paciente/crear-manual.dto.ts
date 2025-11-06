import { pacienteDto } from './paciente.dto';

export class CreateManualDto {
  paciente: pacienteDto;
  diagnosticos?: any[];
  antecedentes?: any[];
  archivos?: any[];
  ttocx?: any[];
  ttocxreconst?: any[];
  ttopaliativos?: any[];
  ttoqt?: any[];
  ttort?: any[];
  ttotrasplante?: any[];
}
