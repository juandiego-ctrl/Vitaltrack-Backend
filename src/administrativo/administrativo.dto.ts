export class AdministrativoDto {
  V6NumID: string;
  V125TipoTtoCorte?: string;
  V126ResFinalManejoOnc?: string;
  V127EstadoVital?: string;
  V128NovedadAdm?: string;
  V129NovedadClin?: string;
  V130FecDesafiliacion?: Date;
  V131FecMuerte?: Date;
  V132CausaMuerte?: string;
  V133CodUnicoID: string; // ⚠️ Este campo debe ser obligatorio si lo usas como identificador único
  V134FecCorte?: Date;
}
