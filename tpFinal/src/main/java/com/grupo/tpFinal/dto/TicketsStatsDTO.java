package com.grupo.tpFinal.dto;

public class TicketsStatsDTO {

    private long total;
    private long noAtendidos;
    private long atendidos;
    private long resueltos;
    private long finalizados;
    private long reabiertos;

    public TicketsStatsDTO(long total, long noAtendidos, long atendidos, long resueltos, long finalizados, long reabiertos) {
        this.total = total;
        this.noAtendidos = noAtendidos;
        this.atendidos = atendidos;
        this.resueltos = resueltos;
        this.finalizados = finalizados;
        this.reabiertos = reabiertos;
    }

    public long getTotal() {
        return total;
    }

    public long getNoAtendidos() {
        return noAtendidos;
    }

    public long getAtendidos() {
        return atendidos;
    }

    public long getResueltos() {
        return resueltos;
    }

    public long getFinalizados() {
        return finalizados;
    }

    public long getReabiertos() {
        return reabiertos;
    }
}
