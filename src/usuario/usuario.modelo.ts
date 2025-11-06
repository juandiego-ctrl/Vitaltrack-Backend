import mongoose from "mongoose";

export const UsuarioSchema = new mongoose.Schema({
    id: Number,
    nombre: String,
    email: String,
    contraseña: String,
    rol: String, // Puede ser "Administrador", "Médico" o "Usuario Estándar"
    tokenRecuperacion: String, // Código temporal para recuperar contraseña
    estadoCuenta: String, // Puede ser "Activo", "Deshabilitado", "Eliminado"
},

);

export interface IUsuario extends mongoose.Document {
    idUsuario: number;
    nombre: string;
    email: string;
    contraseña: string;
    rol: string; // Puede ser "Administrador", "Médico" o "Usuario Estándar"
    tokenRecuperacion: string; // Código temporal para recuperar contraseña
    estadoCuenta: string; // Puede ser "Activo", "Deshabilitado", "Eliminado"
}
