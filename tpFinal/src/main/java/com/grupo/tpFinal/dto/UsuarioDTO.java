package com.grupo.tpFinal.dto;

import com.grupo.tpFinal.enums.Rol;
import com.grupo.tpFinal.model.Usuario;

public class UsuarioDTO {
    private Long id;
    private String nombre;
    private String email;
    private Rol rol;
    private int fallas;
    private int marcasRetorno;
    private boolean forzarCambio;
    private boolean bloqueado;

    public UsuarioDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nombre = usuario.getNombre();
        this.email = usuario.getEmail();
        this.fallas = usuario.getFallas();
        this.marcasRetorno = usuario.getMarcasRetorno();
        this.forzarCambio = usuario.isForzarCambio();
        this.bloqueado = usuario.isBloqueado();
        this.rol = usuario.getRol() != null
                ? usuario.getRol()
                : null;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }
    public int getFallas() { return fallas; }
    public void setFallas(int fallas) { this.fallas = fallas; }
    public int getMarcasRetorno() { return marcasRetorno; }
    public void setMarcasRetorno(int marcasRetorno) { this.marcasRetorno = marcasRetorno; }
    public boolean isForzarCambio() { return forzarCambio; }
    public void setForzarCambio(boolean forzarCambio) { this.forzarCambio = forzarCambio; }
    public boolean isBloqueado() { return bloqueado; }
    public void setBloqueado(boolean bloqueado) { this.bloqueado = bloqueado; }
}
