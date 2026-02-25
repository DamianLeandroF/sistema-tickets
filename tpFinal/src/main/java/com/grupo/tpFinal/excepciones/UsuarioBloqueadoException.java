package com.grupo.tpFinal.excepciones;

public class UsuarioBloqueadoException extends RuntimeException {
    public UsuarioBloqueadoException(String mensaje) {
        super(mensaje);
    }
    
    public UsuarioBloqueadoException() {
        super("Usuario bloqueado. Contacte al administrador.");
    }
}
