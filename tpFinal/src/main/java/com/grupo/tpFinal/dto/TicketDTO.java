package com.grupo.tpFinal.dto;

public class TicketDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private String estado;
    private Long trabajadorId;
    private String trabajadorNombre;
    private Long tecnicoId;
    private String tecnicoNombre;
    private String fechaCreacion;
    private boolean reabierto;
    private String tecnicoAnteriorNombre;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public Long getTrabajadorId() { return trabajadorId; }
    public void setTrabajadorId(Long trabajadorId) { this.trabajadorId = trabajadorId; }
    public String getTrabajadorNombre() { return trabajadorNombre; }
    public void setTrabajadorNombre(String trabajadorNombre) { this.trabajadorNombre = trabajadorNombre; }
    public Long getTecnicoId() { return tecnicoId; }
    public void setTecnicoId(Long tecnicoId) { this.tecnicoId = tecnicoId; }
    public String getTecnicoNombre() { return tecnicoNombre; }
    public void setTecnicoNombre(String tecnicoNombre) { this.tecnicoNombre = tecnicoNombre; }
    public String getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(String fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public boolean isReabierto() { return reabierto; }
    public void setReabierto(boolean reabierto) { this.reabierto = reabierto; }
    public String getTecnicoAnteriorNombre() { return tecnicoAnteriorNombre; }
    public void setTecnicoAnteriorNombre(String tecnicoAnteriorNombre) { this.tecnicoAnteriorNombre = tecnicoAnteriorNombre; }
}
