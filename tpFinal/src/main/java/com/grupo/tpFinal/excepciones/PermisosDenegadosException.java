package com.grupo.tpFinal.excepciones;

public class PermisosDenegadosException extends RuntimeException {
    public PermisosDenegadosException(String mensaje) {
        super(mensaje);
    }
    
    public PermisosDenegadosException() {
        super("No tiene permisos para realizar esta acción");
    }
}
