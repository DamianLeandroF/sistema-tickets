package com.iset.sistema_tickets;

import com.iset.sistema_tickets.modelo.*;
import com.iset.sistema_tickets.servicios.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SistemaTicketsApplication {

    public static void main(String[] args) {
        SpringApplication.run(SistemaTicketsApplication.class, args);
    }

    /*
    @Bean
    CommandLineRunner test(UsuarioService uServ, TicketService tServ) {
        return args -> {
            System.out.println("--- INICIANDO PRUEBA DE LÓGICA ---");

            // 1. Probar creación de un técnico 
            // Simulamos que el admin crea un técnico con ID 200
            uServ.resetearPassword(200); 
            System.out.println("Técnico creado con contraseña inicial: 200 ");

            // 2. Probar la regla de las 3 fallas 
            // Vamos a simular que el técnico falla 3 veces
            for(int i=0; i<3; i++) {
                // Simulamos una falla en la confirmación [cite: 18]
                // Aquí deberías tener un ticket de prueba guardado para testear tServ.procesarConfirmacion
            }
            
            System.out.println("--- PRUEBA FINALIZADA CON ÉXITO ---");
        };
    }
    */
}