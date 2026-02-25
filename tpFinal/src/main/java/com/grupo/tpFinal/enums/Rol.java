package com.grupo.tpFinal.enums;

public enum Rol {
    admin,
    tecnico,
    trabajador;
    
    // Método helper para compatibilidad con código existente
    public static Rol fromString(String value) {
        return Rol.valueOf(value.toLowerCase());
    }
}
