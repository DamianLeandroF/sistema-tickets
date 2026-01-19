package com.grupo.tpFinal.config;

import com.grupo.tpFinal.enums.EstadoTicket;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoTicketConverter implements AttributeConverter<EstadoTicket, String> {

    @Override
    public String convertToDatabaseColumn(EstadoTicket estado) {
        if (estado == null) {
            return null;
        }
        return estado.getValor();
    }

    @Override
    public EstadoTicket convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        
        for (EstadoTicket estado : EstadoTicket.values()) {
            if (estado.getValor().equals(dbData)) {
                return estado;
            }
        }
        
        throw new IllegalArgumentException("Estado desconocido: " + dbData);
    }
}
