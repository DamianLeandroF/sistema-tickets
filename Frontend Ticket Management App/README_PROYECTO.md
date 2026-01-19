# Sistema de Gestión de Tickets - Frontend

## 📋 Descripción del Proyecto

Frontend de una aplicación de gestión de tickets empresariales desarrollado para la materia de Programación Orientada a Objetos. El sistema permite a los usuarios crear y gestionar tickets de soporte técnico con diferentes roles (Administrador, Técnico, Trabajador).

## 🛠️ Stack Tecnológico

- **React 18.3.1** - Librería de UI
- **JavaScript** (NO TypeScript)
- **Tailwind CSS** - Framework de estilos
- **React Router DOM** - Navegación
- **Lucide React** - Iconos

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── Sidebar.jsx          # Menú lateral de navegación
│   │   └── TicketCard.jsx       # Card individual de ticket
│   ├── pages/
│   │   ├── Login.jsx            # Pantalla de inicio de sesión
│   │   ├── Dashboard.jsx        # Resumen de tickets
│   │   ├── Tickets.jsx          # Listado de tickets
│   │   ├── CreateTicket.jsx     # Formulario para crear tickets
│   │   ├── Perfil.jsx           # Información del usuario
│   │   └── Soporte.jsx          # Página de ayuda
│   └── App.tsx                  # Componente principal con routing
```

## 🎨 Pantallas Implementadas

### 1. Login
- Input para ID de usuario
- Input para contraseña
- Botón de ingresar
- **Endpoint esperado:** `POST /api/auth/login`

### 2. Dashboard (Inicio)
- Resumen de tickets pendientes
- Resumen de tickets atendidos
- Resumen de tickets finalizados
- Cards informativas con estadísticas
- **Endpoint esperado:** `GET /api/tickets/stats`

### 3. Tickets (Listado)
- Muestra todos los tickets en formato cards
- Cada card incluye:
  - Título del ticket
  - Estado (badge con color)
  - Técnico asignado
  - Fecha de creación
  - Botón de acción según estado
- **Endpoints esperados:**
  - `GET /api/tickets`
  - `PUT /api/tickets/{id}/estado`

### 4. Crear Ticket
- Formulario con:
  - Input de título
  - Textarea de descripción
  - Botones de cancelar y crear
- **Nota:** Solo visible para trabajadores
- **Endpoint esperado:** `POST /api/tickets`

### 5. Perfil
- Muestra información del usuario:
  - ID de usuario
  - Nombre completo
  - Email
  - Rol en el sistema
- Botón para cambiar contraseña
- Si es administrador: botón de gestionar usuarios
- **Endpoints esperados:**
  - `GET /api/users/me`
  - `PUT /api/users/change-password`

### 6. Soporte
- Información de contacto
- Horarios de atención
- Preguntas frecuentes
- Botones de contacto (placeholder)

## 📊 Modelo de Objetos

### Usuario
```javascript
{
  id: number,
  nombre: string,
  email: string,
  password: string, // hasheado
  rol: 'ADMINISTRADOR' | 'TECNICO' | 'TRABAJADOR'
}
```

### Ticket
```javascript
{
  id: number,
  titulo: string,
  descripcion: string,
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTO' | 'FINALIZADO',
  trabajadorId: number,
  tecnicoId: number | null,
  fechaCreacion: Date,
  fechaActualizacion: Date
}
```

## 🔄 Flujo de Estados de Ticket

```
PENDIENTE → EN_PROCESO → RESUELTO → FINALIZADO
   ↓            ↓           ↓
 Atender     Resolver   Confirmar
(Técnico)   (Técnico)  (Trabajador)
```

## 🔌 Endpoints de API REST

### Autenticación

**POST /api/auth/login**
```json
Body: {
  "userId": "string",
  "password": "string"
}
Response: {
  "token": "string",
  "user": {
    "id": number,
    "nombre": "string",
    "email": "string",
    "rol": "string"
  }
}
```

**POST /api/auth/logout**
- Invalida el token de sesión

### Tickets

**GET /api/tickets**
- Retorna tickets según el rol:
  - Trabajador: Solo sus tickets
  - Técnico: Tickets pendientes + asignados a él
  - Administrador: Todos los tickets

**GET /api/tickets/stats**
```json
Response: {
  "pendientes": number,
  "atendidos": number,
  "finalizados": number
}
```

**POST /api/tickets**
```json
Body: {
  "titulo": "string",
  "descripcion": "string"
}
```

**PUT /api/tickets/{id}/estado**
```json
Body: {
  "accion": "atender" | "resolver" | "confirmar"
}
```

### Usuarios

**GET /api/users/me**
- Retorna información del usuario autenticado

**PUT /api/users/change-password**
```json
Body: {
  "currentPassword": "string",
  "newPassword": "string"
}
```

**GET /api/users** (solo admin)
- Retorna lista de todos los usuarios

## 🚀 Instalación y Ejecución

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar en modo desarrollo:
```bash
npm run dev
```

3. Construir para producción:
```bash
npm run build
```

## ⚠️ Notas Importantes

- **No hay autenticación real implementada** - El login redirige directamente al dashboard
- **No hay protección de rutas** - Todas las rutas son accesibles sin autenticación
- **No hay manejo de roles en frontend** - La lógica de roles debe implementarse en el backend
- **Datos mock** - Todos los datos mostrados son de prueba
- **Funciones placeholder** - Todas las llamadas a API están comentadas con TODOs

## 🔧 Próximos Pasos para Integración con Backend

1. Implementar llamadas reales a los endpoints
2. Agregar manejo de tokens JWT
3. Implementar protección de rutas
4. Agregar manejo de errores
5. Implementar validaciones de formularios
6. Agregar loading states
7. Implementar refresh de datos
8. Agregar notificaciones toast

## 📝 Código Limpio y Comentado

Todo el código está:
- ✅ Bien comentado en español
- ✅ Con TODOs indicando dónde conectar el backend
- ✅ Estructurado de forma clara
- ✅ Sin dependencias innecesarias
- ✅ Preparado para defender en un examen oral

## 👥 Roles y Permisos

### Trabajador
- ✅ Crear tickets
- ✅ Ver sus propios tickets
- ✅ Confirmar tickets resueltos

### Técnico
- ✅ Ver tickets pendientes
- ✅ Atender tickets
- ✅ Resolver tickets

### Administrador
- ✅ Ver todos los tickets
- ✅ Gestionar usuarios
- ✅ Acceso completo al sistema

## 📚 Para la Defensa del Proyecto

Este frontend refleja claramente los conceptos de POO:
- **Encapsulación:** Componentes modulares y reutilizables
- **Abstracción:** Separación de lógica de presentación y negocio
- **Modelo de objetos:** Usuario, Ticket, Estados
- **Estados y transiciones:** Flujo claro de estados de ticket
- **Separación de responsabilidades:** Componentes especializados

---

**Proyecto desarrollado para la materia de Programación Orientada a Objetos**
