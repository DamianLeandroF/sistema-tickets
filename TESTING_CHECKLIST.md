# Checklist de Pruebas - Sistema de Tickets

## ✅ Verificación de Requisitos

### 1. TRABAJADORES - Crear Tickets
- [ ] Trabajador puede crear ticket con título y descripción
- [ ] Ticket se crea con estado NO_ATENDIDO
- [ ] Técnico NO puede crear tickets (debe dar error)
- [ ] Admin NO puede crear tickets (debe dar error)

**Prueba:**
```http
POST /api/tickets/crear/3
{
  "titulo": "Test ticket",
  "descripcion": "Descripción de prueba"
}
```

---

### 2. TRABAJADORES - Ver Tickets
- [ ] Trabajador ve lista de sus tickets no finalizados
- [ ] Se muestra el estado de cada ticket
- [ ] Se muestra el técnico asignado (si existe)
- [ ] NO se muestran tickets finalizados

**Prueba:**
```http
GET /api/tickets/trabajador/3
```

---

### 3. TÉCNICOS - Ver Tickets Pendientes
- [ ] Técnico ve todos los tickets NO_ATENDIDO
- [ ] Técnico ve todos los tickets REABIERTO
- [ ] Puede ver título y descripción

**Prueba:**
```http
GET /api/tickets/estado/NO_ATENDIDO
GET /api/tickets/estado/REABIERTO
```

---

### 4. TÉCNICOS - Tomar Tickets (Máximo 3)
- [ ] Técnico puede tomar ticket NO_ATENDIDO
- [ ] Ticket pasa a estado ATENDIDO
- [ ] Técnico puede tomar hasta 3 tickets
- [ ] Al intentar tomar el 4to ticket, da error
- [ ] Técnico bloqueado NO puede tomar tickets

**Prueba:**
```http
# Tomar 1er ticket
PUT /api/tickets/1/asignar/2

# Tomar 2do ticket
PUT /api/tickets/2/asignar/2

# Tomar 3er ticket
PUT /api/tickets/3/asignar/2

# Intentar tomar 4to (debe fallar)
PUT /api/tickets/4/asignar/2
```

---

### 5. TÉCNICOS - Marcar como Resuelto
- [ ] Técnico puede marcar su ticket como RESUELTO
- [ ] Solo el técnico asignado puede marcar como resuelto
- [ ] Otro técnico NO puede marcar el ticket (debe dar error)

**Prueba:**
```http
PUT /api/tickets/1/resolver/2
```

---

### 6. TRABAJADORES - Confirmar Resolución
- [ ] Trabajador puede confirmar resolución
- [ ] Al confirmar: ticket pasa a FINALIZADO
- [ ] Solo el trabajador creador puede confirmar
- [ ] Otro trabajador NO puede confirmar (debe dar error)

**Prueba:**
```http
PUT /api/tickets/1/confirmar/3
{
  "confirmado": true
}
```

---

### 7. TRABAJADORES - Rechazar Resolución
- [ ] Trabajador puede rechazar resolución
- [ ] Al rechazar: ticket pasa a REABIERTO
- [ ] Técnico recibe 1 falla
- [ ] Se guarda técnico anterior
- [ ] Técnico actual se limpia (null)

**Prueba:**
```http
PUT /api/tickets/1/confirmar/3
{
  "confirmado": false
}

# Verificar fallas del técnico
GET /api/users/tecnico/2/stats/1
```

---

### 8. SISTEMA DE FALLAS - Bloqueo por 3 Fallas
- [ ] Técnico con 0 fallas puede atender
- [ ] Técnico con 1 falla puede atender
- [ ] Técnico con 2 fallas puede atender
- [ ] Técnico con 3 fallas queda BLOQUEADO
- [ ] Técnico bloqueado NO puede tomar tickets

**Prueba:**
```bash
# Crear 3 tickets y hacer que el trabajador rechace los 3
# Verificar que el técnico quede bloqueado
GET /api/users/tecnico/2/stats/1
# Debe mostrar: bloqueado: true, fallas: 3

# Intentar tomar otro ticket (debe fallar)
PUT /api/tickets/4/asignar/2
```

