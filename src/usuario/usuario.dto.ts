export class usuarioDto {
    idUsuario: number;
    nombre: string;
    email: string;
    contraseña: string;
    rol: string; // Puede ser "Administrador", "Médico" o "Usuario Estándar"
    tokenRecuperacion: string; // Código temporal para recuperar contraseña
    estadoCuenta: string; // Puede ser "Activo", "Deshabilitado", "Eliminado"
}
