package com.iset.sistema_tickets.controladores;

import com.iset.sistema_tickets.dto.ChangePasswordRequest;
import com.iset.sistema_tickets.dto.LoginRequest;
import com.iset.sistema_tickets.dto.LoginResponse;
import com.iset.sistema_tickets.dto.UsuarioDTO;
import com.iset.sistema_tickets.modelo.Usuario;
import com.iset.sistema_tickets.servicios.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Usuario user = usuarioService.login(loginRequest.getUserId(), loginRequest.getPassword());
            
            // Generar token simulado (en producción usar JWT)
            String token = UUID.randomUUID().toString();
            
            UsuarioDTO userDTO = new UsuarioDTO(
                user.getId(), 
                user.getNombre(), 
                user.getEmail(), 
                user.getTipo()
            );

            return ResponseEntity.ok(new LoginResponse(token, userDTO));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        // TODO: Validar token y usuario actual (esto requiere contexto de seguridad)
        // Por simplicidad, asumiremos que se pasa el ID en el request o similar en una app real
        // Aquí solo simulamos que funciona si sabemos el ID, pero el request no tiene ID.
        // Modificaremos ChangePasswordRequest para incluir userId por ahora para pruebas simples.
        
        return ResponseEntity.ok("Funcionalidad pendiente de implementar con seguridad completa");
    }
    
    // Endpoint temporal para cambiar password con ID
    @PostMapping("/change-password/{userId}")
    public ResponseEntity<?> changePasswordWithId(@PathVariable Integer userId, @RequestBody ChangePasswordRequest request) {
        try {
            // Verificar password anterior
            Usuario user = usuarioService.login(String.valueOf(userId), request.getCurrentPassword());
            usuarioService.actualizarPassword(userId, request.getNewPassword());
            return ResponseEntity.ok("Contraseña actualizada correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