---

### 9. SISTEMA DE MARCAS - Solicitud de Reapertura
- [ ] Primera solicitud: técnico recibe 1 marca
- [ ] Segunda solicitud: marca se borra + 1 falla
- [ ] Fallas y marcas se muestran correctamente

**Prueba:**
```http
# Primera solicitud
PUT /api/tickets/1/solicitar-reapertura/2
GET /api/users/tecnico/2/stats/1
# Debe mostrar: marcasRetorno: 1

# Segunda solicitud
PUT /api/tickets/2/solicitar-reapertura/2
GET /api/users/tecnico/2/stats/1
# Debe mostrar: marcasRetorno: 0, fallas: 1
```

---

### 10. LIMPIEZA DE FALLAS - Resolver Ticket Reabierto
- [ ] Técnico con fallas resuelve ticket reabierto
- [ ] Al confirmar trabajador: se limpia 1 falla
- [ ] Fallas no bajan de 0

**Prueba:**
```bash
# 1. Técnico tiene 1 falla
# 2. Toma ticket REABIERTO
PUT /api/tickets/5/asignar/2

# 3. Marca como resuelto
PUT /api/tickets/5/resolver/2

# 4. Trabajador confirma
PUT /api/tickets/5/confirmar/3
{ "confirmado": true }

# 5. Verificar que falla se limpió
GET /api/users/tecnico/2/stats/1
# Debe mostrar: fallas: 0
```

---

### 11. ADMIN - Crear Usuarios
- [ ] Admin puede crear trabajadores
- [ ] Admin puede crear técnicos
- [ ] Password inicial = ID del usuario
- [ ] forzarCambio = true
- [ ] bloqueado = false
- [ ] fallas = 0
- [ ] marcasRetorno = 0

**Prueba:**
```http
POST /api/users/crear/1
{
  "nombre": "Nuevo Trabajador",
  "email": "nuevo@empresa.com",
  "rol": "TRABAJADOR"
}

# Verificar que password = ID
# Intentar login con ID como password
```

---

### 12. ADMIN - Bloquear/Desbloquear Usuarios
- [ ] Admin puede bloquear usuario
- [ ] Usuario bloqueado no puede atender tickets
- [ ] Admin puede desbloquear usuario
- [ ] Al desbloquear se resetean fallas

**Prueba:**
```http
# Bloquear
PUT /api/users/2/bloquear/1

# Verificar bloqueo
GET /api/users/tecnico/2/stats/1

# Desbloquear
PUT /api/users/2/desbloquear/1

# Verificar desbloqueo y reseteo de fallas
GET /api/users/tecnico/2/stats/1
```

---

### 13. ADMIN - Blanquear Contraseña
- [ ] Admin puede blanquear password
- [ ] Password = ID del usuario
- [ ] forzarCambio = true
- [ ] Usuario puede hacer login con ID

**Prueba:**
```http
PUT /api/users/2/blanquear-password/1

# Intentar login con ID como password
POST /api/auth/login
{
  "userId": "juan@iset.com",
  "password": "2"
}
```

---

### 14. ADMIN - Reabrir Tickets
- [ ] Admin puede reabrir ticket ATENDIDO
- [ ] Admin puede reabrir ticket RESUELTO
- [ ] Ticket pasa a REABIERTO
- [ ] Se guarda técnico anterior
- [ ] Técnico actual se limpia

**Prueba:**
```http
PUT /api/tickets/1/reabrir/1

# Verificar estado
GET /api/tickets/1
```

---

### 15. ADMIN - Ver Estadísticas
- [ ] Admin ve fallas de técnicos
- [ ] Admin ve marcas de retorno
- [ ] Admin ve estado de bloqueo
- [ ] Solo admin puede ver estadísticas

**Prueba:**
```http
GET /api/users/tecnico/2/stats/1
```

---

### 16. ADMIN - Filtrar Tickets por Estado
- [ ] Admin puede filtrar por NO_ATENDIDO
- [ ] Admin puede filtrar por ATENDIDO
- [ ] Admin puede filtrar por RESUELTO
- [ ] Admin puede filtrar por FINALIZADO
- [ ] Admin puede filtrar por REABIERTO

