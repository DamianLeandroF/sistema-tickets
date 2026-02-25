package com.grupo.tpFinal.config;

import com.grupo.tpFinal.enums.EstadoTicket;
import com.grupo.tpFinal.enums.Rol;
import com.grupo.tpFinal.model.Ticket;
import com.grupo.tpFinal.model.Usuario;
import com.grupo.tpFinal.repository.TicketRepository;
import com.grupo.tpFinal.repository.UsuarioRepository;
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
        // Crear usuarios solo si no existen
        if (usuarioRepository.findByEmail("admin@iset.com").isEmpty()) {
            System.out.println("Inicializando datos de prueba...");

            // Crear usuarios
            Usuario admin = new Usuario();
            admin.setNombre("Administrador");
            admin.setEmail("admin@iset.com");
            admin.setPassword("1");
            admin.setRol(Rol.admin);
            admin.setBloqueado(false);
            admin.setForzarCambio(false);

            Usuario tecnico1 = new Usuario();
            tecnico1.setNombre("Juan Técnico");
            tecnico1.setEmail("juan@iset.com");
            tecnico1.setPassword("2");
            tecnico1.setRol(Rol.tecnico);
            tecnico1.setBloqueado(false);
            tecnico1.setForzarCambio(false);

            Usuario trabajador1 = new Usuario();
            trabajador1.setNombre("Pedro Trabajador");
            trabajador1.setEmail("pedro@iset.com");
            trabajador1.setPassword("3");
            trabajador1.setRol(Rol.trabajador);
            trabajador1.setBloqueado(false);
            trabajador1.setForzarCambio(false);

            usuarioRepository.saveAll(Arrays.asList(admin, tecnico1, trabajador1));

            // Crear tickets de ejemplo
            Ticket t1 = new Ticket("Fallo en impresora", "La impresora del segundo piso no conecta", EstadoTicket.NO_ATENDIDO, trabajador1);
            Ticket t2 = new Ticket("No hay internet", "Sin conexión en la oficina 304", EstadoTicket.ATENDIDO, trabajador1);
            t2.setTecnicoActual(tecnico1);
            
            Ticket t3 = new Ticket("Instalar Office", "Requiero licencia de Office", EstadoTicket.RESUELTO, trabajador1);
            t3.setTecnicoActual(tecnico1);

            ticketRepository.saveAll(Arrays.asList(t1, t2, t3));
            
            System.out.println("Datos inicializados correctamente.");
            System.out.println("Usuarios creados:");
            System.out.println("- Admin: admin@iset.com / password: 1");
            System.out.println("- Técnico: juan@iset.com / password: 2");
            System.out.println("- Trabajador: pedro@iset.com / password: 3");
        } else {
            System.out.println("Usuarios ya existen en la base de datos.");
        }
    }
}
