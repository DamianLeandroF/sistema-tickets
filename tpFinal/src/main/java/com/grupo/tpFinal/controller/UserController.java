package com.grupo.tpFinal.controller;

import com.grupo.tpFinal.dto.PasswordDTO;
import com.grupo.tpFinal.enums.Rol;
import com.grupo.tpFinal.model.Usuario;
import com.grupo.tpFinal.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UsuarioService usuarioService;

    /** Perfil del usuario autenticado (desde token JWT) */
    @GetMapping("/me")
    public Usuario perfil() {
        return usuarioService.getUsuarioActual();
    }

    /** Cambiar constraseña (cualquier usuario autenticado) */
    @PutMapping("/change-password")
    public void cambiarPassword(@RequestBody PasswordDTO dto) {
        // Los errores son manejados automáticamente por GlobalExceptionHandler
        usuarioService.cambiarPassword(dto);
    }

    /** Listar todos los usuarios */
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioService.obtenerTodos();
    }

    /** Listar usuarios por rol */
    @GetMapping("/rol/{rol}")
    public List<Usuario> listarUsuariosPorRol(@PathVariable Rol rol) {
        return usuarioService.obtenerPorRol(rol);
    }

    /** Obtener un usuario por su ID */
    @GetMapping("/{userId}")
    public Usuario obtenerUsuario(@PathVariable Long userId) {
        return usuarioService.obtenerUsuarioPorId(userId);
    }

    /** ADMIN: Crear nuevo usuario */
    @PostMapping("/crear/{adminId}")
    public Usuario crearUsuario(@RequestBody Usuario usuario, @PathVariable Long adminId) {
        return usuarioService.crearUsuario(usuario, adminId);
    }

    /** ADMIN: Bloquear usuario */
    @PutMapping("/{userId}/bloquear/{adminId}")
    public Usuario bloquearUsuario(@PathVariable Long userId, @PathVariable Long adminId) {
        return usuarioService.bloquearUsuario(userId, adminId);
    }

    /** ADMIN: Desbloquear usuario y resetear fallas */
    @PutMapping("/{userId}/desbloquear/{adminId}")
    public Usuario desbloquearUsuario(@PathVariable Long userId, @PathVariable Long adminId) {
        return usuarioService.desbloquearUsuario(userId, adminId);
    }

    /** ADMIN: Blanquear contraseña (resetear al ID del usuario) */
    @PutMapping("/{userId}/blanquear/{adminId}")
    public Usuario blanquearPassword(@PathVariable Long userId, @PathVariable Long adminId) {
        return usuarioService.blanquearPassword(userId, adminId);
    }

    /** ADMIN: Modificar fallas de un técnico */
    @PutMapping("/{userId}/fallas/{adminId}")
    public Usuario modificarFallasTecnico(
            @PathVariable("userId") Long tecnicoId,
            @PathVariable Long adminId,
            @RequestParam int cantidad) {
        return usuarioService.modificarFallas(tecnicoId, adminId, cantidad);
    }

    /** ADMIN: Modificar marcas de retorno de un técnico */
    @PutMapping("/{userId}/marcas-retorno/{adminId}")
    public Usuario modificarMarcasTecnico(
            @PathVariable("userId") Long tecnicoId,
            @PathVariable Long adminId,
            @RequestParam int cantidad) {
        return usuarioService.modificarMarcas(tecnicoId, adminId, cantidad);
    }

    /** Actualizar contraseña por ID (usado en primer login forzado) */
    @PutMapping("/{userId}/update-password")
    public void actualizarPassword(@PathVariable Long userId, @RequestBody Map<String, String> body) {
        usuarioService.actualizarPassword(userId, body.get("newPassword"));
    }
}