**Prueba:**
```http
GET /api/tickets/estado/NO_ATENDIDO
GET /api/tickets/estado/ATENDIDO
GET /api/tickets/estado/RESUELTO
GET /api/tickets/estado/FINALIZADO
GET /api/tickets/estado/REABIERTO
```

---

### 17. TODOS - Cambiar Contraseña
- [ ] Usuario puede cambiar su contraseña
- [ ] Requiere contraseña actual correcta
- [ ] forzarCambio se pone en false
- [ ] Contraseña incorrecta da error

**Prueba:**
```http
PUT /api/users/change-password
{
  "passwordActual": "1",
  "passwordNueva": "nueva123"
}
```

---

### 18. ESTADÍSTICAS GENERALES
- [ ] Se muestran todos los contadores
- [ ] Contadores son correctos

**Prueba:**
```http
GET /api/tickets/stats
```

---

## 🎯 FLUJOS COMPLETOS A PROBAR

### Flujo 1: Ciclo Exitoso
```
1. Trabajador crea ticket → NO_ATENDIDO
2. Técnico toma ticket → ATENDIDO
3. Técnico resuelve → RESUELTO
4. Trabajador confirma → FINALIZADO
```

### Flujo 2: Rechazo y Reapertura
```
1. Ticket en RESUELTO
2. Trabajador rechaza → REABIERTO + falla
3. Otro técnico toma → ATENDIDO
4. Resuelve → RESUELTO
5. Confirma → FINALIZADO + limpia falla
```

### Flujo 3: Bloqueo de Técnico
```
1. Técnico resuelve 3 tickets
2. Trabajador rechaza los 3
3. Técnico recibe 3 fallas → BLOQUEADO
4. Técnico no puede tomar más tickets
5. Admin desbloquea → fallas = 0
```

### Flujo 4: Límite de 3 Tickets
```
1. Técnico toma ticket 1 → OK
2. Técnico toma ticket 2 → OK
3. Técnico toma ticket 3 → OK
4. Técnico intenta tomar ticket 4 → ERROR
5. Técnico resuelve ticket 1
6. Trabajador confirma ticket 1 → FINALIZADO
7. Técnico puede tomar ticket 4 → OK
```

---

## 📋 VALIDACIONES DE SEGURIDAD

- [ ] Solo trabajadores pueden crear tickets
- [ ] Solo técnicos pueden atender tickets
- [ ] Solo admin puede crear usuarios
- [ ] Solo admin puede bloquear/desbloquear
- [ ] Solo admin puede blanquear passwords
- [ ] Solo admin puede reabrir tickets
- [ ] Solo técnico asignado puede resolver
- [ ] Solo trabajador creador puede confirmar
- [ ] Técnico bloqueado no puede atender

---

## 🐛 CASOS DE ERROR A VERIFICAR

- [ ] Crear ticket con técnico → Error
- [ ] Tomar 4to ticket → Error
- [ ] Técnico bloqueado toma ticket → Error
- [ ] Resolver ticket de otro técnico → Error
- [ ] Confirmar ticket de otro trabajador → Error
- [ ] No-admin crea usuario → Error
- [ ] No-admin bloquea usuario → Error
- [ ] No-admin blanquea password → Error
- [ ] No-admin reabre ticket → Error

---

## ✅ RESULTADO ESPERADO

**TODAS las pruebas deben pasar** para considerar el sistema completo y funcional según la consigna.

---

## 📊 DATOS DE PRUEBA

```
Admin:      ID=1, email=admin@iset.com,  password=1
Técnico:    ID=2, email=juan@iset.com,   password=2
Trabajador: ID=3, email=pedro@iset.com,  password=3
```

---

## 🚀 INICIAR PRUEBAS

```bash
# 1. Iniciar aplicación
cd tpFinal
./mvnw.cmd spring-boot:run

# 2. Usar Postman, Insomnia o curl para probar endpoints
# 3. Marcar cada checkbox al completar la prueba
# 4. Documentar cualquier error encontrado
```
