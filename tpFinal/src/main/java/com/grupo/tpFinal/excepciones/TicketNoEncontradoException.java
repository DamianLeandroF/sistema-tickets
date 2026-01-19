package com.grupo.tpFinal.excepciones;

public class TicketNoEncontradoException extends RuntimeException {
    public TicketNoEncontradoException(String mensaje) {
        super(mensaje);
    }
    
    public TicketNoEncontradoException(Long id) {
        super("Ticket con ID " + id + " no encontrado");
    }
}
