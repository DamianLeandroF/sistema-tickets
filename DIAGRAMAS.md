# Diagramas del Sistema de Tickets

## 📊 Diagrama de Estados de Tickets

```
┌─────────────────────────────────────────────────────────────────┐
│                    CICLO DE VIDA DE UN TICKET                    │
└─────────────────────────────────────────────────────────────────┘

    [Trabajador crea ticket]
              │
              ▼
      ┌───────────────┐
      │ NO_ATENDIDO   │◄──────────────┐
      └───────┬───────┘               │
              │                       │
    [Técnico toma ticket]             │
              │                       │
              ▼                       │
      ┌───────────────┐               │
      │   ATENDIDO    │               │
      └───────┬───────┘               │
              │                       │
    [Técnico marca resuelto]          │
              │                       │
              ▼                       │
      ┌───────────────┐               │
      │   RESUELTO    │               │
      └───────┬───────┘               │
              │                       │
         ┌────┴────┐                  │
         │         │                  │
    [Confirma] [Rechaza]              │
         │         │                  │
         ▼         ▼                  │
   ┌──────────┐ ┌──────────┐         │
   │FINALIZADO│ │REABIERTO │─────────┘
   └──────────┘ └──────────┘
                     │
                     │ [Otro técnico toma]
                     │
                     ▼
                ┌──────────┐
                │ ATENDIDO │
                └──────────┘
```

---

## 👥 Diagrama de Roles y Permisos

```
┌─────────────────────────────────────────────────────────────────┐
│                         ADMINISTRADOR                            │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Crear usuarios (trabajadores y técnicos)                      │
│ ✓ Bloquear/Desbloquear usuarios                                 │
│ ✓ Blanquear contraseñas (resetear a ID)                         │
│ ✓ Reabrir tickets a solicitud del técnico                       │
│ ✓ Ver estadísticas de técnicos (fallas y marcas)                │
│ ✓ Filtrar tickets por estado                                    │
│ ✓ Ver información completa de todos los tickets                 │
│ ✓ Cambiar su propia contraseña                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                            TÉCNICO                               │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Ver tickets pendientes (NO_ATENDIDO y REABIERTO)              │
│ ✓ Tomar tickets (máximo 3 simultáneos)                          │
│ ✓ Marcar tickets como RESUELTO                                  │
│ ✓ Solicitar reapertura de tickets al admin                      │
│ ✓ Ver sus tickets asignados                                     │
│ ✓ Cambiar su propia contraseña                                  │
│ ✗ NO puede crear tickets                                        │
│ ✗ NO puede tomar más de 3 tickets                               │
│ ✗ NO puede atender si está bloqueado                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          TRABAJADOR                              │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Crear tickets con título y descripción                        │
│ ✓ Ver lista de sus tickets (no finalizados)                     │
│ ✓ Ver estado y técnico asignado de cada ticket                  │
│ ✓ Confirmar resolución de tickets                               │
│ ✓ Rechazar resolución de tickets                                │
│ ✓ Cambiar su propia contraseña                                  │
│ ✗ NO puede atender tickets                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo: Creación y Resolución Exitosa

```
TRABAJADOR                TÉCNICO                 SISTEMA
    │                        │                       │
    │ 1. Crear ticket        │                       │
    ├───────────────────────────────────────────────►│
    │                        │                       │
    │                        │                  [NO_ATENDIDO]
    │                        │                       │
    │                        │ 2. Tomar ticket       │
    │                        ├──────────────────────►│
    │                        │                       │
    │                        │                  [ATENDIDO]
    │                        │                       │
    │                        │ 3. Marcar resuelto    │
    │                        ├──────────────────────►│
    │                        │                       │
    │                        │                  [RESUELTO]
    │                        │                       │
    │ 4. Confirmar           │                       │
    ├───────────────────────────────────────────────►│
    │                        │                       │
    │                        │                  [FINALIZADO]
    │                        │                       │
    ▼                        ▼                       ▼
```

---

## ⚠️ Flujo: Rechazo y Sistema de Fallas

```
TRABAJADOR                TÉCNICO                 SISTEMA
    │                        │                       │
    │                        │                  [RESUELTO]
    │                        │                       │
    │ 1. Rechazar            │                       │
    ├───────────────────────────────────────────────►│
    │                        │                       │
    │                        │                  [REABIERTO]
    │                        │                  Fallas: +1
    │                        │                       │
    │                        │◄──────────────────────┤
    │                        │  (Falla registrada)   │
    │                        │                       │
    │                    [OTRO TÉCNICO]              │
    │                        │                       │
    │                        │ 2. Tomar ticket       │
    │                        ├──────────────────────►│
    │                        │                       │
    │                        │                  [ATENDIDO]
    │                        │                       │
    │                        │ 3. Marcar resuelto    │
    │                        ├──────────────────────►│
    │                        │                       │
    │                        │                  [RESUELTO]
    │                        │                       │
    │ 4. Confirmar           │                       │
    ├───────────────────────────────────────────────►│
    │                        │                       │
    │                        │                  [FINALIZADO]
    │                        │                  Fallas: -1
    │                        │                  (limpieza)
    │                        │                       │
    ▼                        ▼                       ▼
