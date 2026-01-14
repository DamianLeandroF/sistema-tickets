package com.iset.sistema_tickets.servicios;

import com.iset.sistema_tickets.modelo.Usuario;
import com.iset.sistema_tickets.repositorios.UsuarioRepository;
import com.iset.sistema_tickets.excepciones.TecnicoBloqueadoException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario login(String identifier, String password) throws Exception {
        Optional<Usuario> userOpt;
        
        try {
            Integer id = Integer.parseInt(identifier);
            userOpt = usuarioRepository.findById(id);
            if (userOpt.isEmpty()) {
                // Si es un número pero no se encuentra por ID, intentar buscar por email por si acaso el email es numérico (raro pero posible)
                 userOpt = usuarioRepository.findByEmail(identifier);
            }
        } catch (NumberFormatException e) {
            // No es un número, buscar por email
            userOpt = usuarioRepository.findByEmail(identifier);
        }

        if (userOpt.isEmpty()) {
            throw new Exception("Usuario no encontrado");
        }

        Usuario user = userOpt.get();

        if (user.isBloqueado()) {
            throw new TecnicoBloqueadoException("El usuario está bloqueado. Contacte al administrador.");
        }

        if (!user.getPassword().equals(password)) {
            throw new Exception("Contraseña incorrecta");
        }

        // Login exitoso
        user.setFallas(0);
        usuarioRepository.save(user);
        return user;
    }

    public Usuario crearUsuario(Integer id, String nombre, String email, String tipo) throws Exception {
        if (usuarioRepository.existsById(id)) {
            throw new Exception("Ya existe un usuario con ese ID");
        }
        Usuario u = new Usuario();
        u.setId(id);
        u.setNombre(nombre);
        u.setEmail(email);
        u.setTipo(tipo);
        u.setPassword(String.valueOf(id));
        u.setForzarCambio(true);
        u.setBloqueado(false);
        u.setFallas(0);
        u.setMarcasRetorno(0);
        return usuarioRepository.save(u);
    }

    public Usuario bloquear(Integer id) throws Exception {
        Usuario u = usuarioRepository.findById(id).orElseThrow(() -> new Exception("Usuario no encontrado"));
        u.setBloqueado(true);
        return usuarioRepository.save(u);
    }

    public Usuario desbloquear(Integer id) throws Exception {
        Usuario u = usuarioRepository.findById(id).orElseThrow(() -> new Exception("Usuario no encontrado"));
        u.setBloqueado(false);
        return usuarioRepository.save(u);
    }

    public void actualizarPassword(Integer id, String nuevaPassword) throws Exception {
        Usuario user = usuarioRepository.findById(id).orElseThrow(() -> new Exception("Usuario no encontrado"));
        user.setPassword(nuevaPassword);
        user.setForzarCambio(false);
        usuarioRepository.save(user);
    }

    public void resetearPassword(Integer id) {
        // Metodo para admin o pruebas
        Optional<Usuario> userOpt = usuarioRepository.findById(id);
        if (userOpt.isPresent()) {
            Usuario user = userOpt.get();
            user.setPassword(String.valueOf(id)); // Ejemplo: password igual al ID por defecto
            user.setForzarCambio(true);
            user.setBloqueado(false);
            user.setFallas(0);
            usuarioRepository.save(user);
        } else {
            // Crear usuario si no existe para pruebas?
            Usuario nuevo = new Usuario();
            nuevo.setId(id);
            nuevo.setPassword(String.valueOf(id));
            nuevo.setTipo("tecnico"); // Asumimos tecnico para pruebas
            nuevo.setForzarCambio(true);
            usuarioRepository.save(nuevo);
        }
    }
}
