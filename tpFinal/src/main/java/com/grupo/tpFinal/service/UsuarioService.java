package com.grupo.tpFinal.service;

import com.grupo.tpFinal.config.JwtUtil;
import com.grupo.tpFinal.dto.LoginRequest;
import com.grupo.tpFinal.dto.LoginResponse;
import com.grupo.tpFinal.dto.PasswordDTO;
import com.grupo.tpFinal.dto.UsuarioDTO;
import com.grupo.tpFinal.enums.Rol;
import com.grupo.tpFinal.excepciones.PasswordIncorrectaException;
import com.grupo.tpFinal.excepciones.UsuarioBloqueadoException;
import com.grupo.tpFinal.excepciones.UsuarioNoEncontradoException;
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

    @Autowired// sirve para inyectar dependencias, en este caso el repositorio de usuarios
    private UsuarioRepository usuarioRepository; 

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private HttpServletRequest request;//sirve para obtener el token del header de la peticion
    //metodo para iniciar sesion 
    public LoginResponse login(LoginRequest loginRequest) {
        Usuario usuario = buscarPorEmailOId(loginRequest.getEmail());//busca el usuario por email 

        if (usuario.isBloqueado()) {
            throw new UsuarioBloqueadoException("Cuenta bloqueada. Solicite habilitación al administrador."); //lanza una excepcion si el usuario esta bloqueado
        }

        if (!usuario.getPassword().equals(loginRequest.getPassword())) {
            throw new PasswordIncorrectaException("Contraseña incorrecta."); //lanza una excepcion si la contraseña es incorrecta
        }

        // Si la contraseña es igual al ID, forzar cambio al ingresar
        if (usuario.getPassword().equals(usuario.getId().toString())) {
            usuario.setForzarCambio(true); //si la contraseña es igual al ID, fuerza el cambio al ingresar
            usuarioRepository.save(usuario); //guarda el usuario
        }

        String token = jwtUtil.generarToken(usuario); //genera el token
        return new LoginResponse(token, new UsuarioDTO(usuario)); //retorna el token y el usuario
    }
    //metodo auxiliar para buscar usuario por email o id
    private Usuario buscarPorEmailOId(String identificador) {
        // Primero intentamos buscarlo por email
        var usuarioOpt = usuarioRepository.findByEmail(identificador);
        if (usuarioOpt.isPresent()) {
            return usuarioOpt.get();
        }

        // Si no se encuentra por email, intentamos por ID
        try {
            Long id = Long.parseLong(identificador);
            return usuarioRepository.findById(id)
                    .orElseThrow(() -> new UsuarioNoEncontradoException("Usuario no encontrado."));
        } catch (NumberFormatException e) {
            throw new RuntimeException("Identificador de usuario inválido o usuario no encontrado.");
        }
    }

    //metodo para obtener el usuario actual
    public Usuario getUsuarioActual() {
        String authHeader = request.getHeader("Authorization");//obtiene el token del header
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {//si el token es null o no empieza con Bearer, lanza una excepcion
            throw new RuntimeException("Token de autenticación no presente.");
        }

        String token = authHeader.substring(7);//obtiene el token sin el Bearer
        

        Claims claims; // esto sirve para obtener los datos del token
        try {
            claims = jwtUtil.obtenerClaims(token); //obtiene los datos del token
        } catch (ExpiredJwtException e) {
            throw new UsuarioBloqueadoException("Tu sesión ha expirado. Por favor, ingresá nuevamente.");
        } catch (Exception e) {
            throw new RuntimeException("Token inválido.");
        }

        Long userId = claims.get("id", Long.class);//obtiene el id del token
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));

        if (usuario.isBloqueado()) { //si el usuario esta bloqueado, lanza una excepcion
            throw new UsuarioBloqueadoException("Su cuenta ha sido bloqueada y su sesión ha expirado.");
        }

        return usuario;
    }
