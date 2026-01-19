# 🎫 Sistema de Gestión de Tickets

Sistema completo de gestión de tickets con roles diferenciados (Administrador, Técnico, Trabajador) desarrollado con Spring Boot y React.

## 📋 Características Principales

### 👨‍💼 Administrador
- ✅ Gestión completa de usuarios (bloquear/desbloquear)
- ✅ Blanqueo de contraseñas
- ✅ Visualización de estadísticas de técnicos
- ✅ Monitoreo de fallas y marcas de retorno
- ✅ Vista de todos los tickets del sistema

### 🔧 Técnico
- ✅ Visualización de tickets pendientes (NO_ATENDIDO y REABIERTO)
- ✅ Asignación de tickets (máximo 3 simultáneos)
- ✅ Resolución de tickets
- ✅ Solicitud de reapertura de tickets
- ✅ Sistema de fallas (bloqueado automático al llegar a 3)

### 👷 Trabajador
- ✅ Creación de tickets
- ✅ Visualización de sus tickets
- ✅ Confirmación o rechazo de resoluciones
- ✅ Seguimiento del estado de tickets

## 🛠️ Tecnologías

### Backend
- **Java 17**
- **Spring Boot 3.x**
- **Spring Data JPA**
- **MySQL**
- **Maven**

### Frontend
- **React 18**
- **React Router DOM**
- **Vite**
- **TailwindCSS** (opcional)
- **Lucide React** (iconos)

## 📦 Instalación

### Requisitos Previos
- Java 17 o superior
- Node.js 18 o superior
- MySQL 5.7 o superior
- Maven (incluido en el proyecto con wrapper)

### 1. Configurar Base de Datos

```sql
CREATE DATABASE sistema_tickets;
```

### 2. Configurar Backend

1. Navegar a la carpeta del backend:
```bash
cd tpFinal
```

2. Configurar `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sistema_tickets
spring.datasource.username=root
spring.datasource.password=tu_password
spring.jpa.hibernate.ddl-auto=update
```

3. Ejecutar el backend:
```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

El backend estará disponible en `http://localhost:8080`

### 3. Configurar Frontend

1. Navegar a la carpeta del frontend:
```bash
cd "Frontend Ticket Management App"
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar el frontend:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 👥 Usuarios por Defecto

El sistema crea automáticamente 3 usuarios de prueba:

| Rol | Email | Password |
|-----|-------|----------|
| Administrador | admin@iset.com | 1 |
| Técnico | juan@iset.com | 2 |
| Trabajador | pedro@iset.com | 3 |

## 🔐 Reglas de Negocio

### Sistema de Fallas para Técnicos
- Un técnico acumula una **falla** cuando un trabajador rechaza su resolución
- Al llegar a **3 fallas**, el técnico es **bloqueado automáticamente**
- Solo un administrador puede desbloquear al técnico

### Límite de Tickets por Técnico
- Un técnico puede tener máximo **3 tickets** asignados simultáneamente
- Estados que cuentan: ATENDIDO y RESUELTO
- Debe resolver al menos uno antes de tomar otro

### Marcas de Retorno
- Se registra cuando un técnico solicita la reapertura de un ticket
- Sirve para estadísticas y evaluación de desempeño

### Estados de Tickets
1. **No atendido**: Ticket recién creado
2. **Atendido**: Asignado a un técnico
3. **Resuelto**: Técnico marcó como resuelto, esperando confirmación
4. **Finalizado**: Trabajador confirmó la resolución
5. **Reabierto**: Trabajador rechazó la resolución

## 📁 Estructura del Proyecto

```
sistema-tickets/
├── tpFinal/                          # Backend Spring Boot
│   ├── src/main/java/
│   │   └── com/grupo/tpFinal/
│   │       ├── config/               # Configuraciones
│   │       ├── controller/           # Controladores REST
│   │       ├── enums/                # Enumeraciones
│   │       ├── excepciones/          # Excepciones personalizadas
│   │       ├── model/                # Entidades JPA
│   │       ├── repository/           # Repositorios
│   │       └── service/              # Lógica de negocio
│   └── src/main/resources/
│       └── application.properties    # Configuración
│
└── Frontend Ticket Management App/  # Frontend React
    └── src/
        ├── app/
        │   ├── components/           # Componentes reutilizables
        │   ├── pages/                # Páginas/Vistas
        │   └── App.tsx               # Componente principal
        └── index.css                 # Estilos globales
```

## 🔌 API Endpoints

### Usuarios
- `POST /api/usuarios/login` - Iniciar sesión
- `GET /api/usuarios` - Listar todos los usuarios (Admin)
- `PUT /api/usuarios/{id}/bloquear/{adminId}` - Bloquear usuario
- `PUT /api/usuarios/{id}/desbloquear/{adminId}` - Desbloquear usuario
- `PUT /api/usuarios/{id}/blanquear/{adminId}` - Blanquear contraseña
- `PUT /api/usuarios/{id}/update-password` - Cambiar contraseña

### Tickets
- `GET /api/tickets` - Listar todos los tickets (Admin)
- `GET /api/tickets/trabajador/{id}` - Tickets de un trabajador
- `GET /api/tickets/tecnico/{id}` - Tickets de un técnico
- `GET /api/tickets/estado/{estado}` - Tickets por estado
- `POST /api/tickets/crear/{trabajadorId}` - Crear ticket
- `PUT /api/tickets/{id}/asignar/{tecnicoId}` - Asignar ticket
- `PUT /api/tickets/{id}/resolver/{tecnicoId}` - Resolver ticket
- `PUT /api/tickets/{id}/confirmar/{trabajadorId}` - Confirmar/Rechazar resolución
- `PUT /api/tickets/{id}/solicitar-reapertura/{tecnicoId}` - Solicitar reapertura

## 🎨 Capturas de Pantalla

### Login
![Login](docs/screenshots/login.png)

### Dashboard Técnico
![Dashboard](docs/screenshots/dashboard-tecnico.png)

### Panel de Administración
![Admin](docs/screenshots/admin-panel.png)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

**Damian Leandro F**
- GitHub: [@DamianLeandroF](https://github.com/DamianLeandroF)

## 🙏 Agradecimientos

- Spring Boot Documentation
- React Documentation
- Comunidad de desarrolladores

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!
