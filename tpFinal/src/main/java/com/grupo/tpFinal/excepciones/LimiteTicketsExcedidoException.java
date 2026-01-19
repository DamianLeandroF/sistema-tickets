package com.grupo.tpFinal.excepciones;

public class LimiteTicketsExcedidoException extends RuntimeException {
    public LimiteTicketsExcedidoException(String mensaje) {
        super(mensaje);
    }
    
    public LimiteTicketsExcedidoException() {
        super("El técnico ya tiene el máximo de 3 tickets asignados");
    }
    
    public LimiteTicketsExcedidoException(int ticketsActuales) {
        super("El técnico ya tiene " + ticketsActuales + " tickets asignados (máximo 3)");
    }
}
