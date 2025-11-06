import mongoose from "mongoose";

export const administrativoSchema = new mongoose.Schema(
    {
        id:Number,
        V125TipoTtoCorte: String,
        V126ResFinalManejoOnc: String,
        V127EstadoVital: String,
        V128NovedadAdm: String,
        V129NovedadClin: String,
        V130FecDesafiliacion: Date,
        V131FecMuerte: Date,
        V132CausaMuerte: String,
        V133CodUnicoID: String,
        V134FecCorte: Date,
        V6NumId: { type: String, required: true },
    }
);

export interface IAdministrativo extends mongoose.Document {
    id:Number;
    V125TipoTtoCorte: string;
    V126ResFinalManejoOnc: string;
    V127EstadoVital: string;
    V128NovedadAdm: string;
    V129NovedadClin: string;
    V130FecDesafiliacion: Date;
    V131FecMuerte: Date;
    V132CausaMuerte: string;
    V133CodUnicoID: string;
    V134FecCorte: Date;
    V6NumID: string;
}
