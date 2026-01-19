package com.grupo.tpFinal.controller;

import com.grupo.tpFinal.dto.LoginRequest;
import com.grupo.tpFinal.dto.LoginResponse;
import com.grupo.tpFinal.dto.UsuarioDTO;
import com.grupo.tpFinal.model.Usuario;
import com.grupo.tpFinal.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Usuario user = usuarioService.login(request);
            
            // Generar token simulado (en producción usar JWT)
            String token = UUID.randomUUID().toString();
            
            UsuarioDTO userDTO = new UsuarioDTO(
                user.getId(), 
                user.getNombre(), 
                user.getEmail(), 
                user.getRol().toString(),
                user.getFallas(),
                user.getMarcasRetorno(),
                user.isForzarCambio(),
                user.isBloqueado()
            );

            return ResponseEntity.ok(new LoginResponse(token, userDTO));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public void logout() {
        // placeholder
    }
}
