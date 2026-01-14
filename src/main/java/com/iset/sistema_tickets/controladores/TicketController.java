package com.iset.sistema_tickets.controladores;

import com.iset.sistema_tickets.dto.TicketCreateRequest;
import com.iset.sistema_tickets.dto.TicketDTO;
import com.iset.sistema_tickets.dto.TicketStatusUpdateRequest;
import com.iset.sistema_tickets.modelo.Ticket;
import com.iset.sistema_tickets.servicios.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @GetMapping
    public ResponseEntity<List<TicketDTO>> listarTodos() {
        List<Ticket> tickets = ticketService.listarTodos();
        return ResponseEntity.ok(tickets.stream().map(this::convertToDTO).collect(Collectors.toList()));
    }

    @GetMapping("/trabajador/{id}")
    public ResponseEntity<List<TicketDTO>> listarPorTrabajador(@PathVariable Integer id) {
        List<Ticket> tickets = ticketService.listarPorTrabajador(id);
        return ResponseEntity.ok(tickets.stream().map(this::convertToDTO).collect(Collectors.toList()));
    }

    @GetMapping("/tecnico/{id}")
    public ResponseEntity<List<TicketDTO>> listarPorTecnico(@PathVariable Integer id) {
        List<Ticket> tickets = ticketService.listarPorTecnico(id);
        return ResponseEntity.ok(tickets.stream().map(this::convertToDTO).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            Ticket ticket = ticketService.obtenerPorId(id);
            return ResponseEntity.ok(convertToDTO(ticket));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> crearTicket(@RequestBody TicketCreateRequest request, @RequestParam Integer trabajadorId) {
        try {
            Ticket ticket = ticketService.crearTicket(request.getTitulo(), request.getDescripcion(), trabajadorId);
            return ResponseEntity.ok(convertToDTO(ticket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/asignar/{tecnicoId}")
    public ResponseEntity<?> asignarTecnico(@PathVariable Long id, @PathVariable Integer tecnicoId) {
        try {
            Ticket ticket = ticketService.asignarTecnico(id, tecnicoId);
            return ResponseEntity.ok(convertToDTO(ticket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestBody TicketStatusUpdateRequest request) {
        try {
            Ticket ticket = ticketService.cambiarEstado(id, request.getAccion());
            return ResponseEntity.ok(convertToDTO(ticket));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private TicketDTO convertToDTO(Ticket ticket) {
        TicketDTO dto = new TicketDTO();
        dto.setId(ticket.getId());
        dto.setTitulo(ticket.getTitulo());
        dto.setDescripcion(ticket.getDescripcion());
        dto.setEstado(ticket.getEstado().name());
        
        if (ticket.getTrabajador() != null) {
            dto.setTrabajadorId(ticket.getTrabajador().getId());
            dto.setTrabajadorNombre(ticket.getTrabajador().getNombre());
        }
        
        if (ticket.getTecnicoActual() != null) {
            dto.setTecnicoId(ticket.getTecnicoActual().getId());
            dto.setTecnicoNombre(ticket.getTecnicoActual().getNombre());
        }
        
        // dto.setFechaCreacion(...) // Si agregamos fecha al modelo
        
        return dto;
    }
}
