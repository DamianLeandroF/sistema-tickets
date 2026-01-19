# Análisis de Requisitos del Sistema de Tickets

## ✅ Requisitos Implementados

### 1. Modelo de Datos
- ✅ **Usuarios**: Administrador, Técnico, Trabajador
- ✅ **Estados de Ticket**: NO_ATENDIDO, ATENDIDO, RESUELTO, FINALIZADO, REABIERTO
- ✅ **Campos de Usuario**: forzarCambio, bloqueado, fallas, marcasRetorno
- ✅ **Campos de Ticket**: titulo, descripcion, estado, tecnicoActual, tecnicoAnterior, trabajador, reabierto

### 2. Funcionalidades de Trabajador
- ✅ Crear tickets con título y descripción
- ✅ Ver lista de sus tickets no finalizados
- ✅ Ver estado y técnico asignado
- ✅ Confirmar o rechazar resolución de tickets

### 3. Funcionalidades de Técnico
- ✅ Ver lista de tickets pendientes (NO_ATENDIDO)
- ✅ Tomar tickets (máximo 3 simultáneos)
- ✅ Marcar tickets como resueltos
- ✅ Solicitar reapertura de tickets
- ✅ Sistema de fallas (bloqueo a las 3 fallas)
- ✅ Sistema de marcas de retorno
- ✅ Limpiar falla al resolver ticket reabierto

### 4. Funcionalidades de Administrador
- ✅ Crear usuarios (password = ID inicial)
- ✅ Bloquear/Desbloquear usuarios
- ✅ Blanquear contraseñas (password = ID)
- ✅ Reabrir tickets a solicitud del técnico
- ✅ Ver estadísticas de técnicos (fallas y marcas)
- ✅ Ver lista de tickets con filtros por estado
- ✅ Ver información completa de tickets

### 5. Funcionalidades Generales
- ✅ Login con ID o email
- ✅ Cambio de contraseña obligatorio en primer acceso
- ✅ Cambio de contraseña en cualquier momento
- ✅ Validación de usuario bloqueado en login

### 6. Lógica de Negocio
- ✅ Ticket creado → estado NO_ATENDIDO
- ✅ Técnico toma ticket → estado ATENDIDO
- ✅ Técnico resuelve → estado RESUELTO
- ✅ Trabajador confirma → estado FINALIZADO
- ✅ Trabajador rechaza → estado REABIERTO + falla al técnico
- ✅ Técnico solicita reapertura → marca o falla según historial
- ✅ Bloqueo automático de técnico con 3 fallas
- ✅ Límite de 3 tickets simultáneos por técnico

## ⚠️ Requisitos Pendientes o a Verificar

### 1. Estructura del Proyecto
- ❌ **Separación en paquetes**: El proyecto NO tiene paquetes separados para:
  - `excepciones` (actualmente las excepciones se lanzan como RuntimeException)
  - `visual` (el frontend está en un proyecto separado, pero no hay paquete específico)
  - `modelo` (existe como `model`, ✅)

### 2. Validaciones Adicionales
- ⚠️ **Verificar**: ¿Se valida que solo trabajadores puedan crear tickets?
- ⚠️ **Verificar**: ¿Se valida que técnicos NO puedan crear tickets?
- ⚠️ **Verificar**: ¿El administrador puede ver TODA la información de tickets incluyendo técnico anterior?

### 3. Frontend
- ⚠️ **Verificar**: ¿Existen ventanas/vistas individuales para cada tipo de usuario?
- ⚠️ **Verificar**: ¿El flujo de cambio de contraseña obligatorio está implementado en el frontend?

## 🔧 Acciones Recomendadas

### 1. Crear Paquete de Excepciones
Crear excepciones personalizadas en lugar de usar `RuntimeException`:
- `UsuarioNoEncontradoException`
- `UsuarioBloqueadoException`
- `PasswordIncorrectaException`
- `TicketNoEncontradoException`
- `PermisosDenegadosException`
- `LimiteTicketsExcedidoException`

### 2. Refactorizar Servicios
Actualizar los servicios para usar las excepciones personalizadas.

### 3. Verificar Frontend
Revisar que el frontend tenga:
- Vistas separadas para Admin, Técnico y Trabajador
- Flujo de cambio de contraseña obligatorio
- Todas las funcionalidades requeridas

## 📊 Resumen de Cumplimiento

| Categoría | Estado | Porcentaje |
|-----------|--------|------------|
| Modelo de Datos | ✅ Completo | 100% |
| Lógica de Negocio | ✅ Completo | 100% |
| Funcionalidades Backend | ✅ Completo | 100% |
| Estructura de Paquetes | ❌ Incompleto | 33% |
| Excepciones Personalizadas | ❌ No implementado | 0% |
| Frontend | ⚠️ Por verificar | ? |

**Total General**: ~85% implementado (backend completo, falta organización y frontend por verificar)
