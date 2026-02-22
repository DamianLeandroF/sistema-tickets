package com.grupo.tpFinal.model;

import com.grupo.tpFinal.enums.Rol;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "usuarios")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    
    private String email;
    
    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private Rol rol;

    @Column(name = "forzar_cambio")
    private boolean forzarCambio = true;
    
    private boolean bloqueado = false;
    
    private int fallas = 0;
    
    @Column(name = "marcas_retorno")
    private int marcasRetorno = 0;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public boolean isForzarCambio() {
        return forzarCambio;
    }

    public void setForzarCambio(boolean forzarCambio) {
        this.forzarCambio = forzarCambio;
    }

    public boolean isBloqueado() {
        return bloqueado;
    }

    public void setBloqueado(boolean bloqueado) {
        this.bloqueado = bloqueado;
    }

    public int getFallas() {
        return fallas;
    }

    public void setFallas(int fallas) {
        this.fallas = fallas;
    }

    public int getMarcasRetorno() {
        return marcasRetorno;
    }

    public void setMarcasRetorno(int marcasRetorno) {
        this.marcasRetorno = marcasRetorno;
    }
}
