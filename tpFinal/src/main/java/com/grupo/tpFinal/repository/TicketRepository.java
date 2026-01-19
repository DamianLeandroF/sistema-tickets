package com.grupo.tpFinal.repository;

import com.grupo.tpFinal.enums.EstadoTicket;
import com.grupo.tpFinal.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    long countByEstado(EstadoTicket estado);
    
    List<Ticket> findByEstado(EstadoTicket estado);
    
    List<Ticket> findByTrabajadorIdAndEstadoNot(Long trabajadorId, EstadoTicket estado);
    
    List<Ticket> findByTecnicoActualId(Long tecnicoId);
    
    long countByTecnicoActualIdAndEstadoIn(Long tecnicoId, List<EstadoTicket> estados);
}