```

---

## 🚫 Flujo: Bloqueo por 3 Fallas

```
TÉCNICO                    SISTEMA                  ADMIN
   │                          │                       │
   │                     Fallas: 0                    │
   │                          │                       │
   │ [Rechazo 1]              │                       │
   ├─────────────────────────►│                       │
   │                     Fallas: 1                    │
   │                          │                       │
   │ [Rechazo 2]              │                       │
   ├─────────────────────────►│                       │
   │                     Fallas: 2                    │
   │                          │                       │
   │ [Rechazo 3]              │                       │
   ├─────────────────────────►│                       │
   │                     Fallas: 3                    │
   │                     BLOQUEADO: true              │
   │                          │                       │
   │◄─────────────────────────┤                       │
   │  (No puede atender)      │                       │
   │                          │                       │
   │                          │   Desbloquear         │
   │                          │◄──────────────────────┤
   │                          │                       │
   │                     Fallas: 0                    │
   │                     BLOQUEADO: false             │
   │                          │                       │
   │◄─────────────────────────┤                       │
   │  (Puede atender)         │                       │
   │                          │                       │
   ▼                          ▼                       ▼
```

---

## 🎯 Flujo: Límite de 3 Tickets

```
TÉCNICO                    SISTEMA
   │                          │
   │ Tomar ticket 1           │
   ├─────────────────────────►│
   │                     Asignados: 1 ✓
   │                          │
   │ Tomar ticket 2           │
   ├─────────────────────────►│
   │                     Asignados: 2 ✓
   │                          │
   │ Tomar ticket 3           │
   ├─────────────────────────►│
   │                     Asignados: 3 ✓
   │                          │
   │ Tomar ticket 4           │
   ├─────────────────────────►│
   │                     Asignados: 3 ✗
   │◄─────────────────────────┤
   │  ERROR: Máximo 3 tickets │
   │                          │
   │ Resolver ticket 1        │
   ├─────────────────────────►│
   │                     [RESUELTO]
   │                          │
   │ [Trabajador confirma]    │
   ├─────────────────────────►│
   │                     [FINALIZADO]
   │                     Asignados: 2
   │                          │
   │ Tomar ticket 4           │
   ├─────────────────────────►│
   │                     Asignados: 3 ✓
   │                          │
   ▼                          ▼
```

---

## 📋 Flujo: Sistema de Marcas de Retorno

```
TÉCNICO                    SISTEMA                  ADMIN
   │                          │                       │
   │ Solicitar reapertura 1   │                       │
   ├─────────────────────────►│                       │
   │                     Marcas: 1                    │
   │                     Fallas: 0                    │
   │                          │                       │
   │                          │   Aprobar reapertura  │
   │                          │◄──────────────────────┤
   │                          │                       │
   │                     [REABIERTO]                  │
   │                          │                       │
   │ Solicitar reapertura 2   │                       │
   ├─────────────────────────►│                       │
   │                     Marcas: 0                    │
   │                     Fallas: 1                    │
   │                          │                       │
   ▼                          ▼                       ▼
