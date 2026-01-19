package com.grupo.tpFinal.controller;

import com.grupo.tpFinal.dto.PasswordDTO;
import com.grupo.tpFinal.enums.Rol;
import com.grupo.tpFinal.model.Usuario;
import com.grupo.tpFinal.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final UsuarioService usuarioService;

    public UserController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /**
     * Obtener perfil del usuario actual
     */
    @GetMapping("/me")
    public Usuario perfil() {
        return usuarioService.getUsuarioActual();
    }

    /**
     * Cambiar contraseña del usuario actual
     */
    @PutMapping("/change-password")
    public org.springframework.http.ResponseEntity<?> cambiarPassword(@RequestBody PasswordDTO dto) {
        try {
            usuarioService.cambiarPassword(dto);
            return org.springframework.http.ResponseEntity.ok().build();
        } catch (RuntimeException ex) {
            return org.springframework.http.ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    /**
     * Listar todos los usuarios
     */
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioService.obtenerTodos();
    }

    /**
     * Listar usuarios por rol
     */
    @GetMapping("/rol/{rol}")
    public List<Usuario> listarUsuariosPorRol(@PathVariable Rol rol) {
        return usuarioService.obtenerPorRol(rol);
    }

    /**
     * Obtener usuario por ID
     */
    @GetMapping("/{userId}")
    public Usuario obtenerUsuario(@PathVariable Long userId) {
        return usuarioService.obtenerEstadisticasTecnico(userId, 1L); // TODO: usar admin real
    }

    /**
     * ADMIN: Crear nuevo usuario
     */
    @PostMapping("/crear/{adminId}")
    public Usuario crearUsuario(@RequestBody Usuario usuario, @PathVariable Long adminId) {
        return usuarioService.crearUsuario(usuario, adminId);
    }

    /**
     * ADMIN: Bloquear usuario
     */
    @PutMapping("/{userId}/bloquear/{adminId}")
    public Usuario bloquearUsuario(@PathVariable Long userId, @PathVariable Long adminId) {
        return usuarioService.bloquearUsuario(userId, adminId);
    }

    /**
     * ADMIN: Desbloquear usuario
     */
    @PutMapping("/{userId}/desbloquear/{adminId}")
    public Usuario desbloquearUsuario(@PathVariable Long userId, @PathVariable Long adminId) {
        return usuarioService.desbloquearUsuario(userId, adminId);
    }

    /**
     * ADMIN: Blanquear contraseña (resetear a ID)
     */
    @PutMapping("/{userId}/blanquear/{adminId}")
    public Usuario blanquearPassword(@PathVariable Long userId, @PathVariable Long adminId) {
        return usuarioService.blanquearPassword(userId, adminId);
    }

    /**
     * ADMIN: Ver estadísticas de técnico
     */
    @GetMapping("/tecnico/{tecnicoId}/stats/{adminId}")
    public Usuario obtenerEstadisticasTecnico(@PathVariable Long tecnicoId, @PathVariable Long adminId) {
        return usuarioService.obtenerEstadisticasTecnico(tecnicoId, adminId);
    }

    /**
     * Actualizar contraseña (usado en primer login)
     */
    @PutMapping("/{userId}/update-password")
    public void actualizarPassword(@PathVariable Long userId, @RequestBody Map<String, String> body) {
        String newPassword = body.get("newPassword");
        usuarioService.actualizarPassword(userId, newPassword);
    }
}
