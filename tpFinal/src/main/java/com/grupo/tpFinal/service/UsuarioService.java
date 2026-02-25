package com.grupo.tpFinal.service;

import com.grupo.tpFinal.config.JwtUtil;
import com.grupo.tpFinal.dto.LoginRequest;
import com.grupo.tpFinal.dto.LoginResponse;
import com.grupo.tpFinal.dto.PasswordDTO;
import com.grupo.tpFinal.dto.UsuarioDTO;
import com.grupo.tpFinal.enums.Rol;
import com.grupo.tpFinal.excepciones.UsuarioBloqueadoException;
import com.grupo.tpFinal.model.Usuario;
import com.grupo.tpFinal.repository.UsuarioRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private HttpServletRequest request;

    // -------------------------------
    // AUTENTICACIÓN
    // -------------------------------

    public LoginResponse login(LoginRequest loginRequest) {
        Usuario usuario = buscarPorEmailOId(loginRequest.getEmail());

        if (usuario.isBloqueado()) {
            throw new UsuarioBloqueadoException("Cuenta bloqueada. Solicite habilitación al administrador.");
        }

        if (!usuario.getPassword().equals(loginRequest.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta.");
        }

        // Si la contraseña es igual al ID, forzar cambio al ingresar
        if (usuario.getPassword().equals(usuario.getId().toString())) {
            usuario.setForzarCambio(true);
            usuarioRepository.save(usuario);
        }

        String token = jwtUtil.generarToken(usuario);
        return new LoginResponse(token, new UsuarioDTO(usuario));
    }

    private Usuario buscarPorEmailOId(String identificador) {
        return usuarioRepository.findByEmail(identificador)
                .orElseGet(() -> {
                    try {
                        Long id = Long.parseLong(identificador);
                        return usuarioRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));
                    } catch (NumberFormatException e) {
                        throw new RuntimeException("Identificador de usuario inválido.");
                    }
                });
    }

    // -------------------------------
    // USUARIO ACTUAL (desde JWT)
    // -------------------------------

    public Usuario getUsuarioActual() {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token de autenticación no presente.");
        }

        String token = authHeader.substring(7);

        Claims claims;
        try {
            claims = jwtUtil.obtenerClaims(token);
        } catch (ExpiredJwtException e) {
            throw new UsuarioBloqueadoException("Tu sesión ha expirado. Por favor, ingresá nuevamente.");
        } catch (Exception e) {
            throw new RuntimeException("Token inválido.");
        }

        Long userId = claims.get("id", Long.class);
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        if (usuario.isBloqueado()) {
            throw new UsuarioBloqueadoException("Su cuenta ha sido bloqueada y su sesión ha expirado.");
        }

        return usuario;
    }

    // -------------------------------
    // CONTRASEÑAS
    // -------------------------------

    public void cambiarPassword(PasswordDTO dto) {
        Usuario usuario = getUsuarioActual();

        if (!usuario.getPassword().equals(dto.getPasswordActual())) {
            throw new RuntimeException("La contraseña actual no coincide.");
        }

        usuario.setPassword(dto.getPasswordNueva());
        usuario.setForzarCambio(false);
        usuarioRepository.save(usuario);
    }

    public void actualizarPassword(Long userId, String newPassword) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));
        usuario.setPassword(newPassword);
        usuario.setForzarCambio(false);
        usuarioRepository.save(usuario);
    }

    // -------------------------------
    // CONSULTAS
    // -------------------------------

    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> obtenerPorRol(Rol rol) {
        return usuarioRepository.findByRol(rol);
    }

    public Usuario obtenerUsuarioPorId(Long userId) {
        return usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));
    }

    // -------------------------------
    // OPERACIONES DE ADMINISTRADOR
    // -------------------------------

    public Usuario crearUsuario(Usuario usuario, Long adminId) {
        validarRolAdmin(adminId);

        usuario.setPassword("TEMP_PWD"); // Evita null en la primera persistencia
        usuario.setForzarCambio(true);
        usuario.setBloqueado(false);
        usuario.setFallas(0);

        Usuario creado = usuarioRepository.save(usuario);
        creado.setPassword(creado.getId().toString()); // Contraseña inicial = ID generado
        return usuarioRepository.save(creado);
    }

    public Usuario bloquearUsuario(Long userId, Long adminId) {
        validarRolAdmin(adminId);
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));
        usuario.setBloqueado(true);
        return usuarioRepository.save(usuario);
    }

    public Usuario desbloquearUsuario(Long userId, Long adminId) {
        validarRolAdmin(adminId);
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));
        usuario.setBloqueado(false);
        usuario.setFallas(0);
        return usuarioRepository.save(usuario);
    }

    public Usuario blanquearPassword(Long userId, Long adminId) {
        validarRolAdmin(adminId);
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));
        usuario.setPassword(usuario.getId().toString()); // Resetear a ID
        usuario.setForzarCambio(true);
        return usuarioRepository.save(usuario);
    }

    public Usuario modificarFallas(Long tecnicoId, Long adminId, int cantidad) {
        validarRolAdmin(adminId);
        Usuario tecnico = usuarioRepository.findById(tecnicoId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));
        if (tecnico.getRol() != Rol.tecnico) {
            throw new RuntimeException("Solo se pueden modificar fallas de técnicos.");
        }
        int nuevasFallas = tecnico.getFallas() + cantidad;
        if (nuevasFallas < 0) {
            throw new RuntimeException("Las fallas no pueden ser negativas.");
        }
        tecnico.setFallas(nuevasFallas);
        return usuarioRepository.save(tecnico);
    }

    public Usuario modificarMarcas(Long tecnicoId, Long adminId, int cantidad) {
        validarRolAdmin(adminId);
        Usuario tecnico = usuarioRepository.findById(tecnicoId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));
        if (tecnico.getRol() != Rol.tecnico) {
            throw new RuntimeException("Solo se pueden modificar marcas de técnicos.");
        }
        int nuevasMarcas = tecnico.getMarcasRetorno() + cantidad;
        if (nuevasMarcas < 0) {
            throw new RuntimeException("Las marcas no pueden ser negativas.");
        }
        tecnico.setMarcasRetorno(nuevasMarcas);
        return usuarioRepository.save(tecnico);
    }

    // -------------------------------
    // HELPERS PRIVADOS
    // -------------------------------

    private void validarRolAdmin(Long adminId) {
        Usuario admin = usuarioRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado."));
        if (admin.getRol() != Rol.admin) {
            throw new RuntimeException("Acción denegada: Solo el administrador puede realizar esta operación.");
        }
    }
}