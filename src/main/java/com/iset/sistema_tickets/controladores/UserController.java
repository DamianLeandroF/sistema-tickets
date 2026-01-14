package com.iset.sistema_tickets.controladores;

import com.iset.sistema_tickets.dto.UsuarioDTO;
import com.iset.sistema_tickets.modelo.Usuario;
import com.iset.sistema_tickets.repositorios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/tecnicos")
    public ResponseEntity<List<UsuarioDTO>> listarTecnicos() {
        List<Usuario> tecnicos = usuarioRepository.findByTipo("tecnico");
        return ResponseEntity.ok(tecnicos.stream().map(this::convertToDTO).collect(Collectors.toList()));
    }
    
    @GetMapping("/trabajadores")
    public ResponseEntity<List<UsuarioDTO>> listarTrabajadores() {
        List<Usuario> trabajadores = usuarioRepository.findByTipo("trabajador");
        return ResponseEntity.ok(trabajadores.stream().map(this::convertToDTO).collect(Collectors.toList()));
    }

    private UsuarioDTO convertToDTO(Usuario user) {
        return new UsuarioDTO(
            user.getId(), 
            user.getNombre(), 
            user.getEmail(), 
            user.getTipo()
        );
    }
}
