package com.grupo.tpFinal.excepciones;

public class PasswordIncorrectaException extends RuntimeException {
    public PasswordIncorrectaException(String mensaje) {
        super(mensaje);
    }
    
    public PasswordIncorrectaException() {
        super("Contraseña incorrecta");
    }
}
