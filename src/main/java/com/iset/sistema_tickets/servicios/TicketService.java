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
        return ticketRepository.findByTrabajador(trabajador);
    }

    public List<Ticket> listarPorTecnico(Integer tecnicoId) {
        Usuario tecnico = usuarioRepository.findById(tecnicoId).orElse(null);
        if (tecnico == null) return List.of();
        return ticketRepository.findByTecnicoActual(tecnico);
    }

    public Ticket crearTicket(String titulo, String descripcion, Integer trabajadorId) throws Exception {
        Usuario trabajador = usuarioRepository.findById(trabajadorId)
                .orElseThrow(() -> new Exception("Trabajador no encontrado"));
        
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

        ticket.setTecnicoActual(tecnico);
        ticket.setEstado(EstadoTicket.EN_PROCESO);
        return ticketRepository.save(ticket);
    }

    public Ticket cambiarEstado(Long ticketId, String nuevoEstado) throws Exception {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new Exception("Ticket no encontrado"));
        
        try {
            EstadoTicket estadoEnum = EstadoTicket.valueOf(nuevoEstado.toUpperCase());
            ticket.setEstado(estadoEnum);
        } catch (IllegalArgumentException e) {
            throw new Exception("Estado inválido: " + nuevoEstado);
        }
        
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
