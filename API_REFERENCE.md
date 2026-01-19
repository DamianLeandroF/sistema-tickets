# API Quick Reference - Sistema de Tickets

## 🎫 TICKETS

### Crear Ticket (Trabajador)
```http
POST /api/tickets/crear/{trabajadorId}
Content-Type: application/json

{
  "titulo": "Problema con impresora",
  "descripcion": "La impresora del segundo piso no conecta"
}
```

### Ver Tickets Pendientes (Técnico)
```http
GET /api/tickets/estado/NO_ATENDIDO
GET /api/tickets/estado/REABIERTO
```

### Ver Mis Tickets (Trabajador)
```http
GET /api/tickets/trabajador/{trabajadorId}
```

### Ver Tickets Asignados (Técnico)
```http
GET /api/tickets/tecnico/{tecnicoId}
```

### Tomar Ticket (Técnico) - Máximo 3
```http
PUT /api/tickets/{ticketId}/asignar/{tecnicoId}
```

### Marcar como Resuelto (Técnico)
```http
PUT /api/tickets/{ticketId}/resolver/{tecnicoId}
```

### Confirmar Resolución (Trabajador)
```http
PUT /api/tickets/{ticketId}/confirmar/{trabajadorId}
Content-Type: application/json

{
  "confirmado": true
}
```

### Rechazar Resolución (Trabajador)
```http
PUT /api/tickets/{ticketId}/confirmar/{trabajadorId}
Content-Type: application/json

{
  "confirmado": false
}
```
**Resultado:** Ticket → REABIERTO, Técnico recibe 1 falla

### Solicitar Reapertura (Técnico)
```http
PUT /api/tickets/{ticketId}/solicitar-reapertura/{tecnicoId}
```
**Resultado:** 
- Primera vez: 1 marca de retorno
- Segunda vez: marca se borra + 1 falla

### Reabrir Ticket (Admin)
```http
PUT /api/tickets/{ticketId}/reabrir/{adminId}
```

### Filtrar por Estado (Admin)
```http
GET /api/tickets/estado/NO_ATENDIDO
GET /api/tickets/estado/ATENDIDO
GET /api/tickets/estado/RESUELTO
GET /api/tickets/estado/FINALIZADO
GET /api/tickets/estado/REABIERTO
```

### Estadísticas
```http
GET /api/tickets/stats
```

---

## 👥 USUARIOS

### Crear Usuario (Admin)
```http
POST /api/users/crear/{adminId}
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@empresa.com",
  "rol": "TRABAJADOR"
}
```
**Nota:** Password inicial = ID del usuario creado

### Bloquear Usuario (Admin)
```http
PUT /api/users/{userId}/bloquear/{adminId}
```

### Desbloquear Usuario (Admin)
```http
PUT /api/users/{userId}/desbloquear/{adminId}
```
**Nota:** También resetea las fallas a 0

### Blanquear Contraseña (Admin)
```http
PUT /api/users/{userId}/blanquear-password/{adminId}
```
**Resultado:** Password = ID del usuario, forzarCambio = true

### Ver Estadísticas de Técnico (Admin)
```http
GET /api/users/tecnico/{tecnicoId}/stats/{adminId}
```
**Respuesta:**
```json
{
  "id": 2,
  "nombre": "Juan Técnico",
  "email": "juan@empresa.com",
  "rol": "TECNICO",
  "fallas": 1,
  "marcasRetorno": 0,
  "bloqueado": false
}
```

### Listar por Rol
```http
GET /api/users/rol/ADMINISTRADOR
GET /api/users/rol/TECNICO
GET /api/users/rol/TRABAJADOR
```

### Cambiar Contraseña
```http
PUT /api/users/change-password
Content-Type: application/json

{
  "passwordActual": "contraseña_actual",
  "passwordNueva": "nueva_contraseña"
}
```

### Actualizar Contraseña (Primer Login)
```http
PUT /api/users/{userId}/update-password
Content-Type: application/json

{
  "newPassword": "mi_nueva_contraseña"
}
```

---

