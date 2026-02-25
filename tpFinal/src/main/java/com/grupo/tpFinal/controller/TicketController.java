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
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    /** Obtener todos los tickets */
    @GetMapping
    public List<Ticket> getTickets() {
        return ticketService.obtenerTickets();
    }

    /** Obtener tickets por estado (para admin) */
    @GetMapping("/estado/{estado}")
    public List<Ticket> getTicketsPorEstado(@PathVariable EstadoTicket estado) {
        return ticketService.obtenerTicketsPorEstado(estado);
    }

    /** Obtener tickets de un trabajador (no finalizados) */
    @GetMapping("/trabajador/{trabajadorId}")
    public List<Ticket> getTicketsPorTrabajador(@PathVariable Long trabajadorId) {
        return ticketService.obtenerTicketsPorTrabajador(trabajadorId);
    }

    /** Obtener tickets asignados a un técnico */
    @GetMapping("/tecnico/{tecnicoId}")
    public List<Ticket> getTicketsPorTecnico(@PathVariable Long tecnicoId) {
        return ticketService.obtenerTicketsPorTecnico(tecnicoId);
    }

    /** Estadísticas globales de tickets */
    @GetMapping("/stats")
    public TicketsStatsDTO getStats() {
        return ticketService.obtenerEstadisticas();
    }

    /** Crear un ticket (solo trabajadores) */
    @PostMapping("/crear/{trabajadorId}")
    public Ticket crearTicket(@RequestBody TicketCreateRequest request, @PathVariable Long trabajadorId) {
        return ticketService.crearTicket(request, trabajadorId);
    }

    /** Técnico toma un ticket */
    @PutMapping("/{ticketId}/asignar/{tecnicoId}")
    public Ticket asignarTicket(@PathVariable Long ticketId, @PathVariable Long tecnicoId) {
        return ticketService.asignarTicket(ticketId, tecnicoId);
    }

    /** Técnico marca ticket como resuelto */
    @PutMapping("/{ticketId}/resolver/{tecnicoId}")
    public Ticket marcarComoResuelto(@PathVariable Long ticketId, @PathVariable Long tecnicoId) {
        return ticketService.marcarComoResuelto(ticketId, tecnicoId);
    }

    /** Trabajador confirma o rechaza la resolución */
    @PutMapping("/{ticketId}/confirmar/{trabajadorId}")
    public Ticket confirmarResolucion(
            @PathVariable Long ticketId,
            @PathVariable Long trabajadorId,
            @RequestBody Map<String, Boolean> body) {
        boolean confirmado = body.getOrDefault("confirmado", false);
        return ticketService.confirmarResolucion(ticketId, trabajadorId, confirmado);
    }

    /** Técnico solicita reapertura de ticket */
    @PutMapping("/{ticketId}/solicitar-reapertura/{tecnicoId}")
    public Ticket solicitarReapertura(@PathVariable Long ticketId, @PathVariable Long tecnicoId) {
        return ticketService.solicitarReapertura(ticketId, tecnicoId);
    }

    /** Admin aprueba la reapertura de un ticket */
    @PutMapping("/{ticketId}/reabrir/{adminId}")
    public Ticket reabrirTicket(@PathVariable Long ticketId, @PathVariable Long adminId) {
        return ticketService.reabrirTicket(ticketId, adminId);
    }
}
