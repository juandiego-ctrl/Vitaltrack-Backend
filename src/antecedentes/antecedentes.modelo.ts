import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export const AntecedentesSchema = new mongoose.Schema({
  V42AntCancerPrim: { type: String, required: true },
  V43FecDiagAnt: { type: Date, required: true },
  V44TipoCancerAnt: { type: String, required: true },
  V6NumId: { type: String, required: true },
});

export interface IAntecedentes extends Document {
  V42AntCancerPrim: string;
  V43FecDiagAnt: Date;
  V44TipoCancerAnt: string;
  V6NumID: String;
}
