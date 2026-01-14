package com.iset.sistema_tickets.servicios;

import com.iset.sistema_tickets.modelo.EstadoTicket;
import com.iset.sistema_tickets.modelo.Ticket;
import com.iset.sistema_tickets.modelo.Usuario;
import com.iset.sistema_tickets.repositorios.TicketRepository;
import com.iset.sistema_tickets.repositorios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Ticket> listarTodos() {
        return ticketRepository.findAll();
    }

    public List<Ticket> listarPorTrabajador(Integer trabajadorId) {
        Usuario trabajador = usuarioRepository.findById(trabajadorId).orElse(null);
        if (trabajador == null) return List.of();
        return ticketRepository.findByTrabajador(trabajador).stream()
                .filter(t -> t.getEstado() != EstadoTicket.FINALIZADO)
                .toList();
    }

    public List<Ticket> listarPorTecnico(Integer tecnicoId) {
        Usuario tecnico = usuarioRepository.findById(tecnicoId).orElse(null);
        if (tecnico == null) return List.of();
        return ticketRepository.findByTecnicoActual(tecnico);
    }

    public Ticket crearTicket(String titulo, String descripcion, Integer trabajadorId) throws Exception {
        Usuario trabajador = usuarioRepository.findById(trabajadorId)
                .orElseThrow(() -> new Exception("Trabajador no encontrado"));
        if (!"trabajador".equals(trabajador.getTipo())) {
            throw new Exception("Solo un trabajador puede crear tickets");
        }
        
        Ticket ticket = new Ticket(titulo, descripcion, EstadoTicket.PENDIENTE, trabajador);
        return ticketRepository.save(ticket);
    }

    public Ticket asignarTecnico(Long ticketId, Integer tecnicoId) throws Exception {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new Exception("Ticket no encontrado"));
        
        Usuario tecnico = usuarioRepository.findById(tecnicoId)
                .orElseThrow(() -> new Exception("Técnico no encontrado"));
        
        if (!"tecnico".equals(tecnico.getTipo())) {
            throw new Exception("El usuario asignado no es un técnico");
        }

        if (tecnico.isBloqueado()) {
            throw new Exception("Técnico bloqueado");
        }

        long atendiendo = ticketRepository.countByTecnicoActual_IdAndEstado(tecnicoId, EstadoTicket.EN_PROCESO);
        if (atendiendo >= 3) {
            throw new Exception("El técnico ya atiende 3 tickets");
        }

        ticket.setTecnicoActual(tecnico);
        ticket.setEstado(EstadoTicket.EN_PROCESO);
        return ticketRepository.save(ticket);
    }

    public Ticket cambiarEstado(Long ticketId, String nuevoEstado) throws Exception {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new Exception("Ticket no encontrado"));
        
        EstadoTicket estadoEnum;
        try {
            estadoEnum = EstadoTicket.valueOf(nuevoEstado.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new Exception("Estado inválido: " + nuevoEstado);
        }

        if (estadoEnum == EstadoTicket.EN_PROCESO) {
            throw new Exception("Para atender un ticket use el endpoint de asignación de técnico");
        } else if (estadoEnum == EstadoTicket.REABIERTO) {
            if (ticket.getTecnicoActual() != null) {
                Usuario tecnico = ticket.getTecnicoActual();
                tecnico.setFallas(tecnico.getFallas() + 1);
                if (tecnico.getFallas() >= 3) {
                    tecnico.setBloqueado(true);
                }
                usuarioRepository.save(tecnico);
                ticket.setTecnicoAnterior(tecnico);
            }
            ticket.setTecnicoActual(null);
            ticket.setReabierto(true);
            ticket.setEstado(EstadoTicket.REABIERTO);
        } else if (estadoEnum == EstadoTicket.RESUELTO) {
            if (ticket.getEstado() == EstadoTicket.REABIERTO && ticket.getTecnicoActual() != null) {
                Usuario tecnico = ticket.getTecnicoActual();
                if (tecnico.getFallas() > 0) {
                    tecnico.setFallas(tecnico.getFallas() - 1);
                    usuarioRepository.save(tecnico);
                }
            }
            ticket.setEstado(EstadoTicket.RESUELTO);
        } else if (estadoEnum == EstadoTicket.FINALIZADO) {
            ticket.setEstado(EstadoTicket.FINALIZADO);
            ticket.setReabierto(false);
        } else {
            ticket.setEstado(estadoEnum);
        }
        
        return ticketRepository.save(ticket);
    }

    public Ticket reabrirPorAdmin(Long ticketId) throws Exception {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new Exception("Ticket no encontrado"));

        if (ticket.getTecnicoActual() != null) {
            Usuario tecnico = ticket.getTecnicoActual();
            if (tecnico.getMarcasRetorno() == 0) {
                tecnico.setMarcasRetorno(1);
            } else {
                tecnico.setMarcasRetorno(tecnico.getMarcasRetorno() - 1);
                tecnico.setFallas(tecnico.getFallas() + 1);
                if (tecnico.getFallas() >= 3) {
                    tecnico.setBloqueado(true);
                }
            }
            usuarioRepository.save(tecnico);
            ticket.setTecnicoAnterior(tecnico);
        }

        ticket.setTecnicoActual(null);
        ticket.setReabierto(true);
        ticket.setEstado(EstadoTicket.REABIERTO);
        return ticketRepository.save(ticket);
    }

    public Ticket obtenerPorId(Long id) throws Exception {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new Exception("Ticket no encontrado"));
    }

    public Ticket guardar(Ticket ticket) {
        return ticketRepository.save(ticket);
    }
}
