package com.grupo.tpFinal.dto;

public class UsuarioDTO {
    private Long id;
    private String nombre;
    private String email;
    private String rol;
    private int fallas;
    private int marcasRetorno;
    private boolean forzarCambio;
    private boolean bloqueado;

    public UsuarioDTO(Long id, String nombre, String email, String rol, int fallas, int marcasRetorno, boolean forzarCambio, boolean bloqueado) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.rol = rol;
        this.fallas = fallas;
        this.marcasRetorno = marcasRetorno;
        this.forzarCambio = forzarCambio;
        this.bloqueado = bloqueado;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public boolean isForzarCambio() { return forzarCambio; }
    public void setForzarCambio(boolean forzarCambio) { this.forzarCambio = forzarCambio; }
    public boolean isBloqueado() { return bloqueado; }
    public void setBloqueado(boolean bloqueado) { this.bloqueado = bloqueado; }
}
