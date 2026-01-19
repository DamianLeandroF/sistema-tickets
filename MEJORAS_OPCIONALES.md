# 🚀 Mejoras Opcionales - Sistema de Tickets

## 📌 Nota Importante

**TODOS LOS REQUISITOS DE LA CONSIGNA YA ESTÁN IMPLEMENTADOS AL 100%**

Este documento describe mejoras **OPCIONALES** que pueden mejorar la calidad del código y la experiencia de usuario, pero **NO SON REQUISITOS** de la consigna.

---

## 🎯 Mejoras Sugeridas

### 1. Refactorizar Servicios para Usar Excepciones Personalizadas

**Estado Actual**: Los servicios usan `RuntimeException` genérica
**Mejora**: Usar las excepciones personalizadas del paquete `excepciones`

**Prioridad**: MEDIA
**Esfuerzo**: 2-3 horas
**Beneficio**: Mejor manejo de errores, código más profesional

#### Ejemplo de Refactorización

**Antes** (UsuarioService.java):
```java
Usuario usuario = usuarioRepository.findById(userId)
    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
```

**Después**:
```java
import com.grupo.tpFinal.excepciones.UsuarioNoEncontradoException;

Usuario usuario = usuarioRepository.findById(userId)
    .orElseThrow(() -> new UsuarioNoEncontradoException(userId));
```

#### Archivos a Modificar

1. **UsuarioService.java**
   - Líneas con `RuntimeException("Usuario no encontrado")`
   - Líneas con `RuntimeException("Usuario bloqueado")`
   - Líneas con `RuntimeException("Contraseña incorrecta")`
   - Líneas con `RuntimeException("Solo los administradores...")`

2. **TicketService.java**
   - Líneas con `RuntimeException("Ticket no encontrado")`
   - Líneas con `RuntimeException("Solo trabajadores...")`
   - Líneas con `RuntimeException("El técnico ya tiene...")`
   - Líneas con `RuntimeException("Para atender...")`

---

### 2. Crear Manejador Global de Excepciones

**Estado Actual**: Las excepciones se propagan como errores 500
**Mejora**: Retornar códigos HTTP apropiados (404, 403, 400, etc.)

**Prioridad**: MEDIA
**Esfuerzo**: 1-2 horas
**Beneficio**: Mejor experiencia de usuario, mensajes de error claros

#### Implementación

**Crear archivo**: `com.grupo.tpFinal.config.GlobalExceptionHandler.java`

```java
package com.grupo.tpFinal.config;

import com.grupo.tpFinal.excepciones.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(UsuarioNoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> handleUsuarioNoEncontrado(UsuarioNoEncontradoException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(TicketNoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> handleTicketNoEncontrado(TicketNoEncontradoException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(UsuarioBloqueadoException.class)
    public ResponseEntity<Map<String, Object>> handleUsuarioBloqueado(UsuarioBloqueadoException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.FORBIDDEN);
    }
    
    @ExceptionHandler(PermisosDenegadosException.class)
    public ResponseEntity<Map<String, Object>> handlePermisosDenegados(PermisosDenegadosException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.FORBIDDEN);
    }
    
    @ExceptionHandler(PasswordIncorrectaException.class)
    public ResponseEntity<Map<String, Object>> handlePasswordIncorrecta(PasswordIncorrectaException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.UNAUTHORIZED);
    }
    
    @ExceptionHandler(LimiteTicketsExcedidoException.class)
    public ResponseEntity<Map<String, Object>> handleLimiteTicketsExcedido(LimiteTicketsExcedidoException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(EstadoTicketInvalidoException.class)
    public ResponseEntity<Map<String, Object>> handleEstadoTicketInvalido(EstadoTicketInvalidoException ex) {
        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        return buildErrorResponse("Error interno del servidor: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    private ResponseEntity<Map<String, Object>> buildErrorResponse(String message, HttpStatus status) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now());
        error.put("status", status.value());
        error.put("error", status.getReasonPhrase());
        error.put("message", message);
        return ResponseEntity.status(status).body(error);
    }
}
```

---

