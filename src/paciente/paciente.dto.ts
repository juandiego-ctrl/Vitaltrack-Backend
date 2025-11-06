export class pacienteDto {
  id?: number; 
  V1PrimerNom: string;
  V2SegundoNom: string;
  V3PrimerApe: string;
  V4SegundoApe: string;
  V5TipoID: string;
  V6NumID: string;
  V7FecNac: Date;
  V8Sexo: string;
  V9Ocup: string;
  V10RegAfiliacion: string;
  V11CodEAPB: string;
  V12CodEtnia: string;
  V13GrupoPob: string;
  V14MpioRes: string;
  V15NumTel: string;
  V16FecAfiliacion: Date;
  FechaIngreso: Date;
}

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
