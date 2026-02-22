package com.grupo.tpFinal.controller;

import com.grupo.tpFinal.config.JwtUtil;
import com.grupo.tpFinal.dto.LoginRequest;
import com.grupo.tpFinal.dto.LoginResponse;
import com.grupo.tpFinal.dto.UsuarioDTO;
import com.grupo.tpFinal.model.Usuario;
import com.grupo.tpFinal.service.AuthService;
import com.grupo.tpFinal.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;




    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        Usuario usuario = authService.login(
                request.getEmail(),
                request.getPassword()
        );

        String token = jwtUtil.generarToken(usuario);

        return new LoginResponse(token, new UsuarioDTO(usuario));
    }

    @PostMapping("/logout")
    public void logout() {
        // placeholder
    }
}