## 🔐 AUTENTICACIÓN

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "userId": "admin@iset.com",
  "password": "1"
}
```
**Respuesta:**
```json
{
  "usuario": {
    "id": 1,
    "nombre": "Administrador",
    "email": "admin@iset.com",
    "rol": "ADMINISTRADOR",
    "forzarCambio": true,
    "bloqueado": false
  },
  "token": "..."
}
```

---

## 📊 REGLAS DE NEGOCIO

### Estados de Tickets
1. **NO_ATENDIDO** → Recién creado
2. **ATENDIDO** → Tomado por técnico
3. **RESUELTO** → Marcado como resuelto, esperando confirmación
4. **FINALIZADO** → Confirmado por trabajador
5. **REABIERTO** → Rechazado o reabierto por admin

### Límites y Restricciones
- ✅ Técnico máximo **3 tickets** simultáneos (ATENDIDO + RESUELTO)
- ✅ Solo **TRABAJADORES** crean tickets
- ✅ Solo **TÉCNICOS** atienden tickets
- ✅ **3 fallas** → bloqueo automático del técnico

### Sistema de Fallas
- Trabajador rechaza resolución → +1 falla
- Técnico solicita reapertura con marca → +1 falla
- Técnico resuelve ticket reabierto → -1 falla
- 3 fallas → **BLOQUEADO**

### Sistema de Marcas
- Primera solicitud de reapertura → 1 marca
- Segunda solicitud → marca se borra + 1 falla

---

## 🧪 DATOS DE PRUEBA

```
Admin:      admin@iset.com  / password: 1
Técnico:    juan@iset.com   / password: 2
Trabajador: pedro@iset.com  / password: 3
```

---

## 🔄 FLUJO TÍPICO

### Caso Exitoso
1. Trabajador crea ticket → `NO_ATENDIDO`
2. Técnico toma ticket → `ATENDIDO`
3. Técnico resuelve → `RESUELTO`
4. Trabajador confirma → `FINALIZADO`

### Caso con Rechazo
1. Ticket en `RESUELTO`
2. Trabajador rechaza → `REABIERTO` + falla al técnico
3. Otro técnico toma → `ATENDIDO`
4. Resuelve → `RESUELTO`
5. Trabajador confirma → `FINALIZADO` + se limpia 1 falla

### Caso con Solicitud de Reapertura
1. Técnico no puede resolver
2. Solicita reapertura → recibe marca
3. Admin reabre → `REABIERTO`
4. Otro técnico toma y resuelve

---

## ⚠️ ERRORES COMUNES

### "El técnico ya tiene 3 tickets asignados"
- El técnico tiene 3 tickets en estado ATENDIDO o RESUELTO
- Debe resolver o solicitar reapertura de alguno

### "Solo los trabajadores pueden crear tickets"
- Intentaste crear un ticket con un usuario que no es TRABAJADOR

### "Usuario bloqueado"
- El técnico tiene 3 fallas
- Admin debe desbloquearlo: `PUT /api/users/{userId}/desbloquear/{adminId}`

### "Solo el técnico asignado puede marcar como resuelto"
- Intentaste resolver un ticket que no está asignado a ti

### "Solo el trabajador que creó el ticket puede confirmar"
- Intentaste confirmar un ticket que no creaste

---

## 📱 EJEMPLO DE USO COMPLETO

```bash
# 1. Login como trabajador
POST /api/auth/login
{ "userId": "pedro@iset.com", "password": "3" }

# 2. Crear ticket
POST /api/tickets/crear/3
{ "titulo": "Problema red", "descripcion": "Sin internet" }

# 3. Login como técnico
POST /api/auth/login
{ "userId": "juan@iset.com", "password": "2" }

# 4. Ver tickets pendientes
GET /api/tickets/estado/NO_ATENDIDO

# 5. Tomar ticket
PUT /api/tickets/1/asignar/2

# 6. Marcar como resuelto
PUT /api/tickets/1/resolver/2

# 7. Login como trabajador
POST /api/auth/login
{ "userId": "pedro@iset.com", "password": "3" }

# 8. Confirmar resolución
PUT /api/tickets/1/confirmar/3
{ "confirmado": true }

# Ticket ahora está FINALIZADO ✅
```
