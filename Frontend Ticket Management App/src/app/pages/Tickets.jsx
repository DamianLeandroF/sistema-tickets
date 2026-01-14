import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TicketCard from '../components/TicketCard';

/**
 * Componente Tickets - Listado de tickets
 * 
 * Muestra todos los tickets del sistema en formato de cards.
 * Permite realizar acciones según el estado del ticket:
 * - Atender (si está pendiente)
 * - Resolver (si está en proceso)
 * - Confirmar (si está resuelto)
 */
export default function Tickets() {
  // Estado para almacenar los tickets
  const [tickets, setTickets] = useState([]);

  // Estado de carga
  const [loading, setLoading] = useState(true);

  // useEffect para cargar tickets al montar el componente
  useEffect(() => {
    fetchTickets();
  }, []);

  // Función para obtener todos los tickets
  const fetchTickets = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        // Redirigir a login si no hay usuario
        return; 
      }

      let url = 'http://localhost:8080/api/tickets';
      
      // Ajustar URL según rol
      if (user.rol === 'trabajador' || user.tipo === 'trabajador') {
        url = `http://localhost:8080/api/tickets/trabajador/${user.id}`;
      } else if (user.rol === 'tecnico' || user.tipo === 'tecnico') {
        url = `http://localhost:8080/api/tickets/tecnico/${user.id}`;
      }

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Mapear datos si es necesario para coincidir con lo que espera el frontend
        const mappedTickets = data.map(ticket => ({
          ...ticket,
          estado: ticket.estado.toLowerCase(), // Backend devuelve mayúsculas
          tecnicoAsignado: ticket.tecnicoNombre, // Backend devuelve nombre en tecnicoNombre
          fechaCreacion: ticket.fechaCreacion || new Date().toISOString().split('T')[0] // Fallback fecha
        }));
        setTickets(mappedTickets);
      } else {
        console.error('Error fetching tickets');
      }
    } catch (error) {
      console.error('Error al cargar tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar acciones sobre los tickets
  const handleTicketAction = async (ticketId, action) => {
    console.log(`Actualizar ticket ${ticketId} con acción: ${action}`);

    // Mapear acción a estado del backend
    let nuevoEstado = '';
    if (action === 'atender') nuevoEstado = 'EN_PROCESO';
    else if (action === 'resolver') nuevoEstado = 'RESUELTO';
    else if (action === 'confirmar') nuevoEstado = 'FINALIZADO';
    else if (action === 'asignar') {
        // Si la acción es asignar, necesitamos el ID del técnico.
        // Por ahora, asumiremos que "atender" hace lo mismo que asignar a uno mismo si es técnico.
        // O si es admin asignando, requeriría otro flujo UI.
        // El botón "Atender" en TicketCard suele ser para que el técnico tome el ticket.
        // Vamos a asumir que "atender" -> Asignar al técnico actual (si soy técnico) Y cambiar estado.
        // Pero el backend tiene `asignarTecnico` y `cambiarEstado`.
        // Simplificación: usar cambiarEstado y backend asume usuario actual? 
        // No, el backend `cambiarEstado` solo cambia estado.
        // Si la acción es "atender", deberíamos llamar a asignarTecnico con el ID del usuario actual.
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && (user.rol === 'tecnico' || user.tipo === 'tecnico')) {
            await asignarTecnico(ticketId, user.id);
            return;
        }
    }

    try {
      const response = await fetch(`http://localhost:8080/api/tickets/${ticketId}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accion: nuevoEstado }),
      });

      if (response.ok) {
        // Recargar la lista de tickets
        fetchTickets();
        alert('Ticket actualizado exitosamente');
      } else {
        alert('Error al actualizar el ticket');
      }
    } catch (error) {
      console.error('Error al actualizar ticket:', error);
      alert('Error de conexión');
    }
  };

  const asignarTecnico = async (ticketId, tecnicoId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/tickets/${ticketId}/asignar/${tecnicoId}`, {
            method: 'PUT'
        });
        if (response.ok) {
            fetchTickets();
            alert('Ticket asignado exitosamente');
        } else {
            alert('Error al asignar ticket');
        }
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-800 mb-2">
            Listado de Tickets
          </h1>
          <p className="text-gray-600">
            Gestiona todos los tickets del sistema
          </p>
        </div>

        {/* Listado de tickets */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Cargando tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">No hay tickets disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onAction={handleTicketAction}
              />
            ))}
          </div>
        )}

        {/* Información sobre los endpoints */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg text-blue-800 mb-2">
            Endpoints de API
          </h2>
          <div className="space-y-2 text-sm text-blue-700">
            <p>
              <strong>Obtener tickets:</strong> GET /api/tickets
            </p>
            <p>
              <strong>Actualizar estado:</strong> PUT /api/tickets/&#123;id&#125;/estado
            </p>
            <p className="mt-4">
              Los tickets se filtran automáticamente según el rol del usuario
              autenticado.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
