import React from 'react';

/**
 * Componente TicketCard - Card individual de ticket
 * 
 * Muestra la información de un ticket y los botones de acción según el estado y rol del usuario.
 * 
 * Props:
 * @param {Object} ticket - Objeto ticket del backend
 * @param {Function} onAction - Función callback para manejar las acciones
 * @param {String} userRole - Rol del usuario actual (TRABAJADOR, TECNICO, ADMINISTRADOR)
 */
export default function TicketCard({ ticket, onAction, userRole }) {
  const esAdmin = userRole === 'admin';
  // Mapeo de estados a colores para los badges
  const estadoColors = {
    'NO_ATENDIDO': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'ATENDIDO': 'bg-blue-100 text-blue-800 border-blue-300',
    'RESUELTO': 'bg-purple-100 text-purple-800 border-purple-300',
    'FINALIZADO': 'bg-green-100 text-green-800 border-green-300',
    'REABIERTO': 'bg-red-100 text-red-800 border-red-300',
    'SOLICITUD_REAPERTURA': 'bg-orange-100 text-orange-800 border-orange-300',
  };

  // Mapeo de estados a textos legibles
  const estadoTexts = {
    'NO_ATENDIDO': 'No Atendido',
    'ATENDIDO': 'Atendido',
    'RESUELTO': 'Resuelto',
    'FINALIZADO': 'Finalizado',
    'REABIERTO': 'Reabierto',
    'SOLICITUD_REAPERTURA': 'Solicitud de Reapertura',
  };

  // Mapeo de estados a iconos
  const estadoIcons = {
    'NO_ATENDIDO': '⏳',
    'ATENDIDO': '🔧',
    'RESUELTO': '✅',
    'FINALIZADO': '🎉',
    'REABIERTO': '🔄',
    'SOLICITUD_REAPERTURA': '❓',
  };

  // Determina qué botones mostrar según el estado y rol
  const getActionButtons = () => {
    const buttons = [];

    // TÉCNICO
    if (userRole === 'tecnico') {
      if (ticket.estado === 'NO_ATENDIDO' || ticket.estado === 'REABIERTO') {
        buttons.push(
          <button
            key="atender"
            onClick={() => onAction(ticket.id, 'atender')}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            📋 Atender
          </button>
        );
      } else if (ticket.estado === 'ATENDIDO') {
        buttons.push(
          <button
            key="resolver"
            onClick={() => onAction(ticket.id, 'resolver')}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            ✅ Marcar Resuelto
          </button>
        );
        buttons.push(
          <button
            key="solicitar-reapertura"
            onClick={() => onAction(ticket.id, 'solicitar-reapertura')}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm"
          >
            🔄 Solicitar Reapertura
          </button>
        );
      }
    }

    // TRABAJADOR
    if (userRole === 'trabajador') {
      if (ticket.estado === 'RESUELTO') {
        buttons.push(
          <button
            key="confirmar"
            onClick={() => onAction(ticket.id, 'confirmar')}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            ✅ Confirmar
          </button>
        );
        buttons.push(
          <button
            key="rechazar"
            onClick={() => onAction(ticket.id, 'rechazar')}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            ❌ Rechazar
          </button>
        );
      }
    }

    // ADMINISTRADOR
    if (userRole === 'admin') {
      if (ticket.estado === 'SOLICITUD_REAPERTURA') {
        buttons.push(
          <button
            key="reabrir"
            onClick={() => onAction(ticket.id, 'reabrir')}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            ✅ Aprobar Reapertura
          </button>
        );
      }
    }

    return buttons;
  };

  const actionButtons = getActionButtons();

  // Obtener nombre del técnico
  const tecnicoNombre = ticket.tecnicoActual?.nombre || 'Sin asignar';
  const trabajadorNombre = ticket.trabajador?.nombre || 'Desconocido';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 hover:shadow-xl transition-all hover:border-blue-300">
      {/* Header del ticket */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{estadoIcons[ticket.estado]}</span>
            <h3 className="text-lg font-bold text-gray-800">
              {ticket.titulo}
            </h3>
          </div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${
              estadoColors[ticket.estado]
            }`}
          >
            {estadoTexts[ticket.estado]}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500">ID: #{ticket.id}</span>
        </div>
      </div>

      {/* Descripción */}
      <div className="mb-4">
        <p className="text-gray-700 text-sm line-clamp-3">
          {ticket.descripcion}
        </p>
      </div>

      {/* Información adicional */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2 text-sm">
        {/* Trabajador */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-medium">👤 Trabajador:</span>
          <span className="text-gray-700">{trabajadorNombre}</span>
        </div>

        {/* Técnico asignado */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-medium">🔧 Técnico:</span>
          <span className={`${tecnicoNombre === 'Sin asignar' ? 'text-gray-400 italic' : 'text-blue-700 font-medium'}`}>
            {tecnicoNombre}
          </span>
        </div>

        {/* Técnico anterior (si fue reabierto) */}
        {ticket.reabierto && ticket.tecnicoAnterior && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">⚠️ Técnico Anterior:</span>
            <span className="text-red-600 font-medium">{ticket.tecnicoAnterior.nombre}</span>
          </div>
        )}

        {/* Indicador de reabierto */}
        {ticket.reabierto && (
          <div className="flex items-center gap-2 bg-red-50 -mx-3 -mb-3 mt-2 p-2 rounded-b-lg">
            {esAdmin && ticket.tecnicoAnterior ? (
              <span className="text-red-700 text-xs font-semibold">
                🔄 Este ticket fue reabierto — Solicitado por: <span className="underline">{ticket.tecnicoAnterior.nombre}</span>
              </span>
            ) : (
              <span className="text-red-700 text-xs font-semibold">
                🔄 Este ticket fue reabierto
              </span>
            )}
          </div>
        )}

        {/* Indicador de solicitud de reapertura pendiente (solo admin) */}
        {esAdmin && ticket.estado === 'SOLICITUD_REAPERTURA' && ticket.tecnicoAnterior && (
          <div className="flex items-center gap-2 bg-orange-50 -mx-3 -mb-3 mt-2 p-2 rounded-b-lg">
            <span className="text-orange-700 text-xs font-semibold">
              ❓ Reapertura solicitada por: <span className="underline">{ticket.tecnicoAnterior.nombre}</span>
            </span>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      {actionButtons.length > 0 && (
        <div className="flex gap-2">
          {actionButtons}
        </div>
      )}

      {/* Mensaje si no hay acciones disponibles */}
      {actionButtons.length === 0 && (
        <div className="text-center py-2 text-sm text-gray-500 italic">
          {ticket.estado === 'FINALIZADO' 
            ? '✅ Ticket finalizado' 
            : 'Sin acciones disponibles'}
        </div>
      )}
    </div>
  );
}
