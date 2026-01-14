package com.iset.sistema_tickets.config;

import com.iset.sistema_tickets.modelo.EstadoTicket;
import com.iset.sistema_tickets.modelo.Ticket;
import com.iset.sistema_tickets.modelo.Usuario;
import com.iset.sistema_tickets.repositorios.TicketRepository;
import com.iset.sistema_tickets.repositorios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Override
    public void run(String... args) throws Exception {
        if (!usuarioRepository.existsById(1)) {
            System.out.println("Inicializando datos de prueba...");

            // Crear usuarios
            Usuario admin = new Usuario();
            admin.setId(1);
            admin.setNombre("Administrador");
            admin.setEmail("admin@iset.com");
            admin.setPassword("admin123");
            admin.setTipo("admin");
            admin.setBloqueado(false);
            admin.setForzarCambio(false);

            Usuario tecnico1 = new Usuario();
            tecnico1.setId(2);
            tecnico1.setNombre("Juan Técnico");
            tecnico1.setEmail("juan@iset.com");
            tecnico1.setPassword("tecnico123");
            tecnico1.setTipo("tecnico");
            tecnico1.setBloqueado(false);
            tecnico1.setForzarCambio(false);

            Usuario trabajador1 = new Usuario();
            trabajador1.setId(3);
            trabajador1.setNombre("Pedro Trabajador");
            trabajador1.setEmail("pedro@iset.com");
            trabajador1.setPassword("trabajador123");
            trabajador1.setTipo("trabajador");
            trabajador1.setBloqueado(false);
            trabajador1.setForzarCambio(false);

            usuarioRepository.saveAll(Arrays.asList(admin, tecnico1, trabajador1));

            // Crear tickets
            Ticket t1 = new Ticket("Fallo en impresora", "La impresora del segundo piso no conecta", EstadoTicket.PENDIENTE, trabajador1);
            Ticket t2 = new Ticket("No hay internet", "Sin conexión en la oficina 304", EstadoTicket.EN_PROCESO, trabajador1);
            t2.setTecnicoActual(tecnico1);
            
            Ticket t3 = new Ticket("Instalar Office", "Requiero licencia de Office", EstadoTicket.RESUELTO, trabajador1);
            t3.setTecnicoActual(tecnico1);

            ticketRepository.saveAll(Arrays.asList(t1, t2, t3));
            
            System.out.println("Datos inicializados correctamente.");
        }
    }
}
