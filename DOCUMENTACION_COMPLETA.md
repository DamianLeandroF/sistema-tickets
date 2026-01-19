# Sistema de Tickets - Documentación Completa

## Resumen de Implementación

Este documento describe la implementación completa del sistema de tickets según los requisitos del proyecto.

## ✅ Características Implementadas

### 1. **Gestión de Usuarios**

#### Roles
- **ADMINISTRADOR**: Gestiona usuarios y tickets
- **TECNICO**: Atiende tickets (máximo 3 simultáneos)
- **TRABAJADOR**: Crea tickets

#### Funcionalidades por Rol

**TRABAJADOR:**
- ✅ Crear tickets con título y descripción
- ✅ Ver lista de tickets propios (no finalizados)
- ✅ Ver estado y técnico asignado de cada ticket
- ✅ Confirmar o rechazar resolución de tickets

**TÉCNICO:**
- ✅ Ver lista de tickets pendientes (NO_ATENDIDO y REABIERTO)
- ✅ Tomar tickets (máximo 3 simultáneos)
- ✅ Marcar tickets como RESUELTO
- ✅ Solicitar reapertura de tickets al administrador
- ✅ Sistema de fallas y marcas de retorno
- ✅ Bloqueo automático al alcanzar 3 fallas

**ADMINISTRADOR:**
- ✅ Crear usuarios (trabajadores y técnicos)
- ✅ Bloquear/Desbloquear usuarios
- ✅ Blanquear contraseñas (resetear a ID)
- ✅ Reabrir tickets a solicitud del técnico
- ✅ Ver estadísticas de técnicos (fallas y marcas)
- ✅ Filtrar tickets por estado
- ✅ Ver información completa de todos los tickets

### 2. **Estados de Tickets**

1. **NO_ATENDIDO**: Ticket recién creado
2. **ATENDIDO**: Ticket tomado por un técnico
3. **RESUELTO**: Técnico marcó como resuelto, esperando confirmación
4. **FINALIZADO**: Trabajador confirmó la resolución
5. **REABIERTO**: Trabajador rechazó la resolución o admin reabrió

### 3. **Sistema de Fallas y Marcas**

#### Fallas del Técnico
- Se asigna una falla cuando:
  - El trabajador rechaza la resolución de un ticket
  - El técnico solicita reapertura teniendo ya una marca de retorno
- Al alcanzar 3 fallas: **bloqueo automático**
- Limpieza de fallas: Al resolver un ticket reabierto

#### Marcas de Retorno
- Primera solicitud de reapertura: recibe 1 marca
- Segunda solicitud de reapertura: se borra la marca y recibe 1 falla

### 4. **Restricciones Implementadas**

✅ **Técnico máximo 3 tickets**: Validación en `asignarTicket()`
✅ **Solo trabajadores crean tickets**: Validación en `crearTicket()`
✅ **Técnicos bloqueados no pueden atender**: Validación en `asignarTicket()`
✅ **Contraseña inicial = ID**: Implementado en `crearUsuario()`
✅ **Forzar cambio de contraseña**: Campo `forzarCambio` en Usuario
✅ **Bloqueo por 3 fallas**: Automático en confirmación y solicitud de reapertura

## 📡 API Endpoints

### Tickets

#### Crear Ticket (Trabajador)
```
POST /api/tickets/crear/{trabajadorId}
Body: {
  "titulo": "Título del problema",
  "descripcion": "Descripción detallada"
}
```

#### Listar Tickets Pendientes
```
GET /api/tickets/estado/NO_ATENDIDO
GET /api/tickets/estado/REABIERTO
```

#### Listar Tickets de un Trabajador
```
GET /api/tickets/trabajador/{trabajadorId}
```

#### Listar Tickets de un Técnico
```
GET /api/tickets/tecnico/{tecnicoId}
```

#### Asignar Ticket a Técnico
```
PUT /api/tickets/{ticketId}/asignar/{tecnicoId}
```

