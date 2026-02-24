package com.grupo.tpFinal.service;

import com.grupo.tpFinal.config.JwtUtil;
import com.grupo.tpFinal.dto.LoginRequest;
import com.grupo.tpFinal.dto.PasswordDTO;
import com.grupo.tpFinal.enums.Rol;
import com.grupo.tpFinal.model.Usuario;
import com.grupo.tpFinal.repository.UsuarioRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private HttpServletRequest request;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // -------------------------------
    // GET /users/me
    // -------------------------------

    public Usuario getUsuarioActual() {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token no presente");
        }

        String token = authHeader.substring(7);

        Claims claims = jwtUtil.obtenerClaims(token);

        Long userId = claims.get("id", Long.class);

        return usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    // -------------------------------
    // PUT /users/change-password
    // -------------------------------

    public void cambiarPassword(PasswordDTO dto) {
        Usuario usuario = getUsuarioActual();

        if (!usuario.getPassword().equals(dto.getPasswordActual())) {
            throw new RuntimeException("La contraseña actual es incorrecta");
        }

        usuario.setPassword(dto.getPasswordNueva());
        usuario.setForzarCambio(false);
        usuarioRepository.save(usuario);
    }

    // -------------------------------
    // GET /users
    // -------------------------------

    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> obtenerPorRol(Rol rol) {
        return usuarioRepository.findByRol(rol);
    }

    public Usuario login(LoginRequest request) {
        // Buscar usuario por email o por ID
        Usuario usuario = null;
        
        // Intentar buscar por email primero
        usuario = usuarioRepository.findByEmail(request.getEmail()).orElse(null);
        
        // Si no se encontró por email, intentar por ID
        if (usuario == null) {
            try {
                Long id = Long.parseLong(request.getEmail());
                usuario = usuarioRepository.findById(id).orElse(null);
            } catch (NumberFormatException e) {
                // No es un número, continuar
            }
        }
        
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        // Verificar si está bloqueado
        if (usuario.isBloqueado()) {
            throw new RuntimeException("Usuario bloqueado. Contacte al administrador.");
        }
        
        // Validar contraseña
        if (!usuario.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        if (usuario.getPassword().equals(usuario.getId().toString())) {
        usuario.setForzarCambio(true);
        usuarioRepository.save(usuario); 
    }
        return usuario;
    }

    public void actualizarPassword(Long userId, String newPassword) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setPassword(newPassword);
        usuario.setForzarCambio(false);
        usuarioRepository.save(usuario);
    }

    // -------------------------------
    // ADMIN: Crear usuario
    // -------------------------------

    public Usuario crearUsuario(Usuario usuario, Long adminId) {
        Usuario admin = usuarioRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
        
        if (admin.getRol() != Rol.admin) {
            throw new RuntimeException("Solo los administradores pueden crear usuarios");
        }
        
        // La contraseña inicial es igual al ID (se establecerá después de guardar)
        usuario.setForzarCambio(true);
        usuario.setBloqueado(false);
        usuario.setFallas(0);
        usuario.setMarcasRetorno(0);
        
        Usuario nuevoUsuario = usuarioRepository.save(usuario);
        
        // Establecer password igual al ID
        nuevoUsuario.setPassword(nuevoUsuario.getId().toString());
        return usuarioRepository.save(nuevoUsuario);
    }

    // -------------------------------
    // ADMIN: Bloquear/Desbloquear usuario
    // -------------------------------

    public Usuario bloquearUsuario(Long userId, Long adminId) {
        Usuario admin = usuarioRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
        
        if (admin.getRol() != Rol.admin) {
            throw new RuntimeException("Solo los administradores pueden bloquear usuarios");
        }
        
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        usuario.setBloqueado(true);
        return usuarioRepository.save(usuario);
    }

    public Usuario desbloquearUsuario(Long userId, Long adminId) {
        Usuario admin = usuarioRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
        
        if (admin.getRol() != Rol.admin) {
            throw new RuntimeException("Solo los administradores pueden desbloquear usuarios");
        }
        
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        usuario.setBloqueado(false);
        // Opcionalmente resetear fallas al desbloquear
        usuario.setFallas(0);
        return usuarioRepository.save(usuario);
    }

    // -------------------------------
    // ADMIN: Blanquear contraseña
    // -------------------------------

    public Usuario blanquearPassword(Long userId, Long adminId) {
        Usuario admin = usuarioRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
        
        if (admin.getRol() != Rol.admin) {
            throw new RuntimeException("Solo los administradores pueden blanquear contraseñas");
        }
        
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Resetear password al ID
        usuario.setPassword(usuario.getId().toString());
        usuario.setForzarCambio(true);
        return usuarioRepository.save(usuario);
    }

    // -------------------------------
    // ADMIN: Ver estadísticas de técnicos
    // -------------------------------

    public Usuario obtenerEstadisticasTecnico(Long tecnicoId, Long adminId) {
        Usuario admin = usuarioRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
        
        if (admin.getRol() != Rol.admin) {
            throw new RuntimeException("Solo los administradores pueden ver estadísticas");
        }
        
        Usuario tecnico = usuarioRepository.findById(tecnicoId)
                .orElseThrow(() -> new RuntimeException("Técnico no encontrado"));
        
        if (tecnico.getRol() != Rol.tecnico) {
            throw new RuntimeException("El usuario no es un técnico");
        }
        
        return tecnico;
    }

    public Usuario modificarFallas(Long tecnicoId, Long adminId, int cantidad){
        Usuario admin = usuarioRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));

        if (admin.getRol() != Rol.admin) {
            throw new RuntimeException("Solo los administradores pueden modificar las fallas");
        }

        Usuario tecnico = usuarioRepository.findById(tecnicoId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (tecnico.getRol() != Rol.tecnico) {
            throw new RuntimeException("Solo se pueden modificar fallas de técnicos");
        }

        int nuevasFallas = tecnico.getFallas() + cantidad;

        if (nuevasFallas < 0) {
            throw new RuntimeException("Las fallas no pueden ser negativas");
        }

        tecnico.setFallas(nuevasFallas);

        return usuarioRepository.save(tecnico);
    }

    public Usuario modificarMarcas(Long tecnicoId, Long adminId, int cantidad){
        Usuario admin = usuarioRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));

        if (admin.getRol() != Rol.admin) {
            throw new RuntimeException("Solo los administradores pueden modificar las marcas");
        }

        Usuario tecnico = usuarioRepository.findById(tecnicoId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (tecnico.getRol() != Rol.tecnico) {
            throw new RuntimeException("Solo se pueden modificar marcas de técnicos");
        }

        int nuevasMarcas = tecnico.getMarcasRetorno() + cantidad;

        if (nuevasMarcas < 0) {
            throw new RuntimeException("Las fallas no pueden ser negativas");
        }

        tecnico.setMarcasRetorno(nuevasMarcas);

        return usuarioRepository.save(tecnico);
    }
}
