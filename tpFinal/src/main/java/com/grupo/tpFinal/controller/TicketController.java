package com.grupo.tpFinal.controller;

import com.grupo.tpFinal.dto.TicketCreateRequest;
import com.grupo.tpFinal.dto.TicketsStatsDTO;
import com.grupo.tpFinal.enums.EstadoTicket;
import com.grupo.tpFinal.model.Ticket;
import com.grupo.tpFinal.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    /**
     * Obtener todos los tickets
     */
    @GetMapping
    public List<Ticket> getTickets() {
        return ticketService.obtenerTickets();
    }

    /**
     * Obtener tickets por estado (para admin)
     */
    @GetMapping("/estado/{estado}")
    public List<Ticket> getTicketsPorEstado(@PathVariable EstadoTicket estado) {
        return ticketService.obtenerTicketsPorEstado(estado);
    }

    /**
     * Obtener tickets de un trabajador (no finalizados)
     */
    @GetMapping("/trabajador/{trabajadorId}")
    public List<Ticket> getTicketsPorTrabajador(@PathVariable Long trabajadorId) {
        return ticketService.obtenerTicketsPorTrabajador(trabajadorId);
    }

    /**
     * Obtener tickets asignados a un técnico
     */
    @GetMapping("/tecnico/{tecnicoId}")
    public List<Ticket> getTicketsPorTecnico(@PathVariable Long tecnicoId) {
        return ticketService.obtenerTicketsPorTecnico(tecnicoId);
    }

    /**
     * Obtener estadísticas de tickets
     */
    @GetMapping("/stats")
    public TicketsStatsDTO getStats() {
        return ticketService.obtenerEstadisticas();
    }

    /**
     * Crear un ticket (solo trabajadores)
     */
    @PostMapping("/crear/{trabajadorId}")
    public Ticket crearTicket(@RequestBody TicketCreateRequest request, @PathVariable Long trabajadorId) {
        try {
            System.out.println("=== CREAR TICKET ===");
            System.out.println("Trabajador ID: " + trabajadorId);
            System.out.println("Título: " + request.getTitulo());
            System.out.println("Descripción: " + request.getDescripcion());
            
            Ticket ticket = new Ticket();
            ticket.setTitulo(request.getTitulo());
            ticket.setDescripcion(request.getDescripcion());
            
            Ticket resultado = ticketService.crearTicket(ticket, trabajadorId);
            System.out.println("Ticket creado exitosamente con ID: " + resultado.getId());
            return resultado;
        } catch (Exception e) {
            System.err.println("ERROR al crear ticket: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Asignar ticket a técnico
     */
    @PutMapping("/{ticketId}/asignar/{tecnicoId}")
    public Ticket asignarTicket(@PathVariable Long ticketId, @PathVariable Long tecnicoId) {
        return ticketService.asignarTicket(ticketId, tecnicoId);
    }

    /**
     * Marcar ticket como resuelto (técnico)
     */
    @PutMapping("/{ticketId}/resolver/{tecnicoId}")
    public Ticket marcarComoResuelto(@PathVariable Long ticketId, @PathVariable Long tecnicoId) {
        return ticketService.marcarComoResuelto(ticketId, tecnicoId);
    }

    /**
     * Confirmar o rechazar resolución (trabajador)
     */
    @PutMapping("/{ticketId}/confirmar/{trabajadorId}")
    public Ticket confirmarResolucion(
            @PathVariable Long ticketId, 
            @PathVariable Long trabajadorId,
            @RequestBody Map<String, Boolean> body) {
        boolean confirmado = body.getOrDefault("confirmado", false);
        return ticketService.confirmarResolucion(ticketId, trabajadorId, confirmado);
    }

    /**
     * Solicitar reapertura de ticket (técnico)
     */
    @PutMapping("/{ticketId}/solicitar-reapertura/{tecnicoId}")
    public Ticket solicitarReapertura(@PathVariable Long ticketId, @PathVariable Long tecnicoId) {
        return ticketService.solicitarReapertura(ticketId, tecnicoId);
    }

    /**
     * Reabrir ticket (administrador)
     */
    @PutMapping("/{ticketId}/reabrir/{adminId}")
    public Ticket reabrirTicket(@PathVariable Long ticketId, @PathVariable Long adminId) {
        return ticketService.reabrirTicket(ticketId, adminId);
    }

    /**
     * Cambiar estado de ticket (genérico - usar con cuidado)
     */
    @PutMapping("/{id}/estado")
    public Ticket cambiarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        EstadoTicket estado = EstadoTicket.valueOf(body.get("estado"));
        return ticketService.cambiarEstado(id, estado);
    }
}
