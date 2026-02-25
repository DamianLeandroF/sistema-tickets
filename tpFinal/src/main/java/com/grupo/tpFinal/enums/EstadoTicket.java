package com.grupo.tpFinal.enums;

public enum EstadoTicket {
    NO_ATENDIDO("No atendido"),
    ATENDIDO("Atendido"),
    RESUELTO("Resuelto"),
    FINALIZADO("Finalizado"),
    REABIERTO("Reabierto"),
    SOLICITUD_REAPERTURA("Solicitud de reapertura");
    
    private final String valor;
    
    EstadoTicket(String valor) {
        this.valor = valor;
    }
    
    public String getValor() {
        return valor;
    }
    
    @Override
    public String toString() {
        return valor;
    }
}
