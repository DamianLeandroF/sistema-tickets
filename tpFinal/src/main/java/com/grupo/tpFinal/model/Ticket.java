package com.grupo.tpFinal.model;

import com.grupo.tpFinal.enums.EstadoTicket;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "tickets")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String descripcion;

    @Convert(converter = com.grupo.tpFinal.config.EstadoTicketConverter.class)
    @Column(name = "estado")
    private EstadoTicket estado;

    @ManyToOne
    @JoinColumn(name = "id_tecnico_actual")
    private Usuario tecnicoActual;

    @ManyToOne
    @JoinColumn(name = "id_tecnico_anterior")
    private Usuario tecnicoAnterior;

    @ManyToOne
    @JoinColumn(name = "id_creador")
    private Usuario trabajador; // creador del ticket

    @Column(name = "fue_reabierto")
    private boolean reabierto = false;

    public Ticket() {}

    public Ticket(String titulo, String descripcion, EstadoTicket estado, Usuario trabajador) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.estado = estado;
        this.trabajador = trabajador;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public EstadoTicket getEstado() {
        return estado;
    }

    public void setEstado(EstadoTicket estado) {
        this.estado = estado;
    }

    public Usuario getTecnicoActual() {
        return tecnicoActual;
    }

    public void setTecnicoActual(Usuario tecnicoActual) {
        this.tecnicoActual = tecnicoActual;
    }

    public Usuario getTecnicoAnterior() {
        return tecnicoAnterior;
    }

    public void setTecnicoAnterior(Usuario tecnicoAnterior) {
        this.tecnicoAnterior = tecnicoAnterior;
    }

    public Usuario getTrabajador() {
        return trabajador;
    }

    public void setTrabajador(Usuario trabajador) {
        this.trabajador = trabajador;
    }

    public boolean isReabierto() {
        return reabierto;
    }

    public void setReabierto(boolean reabierto) {
        this.reabierto = reabierto;
    }
}