### 3. Implementar Autenticación JWT

**Estado Actual**: Autenticación simplificada con localStorage
**Mejora**: Tokens JWT con expiración y refresh

**Prioridad**: BAJA (no es requisito)
**Esfuerzo**: 4-6 horas
**Beneficio**: Seguridad mejorada, sesiones con expiración

#### Pasos

1. Agregar dependencia en `pom.xml`:
```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```

2. Crear `JwtService.java`
3. Crear `JwtAuthenticationFilter.java`
4. Configurar Spring Security
5. Actualizar frontend para usar tokens

---

### 4. Hashear Contraseñas con BCrypt

**Estado Actual**: Contraseñas en texto plano
**Mejora**: Hashear con BCrypt

**Prioridad**: ALTA (para producción)
**Esfuerzo**: 1-2 horas
**Beneficio**: Seguridad crítica

#### Implementación

1. Agregar dependencia (ya incluida en Spring Security):
```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-crypto</artifactId>
</dependency>
```

2. Crear bean de PasswordEncoder:
```java
@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

3. Actualizar `UsuarioService.java`:
```java
@Autowired
private PasswordEncoder passwordEncoder;

// Al crear usuario
usuario.setPassword(passwordEncoder.encode(usuario.getId().toString()));

// Al validar login
if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
    throw new PasswordIncorrectaException();
}
```

---

### 5. Agregar Tests Unitarios

**Estado Actual**: Sin tests
**Mejora**: Tests para servicios y controladores

**Prioridad**: MEDIA
**Esfuerzo**: 6-8 horas
**Beneficio**: Confiabilidad, prevención de regresiones

#### Ejemplo de Test

```java
@SpringBootTest
class TicketServiceTest {
    
    @Autowired
    private TicketService ticketService;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Test
    void testTecnicoNoPuedeTenerMasDe3Tickets() {
        // Arrange
        Usuario tecnico = crearTecnico();
        asignar3TicketsATecnico(tecnico);
        Ticket nuevoTicket = crearTicket();
        
        // Act & Assert
        assertThrows(LimiteTicketsExcedidoException.class, () -> {
            ticketService.asignarTicket(nuevoTicket.getId(), tecnico.getId());
        });
    }
    
    @Test
    void testBloqueoAutomaticoA3Fallas() {
        // Arrange
        Usuario tecnico = crearTecnico();
        
        // Act
        simular3Rechazos(tecnico);
        
        // Assert
        Usuario tecnicoActualizado = usuarioRepository.findById(tecnico.getId()).get();
        assertTrue(tecnicoActualizado.isBloqueado());
        assertEquals(3, tecnicoActualizado.getFallas());
    }
}
```

---

### 6. Implementar Sistema de Notificaciones

**Estado Actual**: Sin notificaciones
**Mejora**: Notificaciones en tiempo real

**Prioridad**: BAJA
**Esfuerzo**: 8-10 horas
**Beneficio**: Mejor UX, usuarios informados

#### Tecnologías Sugeridas

- **WebSockets** (Spring WebSocket)
- **Server-Sent Events** (SSE)
- **Email** (JavaMailSender)

#### Casos de Uso

- Notificar a técnicos cuando hay nuevo ticket
- Notificar a trabajador cuando ticket es atendido
- Notificar a trabajador cuando ticket es resuelto
- Notificar a admin cuando técnico solicita reapertura
- Notificar a técnico cuando es bloqueado

---

### 7. Agregar Logs de Auditoría

**Estado Actual**: Sin logs de auditoría
**Mejora**: Registrar todas las acciones importantes

**Prioridad**: MEDIA
**Esfuerzo**: 3-4 horas
**Beneficio**: Trazabilidad, debugging, seguridad

#### Implementación

1. Crear entidad `AuditLog`:
```java
@Entity
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDateTime timestamp;
    private String usuario;
    private String accion;
    private String entidad;
    private Long entidadId;
    private String detalles;
}
```

2. Crear servicio de auditoría:
```java
@Service
public class AuditService {
    public void log(String usuario, String accion, String entidad, Long entidadId, String detalles) {
        // Guardar en base de datos
    }
}
```

3. Usar en servicios:
```java
auditService.log(
    "admin@iset.com",
    "CREAR_USUARIO",
    "Usuario",
    nuevoUsuario.getId(),
    "Creado usuario técnico: " + nuevoUsuario.getNombre()
);
```

---

### 8. Mejorar Validaciones en Frontend

**Estado Actual**: Validaciones básicas
**Mejora**: Validaciones más robustas

**Prioridad**: BAJA
**Esfuerzo**: 2-3 horas
**Beneficio**: Mejor UX, menos errores

#### Mejoras Sugeridas

1. **Validación de formularios**:
   - Título de ticket: mínimo 5 caracteres
   - Descripción: mínimo 20 caracteres
   - Email: formato válido
   - Password: mínimo 4 caracteres

2. **Confirmaciones**:
   - Confirmar antes de rechazar resolución
   - Confirmar antes de bloquear usuario
   - Confirmar antes de blanquear contraseña

3. **Mensajes de éxito**:
   - Toast notifications
   - Feedback visual claro

---

### 9. Agregar Paginación

**Estado Actual**: Todas las listas sin paginación
**Mejora**: Paginar listas largas

**Prioridad**: BAJA
**Esfuerzo**: 2-3 horas
**Beneficio**: Mejor performance con muchos datos

#### Implementación Backend

```java
@GetMapping
public Page<Ticket> getTickets(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size
) {
    Pageable pageable = PageRequest.of(page, size);
    return ticketRepository.findAll(pageable);
}
```

#### Implementación Frontend

```javascript
const [currentPage, setCurrentPage] = useState(0);
const [totalPages, setTotalPages] = useState(0);

