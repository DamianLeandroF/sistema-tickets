package com.iset.sistema_tickets.dto;

public class UsuarioDTO {
    private Integer id;
    private String nombre;
    private String email;
    private String rol;
    private int fallas;
    private int marcasRetorno;

    public UsuarioDTO(Integer id, String nombre, String email, String rol, int fallas, int marcasRetorno) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.fallas = fallas;
        this.marcasRetorno = marcasRetorno;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public int getFallas() { return fallas; }
    public void setFallas(int fallas) { this.fallas = fallas; }
    public int getMarcasRetorno() { return marcasRetorno; }
    public void setMarcasRetorno(int marcasRetorno) { this.marcasRetorno = marcasRetorno; }
}
