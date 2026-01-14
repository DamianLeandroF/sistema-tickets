package com.iset.sistema_tickets.repositorios;

import com.iset.sistema_tickets.modelo.Ticket;
import com.iset.sistema_tickets.modelo.EstadoTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
 
    List<Ticket> findByEstado(EstadoTicket estado);
    List<Ticket> findByTrabajador(com.iset.sistema_tickets.modelo.Usuario trabajador);
    List<Ticket> findByTecnicoActual(com.iset.sistema_tickets.modelo.Usuario tecnico);

    long countByTecnicoActual_IdAndEstado(Integer tecnicoId, EstadoTicket estado);
}