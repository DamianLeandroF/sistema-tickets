package com.grupo.tpFinal.controller;

import com.grupo.tpFinal.dto.LoginRequest;
import com.grupo.tpFinal.dto.LoginResponse;
import com.grupo.tpFinal.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return usuarioService.login(request);
    }

    @PostMapping("/logout")
    public void logout() {
        // El logout se maneja en el frontend eliminando el token
    }
}