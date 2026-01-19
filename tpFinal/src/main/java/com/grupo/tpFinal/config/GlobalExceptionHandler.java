package com.grupo.tpFinal.config;

import com.grupo.tpFinal.excepciones.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(UsuarioNoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> handleUsuarioNoEncontrado(UsuarioNoEncontradoException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(TicketNoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> handleTicketNoEncontrado(TicketNoEncontradoException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(UsuarioBloqueadoException.class)
    public ResponseEntity<Map<String, Object>> handleUsuarioBloqueado(UsuarioBloqueadoException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.FORBIDDEN);
    }
    
    @ExceptionHandler(PermisosDenegadosException.class)
    public ResponseEntity<Map<String, Object>> handlePermisosDenegados(PermisosDenegadosException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.FORBIDDEN);
    }
    
    @ExceptionHandler(PasswordIncorrectaException.class)
    public ResponseEntity<Map<String, Object>> handlePasswordIncorrecta(PasswordIncorrectaException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }
    
    @ExceptionHandler(LimiteTicketsExcedidoException.class)
    public ResponseEntity<Map<String, Object>> handleLimiteTicketsExcedido(LimiteTicketsExcedidoException ex) {
        return buildErrorResponse(
            "⚠️ No puedes tomar más tickets. Ya tienes 3 tickets asignados. Debes resolver al menos uno antes de tomar otro.",
            HttpStatus.BAD_REQUEST
        );
    }
    
    @ExceptionHandler(EstadoTicketInvalidoException.class)
    public ResponseEntity<Map<String, Object>> handleEstadoTicketInvalido(EstadoTicketInvalidoException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        return buildErrorResponse("Error interno del servidor: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    private ResponseEntity<Map<String, Object>> buildErrorResponse(String message, HttpStatus status) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", status.value());
        error.put("error", status.getReasonPhrase());
        error.put("message", message);
        return ResponseEntity.status(status).body(error);
    }
}
