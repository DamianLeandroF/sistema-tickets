package com.grupo.tpFinal.service;

import com.grupo.tpFinal.dto.TicketCreateRequest;
import com.grupo.tpFinal.dto.TicketsStatsDTO;
import com.grupo.tpFinal.enums.EstadoTicket;
import com.grupo.tpFinal.enums.Rol;
import com.grupo.tpFinal.model.Ticket;
import com.grupo.tpFinal.model.Usuario;
import com.grupo.tpFinal.repository.TicketRepository;
import com.grupo.tpFinal.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepo;

    @Autowired
    private UsuarioRepository usuarioRepo;

    // --- TRABAJADOR CREA TICKET ---
    public Ticket crearTicket(TicketCreateRequest dto, Long trabajadorId) {
        Usuario trabajador = usuarioRepo.findById(trabajadorId)
                .orElseThrow(() -> new RuntimeException("Trabajador no encontrado"));

        if (trabajador.getRol() != Rol.trabajador) {
            throw new RuntimeException("Solo los trabajadores pueden crear tickets.");
        }

        Ticket ticket = new Ticket();
        ticket.setTitulo(dto.getTitulo());
        ticket.setDescripcion(dto.getDescripcion());
        ticket.setEstado(EstadoTicket.NO_ATENDIDO);
        ticket.setTrabajador(trabajador);
        ticket.setReabierto(false);
        return ticketRepo.save(ticket);
    }

    // --- TÉCNICO TOMA TICKET (MÁX 3) ---
    public Ticket asignarTicket(Long ticketId, Long tecnicoId) {
        Usuario tecnico = usuarioRepo.findById(tecnicoId)
                .orElseThrow(() -> new RuntimeException("Técnico no encontrado"));

        long atendidos = ticketRepo.countByTecnicoActualIdAndEstadoIn(tecnicoId,
                List.of(EstadoTicket.ATENDIDO, EstadoTicket.RESUELTO));
        if (atendidos >= 3) {
            throw new RuntimeException("El técnico ya tiene 3 tickets asignados. No puede tomar más.");
        }

        Ticket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado"));

        if (ticket.getEstado() != EstadoTicket.NO_ATENDIDO && ticket.getEstado() != EstadoTicket.REABIERTO) {
            throw new RuntimeException("El ticket ya está siendo atendido o fue finalizado.");
        }

        ticket.setTecnicoActual(tecnico);
        ticket.setEstado(EstadoTicket.ATENDIDO);
        return ticketRepo.save(ticket);
    }

    // --- TÉCNICO MARCA COMO RESUELTO ---
    public Ticket marcarComoResuelto(Long ticketId, Long tecnicoId) {
        Ticket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado"));

        if (ticket.getTecnicoActual() == null || !ticket.getTecnicoActual().getId().equals(tecnicoId)) {
            throw new RuntimeException("Solo el técnico asignado puede marcar el ticket como resuelto.");
        }
        if (ticket.getEstado() != EstadoTicket.ATENDIDO) {
            throw new RuntimeException("El ticket debe estar en estado ATENDIDO para poder resolverse.");
        }

        ticket.setEstado(EstadoTicket.RESUELTO);
        return ticketRepo.save(ticket);
    }

    // --- CONFIRMACIÓN O RECHAZO (TRABAJADOR) ---
    @Transactional
    public Ticket confirmarResolucion(Long ticketId, Long trabajadorId, boolean confirmado) {
        Ticket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado"));

        if (!ticket.getTrabajador().getId().equals(trabajadorId)) {
            throw new RuntimeException("Solo el trabajador que creó el ticket puede confirmar su resolución.");
        }
        if (ticket.getEstado() != EstadoTicket.RESUELTO) {
            throw new RuntimeException("El ticket debe estar en estado RESUELTO para confirmarse.");
        }

        Usuario tecnico = ticket.getTecnicoActual();

        if (confirmado) {
            ticket.setEstado(EstadoTicket.FINALIZADO);
            // Si fue reabierto y se resuelve, se le limpia una falla al técnico
            if (ticket.isReabierto() && tecnico != null && tecnico.getFallas() > 0) {
                tecnico.setFallas(tecnico.getFallas() - 1);
                if (tecnico.getFallas() < 3) {
                    tecnico.setBloqueado(false);
                }
                usuarioRepo.save(tecnico);
            }
        } else {
            // Trabajador rechaza: falla al técnico y ticket vuelve a REABIERTO
            ticket.setEstado(EstadoTicket.REABIERTO);
            ticket.setReabierto(true);
            ticket.setTecnicoAnterior(tecnico);
            ticket.setTecnicoActual(null);
            if (tecnico != null) {
                aplicarFalla(tecnico);
            }
        }
        return ticketRepo.save(ticket);
    }

    // --- TÉCNICO SOLICITA REAPERTURA (MARCAS DE RETORNO) ---
    @Transactional
    public Ticket solicitarReapertura(Long ticketId, Long tecnicoId) {
        Ticket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado"));
        Usuario tecnico = usuarioRepo.findById(tecnicoId)
                .orElseThrow(() -> new RuntimeException("Técnico no encontrado"));

        if (ticket.getEstado() != EstadoTicket.ATENDIDO) {
            throw new RuntimeException("Solo se puede solicitar reapertura de un ticket en estado ATENDIDO.");
        }

        // Guardar al técnico como "anterior" ANTES de desasignarlo
        ticket.setTecnicoAnterior(tecnico);

        // Si ya tenía una marca, se borra y recibe una falla
        if (tecnico.getMarcasRetorno() > 0) {
            tecnico.setMarcasRetorno(0);
            aplicarFalla(tecnico);
        } else {
            tecnico.setMarcasRetorno(1);
            usuarioRepo.save(tecnico);
        }

        ticket.setEstado(EstadoTicket.SOLICITUD_REAPERTURA);
        ticket.setTecnicoActual(null);
        return ticketRepo.save(ticket);
    }

    // --- ADMIN APRUEBA REAPERTURA ---
    public Ticket reabrirTicket(Long ticketId, Long adminId) {
        Ticket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado"));

        if (ticket.getEstado() != EstadoTicket.SOLICITUD_REAPERTURA) {
            throw new RuntimeException("El ticket debe estar en estado SOLICITUD_REAPERTURA para reabrirse.");
        }

        ticket.setEstado(EstadoTicket.REABIERTO);
        ticket.setReabierto(true);
        return ticketRepo.save(ticket);
    }

    // --- CONSULTAS ---
    public List<Ticket> obtenerTickets() {
        return ticketRepo.findAll();
    }

    public List<Ticket> obtenerTicketsPorEstado(EstadoTicket estado) {
        return ticketRepo.findByEstado(estado);
    }

    public List<Ticket> obtenerTicketsPorTrabajador(Long trabajadorId) {
        return ticketRepo.findByTrabajadorIdAndEstadoNot(trabajadorId, EstadoTicket.FINALIZADO);
    }

    public List<Ticket> obtenerTicketsPorTecnico(Long tecnicoId) {
        return ticketRepo.findByTecnicoActualId(tecnicoId);
    }

    public TicketsStatsDTO obtenerEstadisticas() {
        return new TicketsStatsDTO(
                ticketRepo.count(),
                ticketRepo.countByEstado(EstadoTicket.NO_ATENDIDO),
                ticketRepo.countByEstado(EstadoTicket.ATENDIDO),
                ticketRepo.countByEstado(EstadoTicket.RESUELTO),
                ticketRepo.countByEstado(EstadoTicket.FINALIZADO),
                ticketRepo.countByEstado(EstadoTicket.REABIERTO),
                ticketRepo.countByEstado(EstadoTicket.SOLICITUD_REAPERTURA)
        );
    }

    // --- HELPER PRIVADO ---
    private void aplicarFalla(Usuario tecnico) {
        tecnico.setFallas(tecnico.getFallas() + 1);
        if (tecnico.getFallas() >= 3) {
            tecnico.setBloqueado(true);
        }
        usuarioRepo.save(tecnico);
    }
}