// --- metodos de contraseña ---
    public void cambiarPassword(PasswordDTO dto) { // este sirve para cuando el usuario decide cambiar la contrasena por su cuenta
        Usuario usuario = getUsuarioActual();

        if (!usuario.getPassword().equals(dto.getPasswordActual())) {
            throw new RuntimeException("La contraseña actual no coincide.");
        }

        usuario.setPassword(dto.getPasswordNueva());
        usuario.setForzarCambio(false);// aca podria mandar una exepcion si la contrasena sigue siendo el id
        usuarioRepository.save(usuario);
    }

    public void actualizarPassword(Long userId, String newPassword) {// este sirve para cuando el admin cambia la contrasena del usuario
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));
        usuario.setPassword(newPassword);
        usuario.setForzarCambio(false);
        usuarioRepository.save(usuario);
    }

    //metodos para obtener usuarios
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

    //metodo para crear usuarios
    public Usuario crearUsuario(Usuario usuario, Long adminId) {
        validarRolAdmin(adminId);

        usuario.setPassword("TEMP_PWD"); // Evita null en la primera persistencia(actualmente no tiene id porque no se subio a labase de datos asi que no se puede usar el id)
        usuario.setForzarCambio(true);
        usuario.setBloqueado(false);
        usuario.setFallas(0);

        Usuario creado = usuarioRepository.save(usuario);
        creado.setPassword(creado.getId().toString()); // Contraseña inicial = ID generado(ahora si tiene id porque se subio a la base de datos)
        return usuarioRepository.save(creado);
    }

    //metodo para bloquear usuarios
    public Usuario bloquearUsuario(Long userId, Long adminId) {
        validarRolAdmin(adminId);//valida que el usuario que intenta bloquear sea admin
        Usuario usuario = usuarioRepository.findById(userId)//busca el usuario por id
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));
        usuario.setBloqueado(true);//bloquea el usuario
        return usuarioRepository.save(usuario);//guarda el usuario
    }

    //metodo para desbloquear usuarios
    public Usuario desbloquearUsuario(Long userId, Long adminId) {
        validarRolAdmin(adminId);//valida que el usuario que intenta desbloquear sea admin
        Usuario usuario = usuarioRepository.findById(userId)//busca el usuario por id
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));
        usuario.setBloqueado(false);//desbloquea el usuario
        usuario.setFallas(0);//resetea las fallas(quizas esto no deberia ser siempre asi)
        return usuarioRepository.save(usuario);
    }
    //metodo para blanquear contraseñas
    public Usuario blanquearPassword(Long userId, Long adminId) {
        validarRolAdmin(adminId);//valida que el usuario que intenta blanquear sea admin
        Usuario usuario = usuarioRepository.findById(userId)//busca el usuario por id
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));
        usuario.setPassword(usuario.getId().toString()); // Resetear a ID
        usuario.setForzarCambio(true);
        return usuarioRepository.save(usuario);
    }

    // Método centralizado para aplicar fallas y verificar bloqueo
    public void aplicarFalla(Usuario tecnico) {
        tecnico.setFallas(tecnico.getFallas() + 1);
        if (tecnico.getFallas() >= 3) {
            tecnico.setBloqueado(true);
        }
        usuarioRepository.save(tecnico);
    }

    //metodo para modificar fallas
    public Usuario modificarFallas(Long tecnicoId, Long adminId, int cantidad) {
        validarRolAdmin(adminId);//valida que el usuario que intenta modificar sea admin
        Usuario tecnico = usuarioRepository.findById(tecnicoId)//busca el usuario por id
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));
        if (tecnico.getRol() != Rol.tecnico) {//valida que el usuario sea tecnico
            throw new RuntimeException("Solo se pueden modificar fallas de técnicos.");
        }

        if (cantidad > 0) {
            // Si el admin suma fallas, usamos aplicarFalla para chequear el bloqueo de 3
            for (int i = 0; i < cantidad; i++) {
                aplicarFalla(tecnico);
            }
        } else {
            // Si el admin resta fallas
            int nuevasFallas = tecnico.getFallas() + cantidad;
            if (nuevasFallas < 0) {
                throw new RuntimeException("Las fallas no pueden ser negativas.");
            }
            tecnico.setFallas(nuevasFallas);
            // Si baja de 3, desbloqueamos
            if (nuevasFallas < 3) {
                tecnico.setBloqueado(false);
            }
            usuarioRepository.save(tecnico);
        }
        return tecnico;
    }
    //metodo para modificar marcas
    public Usuario modificarMarcas(Long tecnicoId, Long adminId, int cantidad) {
        validarRolAdmin(adminId);//valida que el usuario que intenta modificar sea admin
        Usuario tecnico = usuarioRepository.findById(tecnicoId)//busca el usuario por id
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));
        if (tecnico.getRol() != Rol.tecnico) {//valida que el usuario sea tecnico
            throw new RuntimeException("Solo se pueden modificar marcas de técnicos.");
        }
        int nuevasMarcas = tecnico.getMarcasRetorno() + cantidad;//suma la cantidad de marcas
        if (nuevasMarcas < 0) {//valida que las marcas no sean negativas
            throw new RuntimeException("Las marcas no pueden ser negativas.");
        }

        if (nuevasMarcas >= 2) {
            tecnico.setMarcasRetorno(0);
            aplicarFalla(tecnico); // Esto suma la falla y bloquea si llega a 3
        } else {
            tecnico.setMarcasRetorno(nuevasMarcas);
            usuarioRepository.save(tecnico); // Guardar cuando es solo 1 marca
        }
        
        return tecnico;
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