#### Marcar Ticket como Resuelto (Técnico)
```
PUT /api/tickets/{ticketId}/resolver/{tecnicoId}
```

#### Confirmar/Rechazar Resolución (Trabajador)
```
PUT /api/tickets/{ticketId}/confirmar/{trabajadorId}
Body: {
  "confirmado": true  // o false para rechazar
}
```

#### Solicitar Reapertura (Técnico)
```
PUT /api/tickets/{ticketId}/solicitar-reapertura/{tecnicoId}
```

#### Reabrir Ticket (Administrador)
```
PUT /api/tickets/{ticketId}/reabrir/{adminId}
```

#### Obtener Estadísticas
```
GET /api/tickets/stats
Response: {
  "total": 10,
  "noAtendidos": 3,
  "atendidos": 2,
  "resueltos": 1,
  "finalizados": 3,
  "reabiertos": 1
}
```

### Usuarios

#### Crear Usuario (Administrador)
```
POST /api/users/crear/{adminId}
Body: {
  "nombre": "Nombre Completo",
  "email": "email@ejemplo.com",
  "rol": "TRABAJADOR"  // o TECNICO
}
```

#### Bloquear Usuario (Administrador)
```
PUT /api/users/{userId}/bloquear/{adminId}
```

#### Desbloquear Usuario (Administrador)
```
PUT /api/users/{userId}/desbloquear/{adminId}
```

#### Blanquear Contraseña (Administrador)
```
PUT /api/users/{userId}/blanquear-password/{adminId}
```

#### Ver Estadísticas de Técnico (Administrador)
```
GET /api/users/tecnico/{tecnicoId}/stats/{adminId}
Response: {
  "id": 2,
  "nombre": "Juan Técnico",
  "fallas": 1,
  "marcasRetorno": 0,
  "bloqueado": false
}
```

#### Listar Usuarios por Rol
```
GET /api/users/rol/TECNICO
GET /api/users/rol/TRABAJADOR
```

#### Cambiar Contraseña
```
PUT /api/users/change-password
Body: {
  "passwordActual": "contraseña_actual",
  "passwordNueva": "nueva_contraseña"
}
```

#### Actualizar Contraseña (Primer Login)
```
PUT /api/users/{userId}/update-password
Body: {
  "newPassword": "nueva_contraseña"
}
```

### Autenticación

#### Login
```
POST /api/auth/login
Body: {
  "userId": "email@ejemplo.com",  // o ID numérico
  "password": "contraseña"
}
Response: {
  "usuario": {...},
  "token": "..."
}
```

## 🔄 Flujos de Trabajo

### Flujo 1: Creación y Resolución Exitosa de Ticket

1. **Trabajador** crea ticket → Estado: `NO_ATENDIDO`
2. **Técnico** toma el ticket → Estado: `ATENDIDO`
3. **Técnico** marca como resuelto → Estado: `RESUELTO`
4. **Trabajador** confirma resolución → Estado: `FINALIZADO`

### Flujo 2: Ticket Reabierto por Trabajador

1. Ticket en estado `RESUELTO`
2. **Trabajador** rechaza resolución → Estado: `REABIERTO`
3. **Técnico anterior** recibe 1 falla
4. Ticket queda disponible para otro técnico
5. Si el mismo u otro técnico resuelve el ticket reabierto → se limpia 1 falla

### Flujo 3: Técnico Solicita Reapertura

1. **Técnico** no puede resolver el ticket
2. **Técnico** solicita reapertura
   - Primera vez: recibe 1 marca de retorno
   - Segunda vez: marca se borra y recibe 1 falla
3. **Administrador** aprueba y reabre el ticket → Estado: `REABIERTO`
4. Ticket queda disponible para otro técnico

### Flujo 4: Bloqueo de Técnico

1. Técnico acumula 3 fallas (por rechazos o marcas)
2. Sistema bloquea automáticamente al técnico
3. Técnico no puede tomar más tickets
4. **Administrador** debe desbloquear manualmente

