package com.iset.sistema_tickets.modelo;

import jakarta.persistence.*;

@Entity
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String descripcion;
    
    @Enumerated(EnumType.STRING)
    private EstadoTicket estado;

    @ManyToOne
    private Usuario tecnicoActual;

    @ManyToOne
    private Usuario trabajador;

    public Ticket() {}

    public Ticket(String titulo, String descripcion, EstadoTicket estado, Usuario trabajador) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.estado = estado;
        this.trabajador = trabajador;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public EstadoTicket getEstado() { return estado; }
    public void setEstado(EstadoTicket estado) { this.estado = estado; }

    public Usuario getTecnicoActual() { return tecnicoActual; }
    public void setTecnicoActual(Usuario tecnicoActual) { this.tecnicoActual = tecnicoActual; }

    public Usuario getTrabajador() { return trabajador; }
    public void setTrabajador(Usuario trabajador) { this.trabajador = trabajador; }
}
