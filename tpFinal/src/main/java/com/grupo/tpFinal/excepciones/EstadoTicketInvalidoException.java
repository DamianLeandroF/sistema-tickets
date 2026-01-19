package com.grupo.tpFinal.excepciones;

public class EstadoTicketInvalidoException extends RuntimeException {
    public EstadoTicketInvalidoException(String mensaje) {
        super(mensaje);
    }
}