## 🗄️ Modelo de Datos

### Usuario
```java
{
  id: Long,
  nombre: String,
  email: String,
  password: String,
  rol: Rol (ADMINISTRADOR, TECNICO, TRABAJADOR),
  forzarCambio: boolean,
  bloqueado: boolean,
  fallas: int,
  marcasRetorno: int
}
```

### Ticket
```java
{
  id: Long,
  titulo: String,
  descripcion: String,
  estado: EstadoTicket,
  trabajador: Usuario,
  tecnicoActual: Usuario,
  tecnicoAnterior: Usuario,
  reabierto: boolean
}
```

## 🔐 Seguridad

1. **Contraseña inicial = ID**: Al crear un usuario, su contraseña es igual a su ID
2. **Forzar cambio**: Campo `forzarCambio` obliga al usuario a cambiar su contraseña
3. **Blanqueo de contraseña**: Admin puede resetear password a ID
4. **Validación de roles**: Cada endpoint valida que el usuario tenga el rol correcto

## 📊 Validaciones Implementadas

### En TicketService:
- ✅ Solo trabajadores pueden crear tickets
- ✅ Solo técnicos pueden atender tickets
- ✅ Técnico no puede tener más de 3 tickets simultáneos
- ✅ Técnico bloqueado no puede atender tickets
- ✅ Solo el técnico asignado puede marcar como resuelto
- ✅ Solo el trabajador creador puede confirmar resolución
- ✅ Validación de estados correctos para cada operación

### En UsuarioService:
- ✅ Solo administradores pueden crear usuarios
- ✅ Solo administradores pueden bloquear/desbloquear
- ✅ Solo administradores pueden blanquear contraseñas
- ✅ Solo administradores pueden ver estadísticas de técnicos
- ✅ Bloqueo automático al alcanzar 3 fallas

## 🚀 Datos de Prueba

Al iniciar la aplicación, se crean automáticamente:

**Administrador:**
- Email: admin@iset.com
- Password: 1

**Técnico:**
- Email: juan@iset.com
- Password: 2

**Trabajador:**
- Email: pedro@iset.com
- Password: 3

## 📝 Notas Importantes

1. **Autenticación**: Actualmente usa un sistema simplificado. En producción se debe implementar JWT o similar.

2. **Solicitud de Reapertura**: La solicitud de reapertura por parte del técnico está implementada pero requiere aprobación del administrador mediante el endpoint `/reabrir`.

3. **Contraseñas**: En producción se deben hashear las contraseñas (BCrypt, etc.).

4. **Validaciones adicionales**: Se pueden agregar más validaciones según necesidades específicas.

## 🎯 Cumplimiento de Requisitos

| Requisito | Estado |
|-----------|--------|
| Trabajador crea tickets | ✅ |
| Técnico atiende tickets | ✅ |
| Máximo 3 tickets por técnico | ✅ |
| Estados de tickets correctos | ✅ |
| Confirmación de resolución | ✅ |
| Sistema de fallas | ✅ |
| Bloqueo por 3 fallas | ✅ |
| Marcas de retorno | ✅ |
| Admin crea usuarios | ✅ |
| Admin bloquea/desbloquea | ✅ |
| Admin blanquea passwords | ✅ |
| Admin reabre tickets | ✅ |
| Admin ve estadísticas | ✅ |
| Filtrado por estado | ✅ |
| Contraseña inicial = ID | ✅ |
| Forzar cambio de contraseña | ✅ |
| Limpieza de falla al resolver reabierto | ✅ |

## 🔧 Próximos Pasos Recomendados

1. Implementar autenticación JWT completa
2. Agregar validación de `forzarCambio` en el login
3. Implementar sistema de notificaciones
4. Agregar logs de auditoría
5. Implementar paginación en listados
6. Agregar búsqueda y filtros avanzados
7. Implementar frontend completo
8. Agregar tests unitarios y de integración
