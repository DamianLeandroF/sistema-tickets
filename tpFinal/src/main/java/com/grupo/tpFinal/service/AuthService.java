package com.grupo.tpFinal.service;

import com.grupo.tpFinal.model.Usuario;
import com.grupo.tpFinal.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

        @Autowired
        private UsuarioRepository usuarioRepository;


        public Usuario login(String email, String password) {


            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            if (!usuario.getPassword().equals(password)) {
                throw new RuntimeException("Credenciales inválidas");
            }

            return usuario;
        }
    }

