import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Ticket, PlusCircle, User, HelpCircle, LogOut } from 'lucide-react';

/**
 * Componente Sidebar - Menú lateral de navegación
 * 
 * Este componente muestra el menú lateral con las opciones principales
 * de navegación de la aplicación.
 * 
 * NOTA: El contenido visible puede variar según el rol del usuario
 * (Administrador, Técnico, Trabajador) pero la lógica de roles
 * NO está implementada en el frontend.
 */
export default function Sidebar() {
  const navigate = useNavigate();

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.rol || user.tipo; // Soporta ambos formatos por si acaso

  // Estilos para los enlaces activos e inactivos
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <aside className="w-64 bg-white h-screen shadow-md flex flex-col fixed left-0 top-0">
      {/* Header del sidebar */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl text-gray-800">Gestión de Tickets</h1>
        <p className="text-sm text-gray-500 mt-1">Sistema POO</p>
      </div>

      {/* Navegación principal */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {/* Inicio / Dashboard */}
          <li>
            <NavLink to="/dashboard" className={linkClasses}>
              <Home size={20} />
              <span>Inicio</span>
            </NavLink>
          </li>

          {/* Tickets (Listado) */}
          <li>
            <NavLink to="/tickets" className={linkClasses}>
              <Ticket size={20} />
              <span>Tickets</span>
            </NavLink>
          </li>

          {/* Crear Ticket */}
          {role === 'trabajador' && (
          <li>
            <NavLink to="/create-ticket" className={linkClasses}>
              <PlusCircle size={20} />
              <span>Crear Ticket</span>
            </NavLink>
          </li>
          )}

          {/* Perfil */}
          <li>
            <NavLink to="/perfil" className={linkClasses}>
              <User size={20} />
              <span>Perfil</span>
            </NavLink>
          </li>

          {/* Soporte */}
          <li>
            <NavLink to="/soporte" className={linkClasses}>
              <HelpCircle size={20} />
              <span>Soporte</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Botón de cerrar sesión */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
