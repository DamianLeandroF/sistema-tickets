package com.iset.sistema_tickets.controladores;

import com.iset.sistema_tickets.dto.UsuarioDTO;
import com.iset.sistema_tickets.modelo.Usuario;
import com.iset.sistema_tickets.repositorios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private com.iset.sistema_tickets.servicios.UsuarioService usuarioService;

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

    @PostMapping
    public ResponseEntity<?> crearUsuario(@RequestBody Usuario body) {
        try {
            Usuario creado = usuarioService.crearUsuario(body.getId(), body.getNombre(), body.getEmail(), body.getTipo());
            return ResponseEntity.ok(convertToDTO(creado));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/block")
    public ResponseEntity<?> bloquear(@PathVariable Integer id) {
        try {
            Usuario u = usuarioService.bloquear(id);
            return ResponseEntity.ok(convertToDTO(u));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/unblock")
    public ResponseEntity<?> desbloquear(@PathVariable Integer id) {
        try {
            Usuario u = usuarioService.desbloquear(id);
            return ResponseEntity.ok(convertToDTO(u));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable Integer id) {
        usuarioService.resetearPassword(id);
        return ResponseEntity.ok("Password reseteada");
    }

    private UsuarioDTO convertToDTO(Usuario user) {
        return new UsuarioDTO(
            user.getId(), 
            user.getNombre(), 
            user.getEmail(), 
            user.getTipo(),
            user.getFallas(),
            user.getMarcasRetorno()
        );
    }
}
