package com.iset.sistema_tickets.excepciones;

public class LimiteTicketsException extends Exception {
    public LimiteTicketsException(String message) {
        super(message);
    }
}