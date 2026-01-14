package com.iset.sistema_tickets.modelo;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Usuario {
    @Id
    private Integer id; // número de identificación 
    private String nombre;
    private String email;
    private String password; // contraseña 
    private String tipo; // admin, tecnico o trabajador [cite: 23]
    private boolean forzarCambio = true; // cambio obligatorio [cite: 24]
    private boolean bloqueado = false; // control por fallas 
    private int fallas = 0; // contador de fallas [cite: 18, 19]
    private int marcasRetorno = 0; // marcas por retornar tickets

    // Getters y Setters necesarios para los servicios
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public boolean isForzarCambio() { return forzarCambio; }
    public void setForzarCambio(boolean forzarCambio) { this.forzarCambio = forzarCambio; }
    public boolean isBloqueado() { return bloqueado; }
    public void setBloqueado(boolean bloqueado) { this.bloqueado = bloqueado; }
    public int getFallas() { return fallas; }
    public void setFallas(int fallas) { this.fallas = fallas; }
    public int getMarcasRetorno() { return marcasRetorno; }
    public void setMarcasRetorno(int marcasRetorno) { this.marcasRetorno = marcasRetorno; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
}
