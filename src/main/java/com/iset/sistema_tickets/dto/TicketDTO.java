package com.iset.sistema_tickets.dto;

public class TicketDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private String estado;
    private Integer trabajadorId;
    private String trabajadorNombre;
    private Integer tecnicoId;
    private String tecnicoNombre;
    private String fechaCreacion;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public Integer getTrabajadorId() { return trabajadorId; }
    public void setTrabajadorId(Integer trabajadorId) { this.trabajadorId = trabajadorId; }
    public String getTrabajadorNombre() { return trabajadorNombre; }
    public void setTrabajadorNombre(String trabajadorNombre) { this.trabajadorNombre = trabajadorNombre; }
    public Integer getTecnicoId() { return tecnicoId; }
    public void setTecnicoId(Integer tecnicoId) { this.tecnicoId = tecnicoId; }
    public String getTecnicoNombre() { return tecnicoNombre; }
    public void setTecnicoNombre(String tecnicoNombre) { this.tecnicoNombre = tecnicoNombre; }
    public String getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(String fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}
