import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importar páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import CreateTicket from './pages/CreateTicket';
import Perfil from './pages/Perfil';
import Soporte from './pages/Soporte';

/**
 * Componente Principal App
 * 
 * Este es el componente raíz de la aplicación de gestión de tickets.
 * Implementa el sistema de routing usando React Router.
 * 
 * RUTAS:
 * - / : Login (pantalla inicial)
 * - /dashboard : Dashboard con resumen de tickets
 * - /tickets : Listado de tickets
 * - /create-ticket : Formulario para crear nuevo ticket
 * - /perfil : Información del usuario
 * - /soporte : Página de ayuda y soporte
 * 
 * NOTAS IMPORTANTES:
 * - No hay autenticación real implementada
 * - No hay protección de rutas
 * - No hay manejo de roles en el frontend
 * - Todo esto debe implementarse cuando se conecte con el backend Spring Boot
 */
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de login (página inicial) */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas (sin protección real por ahora) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/create-ticket" element={<CreateTicket />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/soporte" element={<Soporte />} />

        {/* Ruta por defecto: redirigir al login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

/**
 * MODELO DE OBJETOS (Representación conceptual)
 * 
 * Estos son los objetos principales que el backend debe manejar:
 * 
 * 1. Usuario:
 *    - id: number
 *    - nombre: string
 *    - email: string
 *    - password: string (hasheado)
 *    - rol: Enum (ADMINISTRADOR, TECNICO, TRABAJADOR)
 * 
 * 2. Ticket:
 *    - id: number
 *    - titulo: string
 *    - descripcion: string
 *    - estado: Enum (PENDIENTE, EN_PROCESO, RESUELTO, FINALIZADO)
 *    - trabajadorId: number (FK a Usuario)
 *    - tecnicoId: number | null (FK a Usuario)
 *    - fechaCreacion: Date
 *    - fechaActualizacion: Date
 * 
 * 3. Estados del Ticket:
 *    - PENDIENTE: Ticket creado, esperando asignación
 *    - EN_PROCESO: Ticket asignado a un técnico y en resolución
 *    - RESUELTO: Técnico marcó el ticket como resuelto
 *    - FINALIZADO: Trabajador confirmó la resolución
 * 
 * TRANSICIONES DE ESTADO:
 * - PENDIENTE -> EN_PROCESO: Cuando un técnico toma el ticket (acción: "atender")
 * - EN_PROCESO -> RESUELTO: Cuando el técnico resuelve el problema (acción: "resolver")
 * - RESUELTO -> FINALIZADO: Cuando el trabajador confirma (acción: "confirmar")
 * 
 * ENDPOINTS NECESARIOS:
 * 
 * Autenticación:
 * - POST /api/auth/login
 *   Body: { userId, password }
 *   Response: { token, user: { id, nombre, email, rol } }
 * 
 * - POST /api/auth/logout
 * 
 * Tickets:
 * - GET /api/tickets
 *   Retorna tickets según el rol del usuario autenticado
 *   - Trabajador: Solo sus tickets
 *   - Técnico: Tickets pendientes y los asignados a él
 *   - Administrador: Todos los tickets
 * 
 * - GET /api/tickets/stats
 *   Retorna: { pendientes, atendidos, finalizados }
 * 
 * - POST /api/tickets
 *   Body: { titulo, descripcion }
 *   Crea un nuevo ticket asociado al usuario autenticado
 * 
 * - PUT /api/tickets/{id}/estado
 *   Body: { accion: "atender" | "resolver" | "confirmar" }
 *   Cambia el estado del ticket según la acción
 * 
 * Usuarios:
 * - GET /api/users/me
 *   Retorna información del usuario autenticado
 * 
 * - PUT /api/users/change-password
 *   Body: { currentPassword, newPassword }
 * 
 * - GET /api/users (solo admin)
 *   Retorna lista de todos los usuarios
 */
