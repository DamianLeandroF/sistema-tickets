# Conexión Frontend-Backend - Sistema de Tickets

## ✅ Estado Actual

El frontend y backend están **completamente conectados y funcionando**.

## 🚀 Cómo Ejecutar

### Backend (Puerto 8080)

```bash
cd "c:\Users\damia\OneDrive\Escritorio\sistema-Tickets-main\sistema-Tickets-main\tpFinal"
.\mvnw.cmd spring-boot:run
```

El backend estará disponible en: `http://localhost:8080`

### Frontend (Puerto 5173)

```bash
cd "c:\Users\damia\OneDrive\Escritorio\sistema-Tickets-main\sistema-Tickets-main\Frontend Ticket Management App"
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 👥 Usuarios de Prueba

El sistema viene con 3 usuarios pre-configurados:

| Rol | Email | Password | ID |
|-----|-------|----------|-----|
| **Administrador** | admin@iset.com | 1 | 1 |
| **Técnico** | juan@iset.com | 2 | 2 |
| **Trabajador** | pedro@iset.com | 3 | 3 |

## 🔌 Endpoints API Disponibles

### Autenticación

#### POST `/api/auth/login`
```json
Request:
{
  "userId": "admin@iset.com",  // puede ser email o ID
  "password": "1"
}

Response:
{
  "token": "uuid-token-aqui",
  "user": {
    "id": 1,
    "nombre": "Administrador",
    "email": "admin@iset.com",
    "rol": "ADMINISTRADOR",
    "fallas": 0,
    "marcasRetorno": 0
  }
}
```

### Tickets

- `GET /api/tickets` - Obtener todos los tickets
- `GET /api/tickets/pendientes` - Obtener tickets pendientes
- `POST /api/tickets?trabajadorId={id}` - Crear nuevo ticket
- `PUT /api/tickets/{id}/estado` - Actualizar estado del ticket
- `POST /api/tickets/{id}/asignar/{tecnicoId}` - Asignar ticket a técnico

### Usuarios

- `GET /api/users` - Obtener todos los usuarios (solo admin)
- `GET /api/users/me` - Obtener usuario actual
- `PUT /api/users/change-password` - Cambiar contraseña

## 🔧 Configuración

### Base de Datos

El backend está configurado para conectarse a MySQL:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sistema_tickets
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update
```

### CORS

El backend permite peticiones desde:
- `http://localhost:5173` (Vite default)
- `http://localhost:5174`
- `http://localhost:3000`

## 📝 Características Implementadas

### Backend
- ✅ Autenticación con validación de contraseña
- ✅ Bloqueo de usuario después de 3 intentos fallidos
- ✅ Búsqueda de usuario por email o ID
- ✅ DTOs completos para transferencia de datos
- ✅ Configuración CORS para desarrollo
- ✅ DataSeeder con datos de prueba
- ✅ Modelos completos (Usuario, Ticket)
- ✅ Enums (Rol, EstadoTicket)

### Frontend
- ✅ Página de Login
- ✅ Dashboard
- ✅ Gestión de Tickets
- ✅ Creación de Tickets
- ✅ Perfil de Usuario
- ✅ Soporte

## 🔄 Flujo de Estados de Tickets

```
PENDIENTE → EN_PROCESO → RESUELTO → FINALIZADO
                ↓
            REABIERTO
```

## 🐛 Solución de Problemas

### Error de conexión al backend

1. Verificar que MySQL esté corriendo
2. Verificar que la base de datos `sistema_tickets` exista
3. Verificar que el backend esté corriendo en puerto 8080

### Error de CORS

El backend ya está configurado con CORS. Si persiste el error:
1. Verificar que el frontend esté en uno de los puertos permitidos
2. Revisar `WebConfig.java`

### Datos antiguos incompatibles

Si hay problemas con datos antiguos:
1. Cambiar `spring.jpa.hibernate.ddl-auto=create` en `application.properties`
2. Reiniciar el backend (esto borrará y recreará las tablas)
3. Cambiar de vuelta a `update`

## 📦 Tecnologías

### Backend
- Spring Boot 3.5.9
- Spring Data JPA
- MySQL Connector
- Java 17

### Frontend
- React 18.3.1
- Vite 6.3.5
- React Router DOM 7.12.0
- Tailwind CSS 4.1.12
- Material UI 7.3.5
- Radix UI Components

## 🎯 Próximos Pasos

Para mejorar la aplicación:

1. **Seguridad**
   - Implementar JWT real en lugar de UUID
   - Agregar Spring Security
   - Hashear contraseñas (BCrypt)

2. **Funcionalidades**
   - Notificaciones en tiempo real
   - Historial de cambios en tickets
   - Filtros avanzados
   - Exportación de reportes

3. **UI/UX**
   - Mejorar diseño responsive
   - Agregar animaciones
   - Implementar tema oscuro
   - Agregar notificaciones toast

## 📞 Soporte

Si tienes problemas, verifica:
1. Los logs del backend en la consola
2. La consola del navegador (F12)
3. La pestaña Network para ver las peticiones HTTP
