package com.grupo.tpFinal.service;

import com.grupo.tpFinal.dto.TicketsStatsDTO;
import com.grupo.tpFinal.enums.EstadoTicket;
import com.grupo.tpFinal.enums.Rol;
import com.grupo.tpFinal.model.Ticket;
import com.grupo.tpFinal.model.Usuario;
import com.grupo.tpFinal.repository.TicketRepository;
import com.grupo.tpFinal.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepo;
    
    @Autowired
    private UsuarioRepository usuarioRepo;

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

    /**
     * Crear un ticket (solo trabajadores)
     */
    public Ticket crearTicket(Ticket ticket, Long trabajadorId) {
        Usuario trabajador = usuarioRepo.findById(trabajadorId)
                .orElseThrow(() -> new RuntimeException("Trabajador no encontrado"));
        
        if (trabajador.getRol() != Rol.trabajador) {
            throw new RuntimeException("Solo los trabajadores pueden crear tickets");
        }
        
        ticket.setEstado(EstadoTicket.NO_ATENDIDO);
        ticket.setTrabajador(trabajador);
        ticket.setReabierto(false);
        return ticketRepo.save(ticket);
    }

    /**
     * Asignar ticket a técnico (máximo 3 tickets por técnico)
     */
    public Ticket asignarTicket(Long ticketId, Long tecnicoId) {
        Ticket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado"));
        
        Usuario tecnico = usuarioRepo.findById(tecnicoId)
                .orElseThrow(() -> new RuntimeException("Técnico no encontrado"));
        
        if (tecnico.getRol() != Rol.tecnico) {
            throw new RuntimeException("Solo los técnicos pueden atender tickets");
        }
        
        if (tecnico.isBloqueado()) {
            throw new RuntimeException("El técnico está bloqueado y no puede atender tickets");
        }
        
        // Verificar que el técnico no tenga más de 3 tickets asignados
        long ticketsAsignados = ticketRepo.countByTecnicoActualIdAndEstadoIn(
                tecnicoId, 
                List.of(EstadoTicket.ATENDIDO, EstadoTicket.RESUELTO)
        );
        
        if (ticketsAsignados >= 3) {
            throw new RuntimeException("El técnico ya tiene 3 tickets asignados. No puede tomar más.");
        }
        
        if (ticket.getEstado() != EstadoTicket.NO_ATENDIDO && ticket.getEstado() != EstadoTicket.REABIERTO) {
            throw new RuntimeException("El ticket ya está siendo atendido o fue finalizado");
        }
        
        ticket.setTecnicoActual(tecnico);
        ticket.setEstado(EstadoTicket.ATENDIDO);
        return ticketRepo.save(ticket);
    }

    /**
     * Marcar ticket como resuelto (solo técnico que lo atiende)
     */
    public Ticket marcarComoResuelto(Long ticketId, Long tecnicoId) {
        Ticket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado"));
        
        if (ticket.getTecnicoActual() == null || !ticket.getTecnicoActual().getId().equals(tecnicoId)) {
            throw new RuntimeException("Solo el técnico asignado puede marcar el ticket como resuelto");
        }
        
        if (ticket.getEstado() != EstadoTicket.ATENDIDO) {
            throw new RuntimeException("El ticket debe estar en estado ATENDIDO");
        }
        
        ticket.setEstado(EstadoTicket.RESUELTO);
        return ticketRepo.save(ticket);
    }

    /**
     * Confirmar resolución (trabajador que creó el ticket)
     */
    public Ticket confirmarResolucion(Long ticketId, Long trabajadorId, boolean confirmado) {
        Ticket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado"));
        
        if (!ticket.getTrabajador().getId().equals(trabajadorId)) {
            throw new RuntimeException("Solo el trabajador que creó el ticket puede confirmar la resolución");
        }
        
        if (ticket.getEstado() != EstadoTicket.RESUELTO) {
            throw new RuntimeException("El ticket debe estar en estado RESUELTO");
        }
        
        Usuario tecnico = ticket.getTecnicoActual();
        
        if (confirmado) {
            // Confirmar resolución - ticket finalizado
            ticket.setEstado(EstadoTicket.FINALIZADO);
            
            // Si el ticket fue reabierto y se resuelve, limpiar una falla del técnico
            if (ticket.isReabierto() && tecnico != null && tecnico.getFallas() > 0) {
                tecnico.setFallas(tecnico.getFallas() - 1);
                usuarioRepo.save(tecnico);
            }
        } else {
            // No confirmar - ticket reabierto
            ticket.setEstado(EstadoTicket.REABIERTO);
            ticket.setReabierto(true);
            ticket.setTecnicoAnterior(tecnico);
            ticket.setTecnicoActual(null);
            
            // Marcar falla al técnico
            if (tecnico != null) {
                tecnico.setFallas(tecnico.getFallas() + 1);
                
                // Bloquear si alcanza 3 fallas
                if (tecnico.getFallas() >= 3) {
                    tecnico.setBloqueado(true);
                }
                
                usuarioRepo.save(tecnico);
            }
        }
        
        return ticketRepo.save(ticket);
    }

    /**
     * Solicitar reapertura de ticket (técnico)
     */
    public Ticket solicitarReapertura(Long ticketId, Long tecnicoId) {
        Ticket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado"));
        
        Usuario tecnico = usuarioRepo.findById(tecnicoId)
                .orElseThrow(() -> new RuntimeException("Técnico no encontrado"));
        
        if (!ticket.getTecnicoActual().getId().equals(tecnicoId)) {
            throw new RuntimeException("Solo el técnico asignado puede solicitar reapertura");
        }
        
        if (ticket.getEstado() != EstadoTicket.ATENDIDO) {
            throw new RuntimeException("El ticket debe estar en estado ATENDIDO");
        }
        
        // Gestionar marcas y fallas
        if (tecnico.getMarcasRetorno() > 0) {
            // Si ya tiene una marca, se borra y recibe una falla
            tecnico.setMarcasRetorno(0);
            tecnico.setFallas(tecnico.getFallas() + 1);
            
            // Bloquear si alcanza 3 fallas
            if (tecnico.getFallas() >= 3) {
                tecnico.setBloqueado(true);
            }
        } else {
            // Primera vez, solo recibe una marca
            tecnico.setMarcasRetorno(1);
        }
        
        usuarioRepo.save(tecnico);
        
        // Nota: El administrador debe aprobar esta solicitud
        // Por ahora, solo marcamos la solicitud en el sistema
        // Se podría agregar un campo "solicitudReapertura" en el modelo Ticket
        
        return ticket;
    }

    /**
     * Reabrir ticket (administrador)
     */
    public Ticket reabrirTicket(Long ticketId, Long adminId) {
        Usuario admin = usuarioRepo.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (admin.getRol() != Rol.admin) {
            throw new RuntimeException("Solo los administradores pueden reabrir tickets");
        }
        
        Ticket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket no encontrado"));
        
        if (ticket.getEstado() != EstadoTicket.ATENDIDO && ticket.getEstado() != EstadoTicket.RESUELTO) {
            throw new RuntimeException("El ticket debe estar en estado ATENDIDO o RESUELTO");
        }
        
        Usuario tecnicoActual = ticket.getTecnicoActual();
        
        ticket.setEstado(EstadoTicket.REABIERTO);
        ticket.setReabierto(true);
        ticket.setTecnicoAnterior(tecnicoActual);
        ticket.setTecnicoActual(null);
        
        return ticketRepo.save(ticket);
    }

    public Ticket cambiarEstado(Long id, EstadoTicket estado) {
        Ticket t = ticketRepo.findById(id).orElseThrow();
        t.setEstado(estado);
        return ticketRepo.save(t);
    }

    public TicketsStatsDTO obtenerEstadisticas() {
        long total = ticketRepo.count();
        long noAtendidos = ticketRepo.countByEstado(EstadoTicket.NO_ATENDIDO);
        long atendidos = ticketRepo.countByEstado(EstadoTicket.ATENDIDO);
        long resueltos = ticketRepo.countByEstado(EstadoTicket.RESUELTO);
        long finalizados = ticketRepo.countByEstado(EstadoTicket.FINALIZADO);
        long reabiertos = ticketRepo.countByEstado(EstadoTicket.REABIERTO);

        return new TicketsStatsDTO(total, noAtendidos, atendidos, resueltos, finalizados, reabiertos);
    }
}