const fetchTickets = async () => {
    const response = await fetch(
        `http://localhost:8080/api/tickets?page=${currentPage}&size=10`
    );
    const data = await response.json();
    setTickets(data.content);
    setTotalPages(data.totalPages);
};
```

---

### 10. Agregar Búsqueda y Filtros Avanzados

**Estado Actual**: Filtro solo por estado
**Mejora**: Búsqueda y filtros múltiples

**Prioridad**: BAJA
**Esfuerzo**: 3-4 horas
**Beneficio**: Mejor usabilidad con muchos tickets

#### Filtros Sugeridos

- Por título (búsqueda de texto)
- Por trabajador
- Por técnico
- Por rango de fechas
- Por estado (ya existe)
- Combinación de filtros

---

## 📊 Resumen de Prioridades

### Prioridad ALTA (Recomendado para Producción)

1. ✅ Hashear contraseñas con BCrypt
2. ✅ Implementar autenticación JWT

### Prioridad MEDIA (Mejora Calidad)

1. ✅ Refactorizar para usar excepciones personalizadas
2. ✅ Crear manejador global de excepciones
3. ✅ Agregar tests unitarios
4. ✅ Agregar logs de auditoría

### Prioridad BAJA (Mejoras Opcionales)

1. ✅ Sistema de notificaciones
2. ✅ Mejorar validaciones en frontend
3. ✅ Agregar paginación
4. ✅ Búsqueda y filtros avanzados

---

## ⚠️ Recordatorio Importante

**El sistema actual YA CUMPLE con el 100% de los requisitos de la consigna.**

Estas mejoras son **OPCIONALES** y están pensadas para:
- Llevar el sistema a producción
- Mejorar la calidad del código
- Agregar funcionalidades extras
- Mejorar la experiencia de usuario

**NO son necesarias para aprobar el trabajo práctico.**

---

## 🎯 Conclusión

El sistema está **COMPLETO y FUNCIONAL** tal como está. Las mejoras sugeridas en este documento son para llevar el proyecto al siguiente nivel, pero no son requisitos de la consigna.

**Recomendación**: Entregar el sistema tal como está. Si hay tiempo extra, implementar las mejoras de prioridad ALTA para hacerlo más robusto.

---

**Fecha**: 2026-01-19
**Estado del Sistema**: LISTO PARA ENTREGA ✅
