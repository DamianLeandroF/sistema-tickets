import React from 'react';

/**
 * Componente TicketCard - Card individual de ticket
 * 
 * Este componente representa visualmente un ticket individual
 * mostrando su información básica y botones de acción.
 * 
 * Props:
 * @param {Object} ticket - Objeto ticket con la siguiente estructura:
 *   - id: number
 *   - titulo: string
 *   - descripcion: string
 *   - estado: string ('pendiente' | 'en_proceso' | 'resuelto' | 'finalizado')
 *   - tecnicoAsignado: string | null
 *   - fechaCreacion: string
 * @param {Function} onAction - Función callback para manejar las acciones del ticket
 */
export default function TicketCard({ ticket, onAction }) {
  // Mapeo de estados a colores para los badges
  const estadoColors = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    en_proceso: 'bg-blue-100 text-blue-800',
    resuelto: 'bg-green-100 text-green-800',
    finalizado: 'bg-gray-100 text-gray-800',
  };

  // Mapeo de estados a textos legibles
  const estadoTexts = {
    pendiente: 'Pendiente',
    en_proceso: 'En Proceso',
    resuelto: 'Resuelto',
    finalizado: 'Finalizado',
  };

  // Determina qué botón mostrar según el estado
  const getActionButton = () => {
    switch (ticket.estado) {
      case 'pendiente':
        return (
          <button
            onClick={() => onAction(ticket.id, 'atender')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Atender
          </button>
        );
      case 'en_proceso':
        return (
          <button
            onClick={() => onAction(ticket.id, 'resolver')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Resolver
          </button>
        );
      case 'resuelto':
        return (
          <button
            onClick={() => onAction(ticket.id, 'confirmar')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Confirmar
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header del ticket */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg text-gray-800 mb-2">
            {ticket.titulo}
          </h3>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm ${
              estadoColors[ticket.estado]
            }`}
          >
            {estadoTexts[ticket.estado]}
          </span>
        </div>
      </div>

      {/* Descripción */}
      <p className="text-gray-600 mb-4 text-sm">
        {ticket.descripcion}
      </p>

      {/* Información adicional */}
      <div className="flex flex-col gap-2 mb-4 text-sm">
        {/* Técnico asignado */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Técnico:</span>
          <span className="text-gray-700">
            {ticket.tecnicoAsignado || 'Sin asignar'}
          </span>
        </div>

        {/* Fecha de creación */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Creado:</span>
          <span className="text-gray-700">{ticket.fechaCreacion}</span>
        </div>

        {/* ID del ticket */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500">ID:</span>
          <span className="text-gray-700">#{ticket.id}</span>
        </div>
      </div>

      {/* Botón de acción */}
      <div className="flex justify-end">
        {getActionButton()}
      </div>
    </div>
  );
}