```

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React/Angular/Vue)             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/REST
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                         CONTROLLERS                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │TicketController│  │UserController│  │AuthController│          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼──────────────────┘
          │                  │                  │
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼──────────────────┐
│                          SERVICES                                 │
│  ┌──────────────┐  ┌──────────────┐                              │
│  │TicketService │  │UsuarioService│                              │
│  └──────┬───────┘  └──────┬───────┘                              │
└─────────┼──────────────────┼────────────────────────────────────┘
          │                  │
          │                  │
┌─────────▼──────────────────▼────────────────────────────────────┐
│                        REPOSITORIES                               │
│  ┌──────────────┐  ┌──────────────┐                              │
│  │TicketRepository│  │UsuarioRepository│                          │
│  └──────┬───────┘  └──────┬───────┘                              │
└─────────┼──────────────────┼────────────────────────────────────┘
          │                  │
          │    JPA/Hibernate │
          │                  │
┌─────────▼──────────────────▼────────────────────────────────────┐
│                         MySQL DATABASE                            │
│  ┌──────────────┐  ┌──────────────┐                              │
│  │ Tabla: tickets│  │Tabla: usuarios│                             │
│  └──────────────┘  └──────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Modelo de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│                         TABLA: usuarios                          │
├─────────────────────────────────────────────────────────────────┤
│ id (PK)              │ BIGINT                                    │
│ nombre               │ VARCHAR(100)                              │
│ email                │ VARCHAR(255)                              │
│ password             │ VARCHAR(255)                              │
│ rol                  │ ENUM(ADMINISTRADOR, TECNICO, TRABAJADOR)  │
│ forzar_cambio        │ BOOLEAN (default: true)                   │
│ bloqueado            │ BOOLEAN (default: false)                  │
│ fallas               │ INT (default: 0)                          │
│ marcas_retorno       │ INT (default: 0)                          │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1:N
                                    │
┌─────────────────────────────────────────────────────────────────┐
│                         TABLA: tickets                           │
├─────────────────────────────────────────────────────────────────┤
│ id (PK)              │ BIGINT                                    │
│ titulo               │ VARCHAR(150)                              │
│ descripcion          │ TEXT                                      │
│ estado               │ ENUM(NO_ATENDIDO, ATENDIDO, RESUELTO,    │
│                      │      FINALIZADO, REABIERTO)               │
│ trabajador_id (FK)   │ BIGINT → usuarios.id                      │
│ tecnico_actual_id    │ BIGINT → usuarios.id (nullable)           │
│ tecnico_anterior_id  │ BIGINT → usuarios.id (nullable)           │
│ reabierto            │ BOOLEAN (default: false)                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Matriz de Permisos

```
┌──────────────────┬──────┬─────────┬────────────┐
│ ACCIÓN           │ ADMIN│ TÉCNICO │ TRABAJADOR │
├──────────────────┼──────┼─────────┼────────────┤
│ Crear ticket     │  ✗   │    ✗    │     ✓      │
│ Ver pendientes   │  ✓   │    ✓    │     ✗      │
│ Tomar ticket     │  ✗   │    ✓    │     ✗      │
│ Resolver ticket  │  ✗   │    ✓    │     ✗      │
│ Confirmar resol. │  ✗   │    ✗    │     ✓      │
│ Crear usuario    │  ✓   │    ✗    │     ✗      │
│ Bloquear usuario │  ✓   │    ✗    │     ✗      │
│ Blanquear pass   │  ✓   │    ✗    │     ✗      │
│ Reabrir ticket   │  ✓   │    ✗    │     ✗      │
│ Ver estadísticas │  ✓   │    ✗    │     ✗      │
│ Cambiar password │  ✓   │    ✓    │     ✓      │
└──────────────────┴──────┴─────────┴────────────┘
```

---

## 📊 Contadores y Límites

```
┌─────────────────────────────────────────────────────────────────┐
│                    LÍMITES DEL SISTEMA                           │
├─────────────────────────────────────────────────────────────────┤
│ Tickets por técnico (simultáneos)  │ Máximo: 3                  │
│ Fallas antes de bloqueo             │ Máximo: 3                  │
│ Marcas de retorno                   │ Máximo: 1                  │
│ Intentos de login                   │ Sin límite                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  CÁLCULO DE TICKETS ACTIVOS                      │
├─────────────────────────────────────────────────────────────────┤
│ Tickets activos = COUNT(estado IN [ATENDIDO, RESUELTO])         │
│                   WHERE tecnico_actual_id = {tecnicoId}          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Reglas de Transición de Estados

```
Estado Actual    │ Acción                │ Estado Nuevo   │ Condiciones
─────────────────┼───────────────────────┼────────────────┼──────────────
NO_ATENDIDO      │ Técnico toma          │ ATENDIDO       │ Técnico < 3 tickets
                 │                       │                │ Técnico no bloqueado
─────────────────┼───────────────────────┼────────────────┼──────────────
ATENDIDO         │ Técnico resuelve      │ RESUELTO       │ Es el técnico asignado
─────────────────┼───────────────────────┼────────────────┼──────────────
ATENDIDO         │ Admin reabre          │ REABIERTO      │ Es admin
─────────────────┼───────────────────────┼────────────────┼──────────────
RESUELTO         │ Trabajador confirma   │ FINALIZADO     │ Es el creador
─────────────────┼───────────────────────┼────────────────┼──────────────
RESUELTO         │ Trabajador rechaza    │ REABIERTO      │ Es el creador
                 │                       │                │ +1 falla al técnico
─────────────────┼───────────────────────┼────────────────┼──────────────
RESUELTO         │ Admin reabre          │ REABIERTO      │ Es admin
─────────────────┼───────────────────────┼────────────────┼──────────────
REABIERTO        │ Técnico toma          │ ATENDIDO       │ Técnico < 3 tickets
                 │                       │                │ Técnico no bloqueado
```

---

**Estos diagramas muestran visualmente cómo funciona el sistema completo** 📊
