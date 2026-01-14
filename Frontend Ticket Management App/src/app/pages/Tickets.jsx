import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TicketCard from '../components/TicketCard';

/**
 * Componente Tickets - Listado de tickets
 * 
 * Muestra todos los tickets del sistema en formato de cards.
 * Para técnicos, muestra dos pestañas:
 * - Tickets Pendientes: Todos los tickets disponibles para atender
 * - Mis Tickets: Tickets asignados al técnico
 * 
 * Permite realizar acciones según el estado del ticket:
 * - Atender (si está pendiente)
 * - Resolver (si está en proceso)
 * - Confirmar (si está resuelto)
 */
export default function Tickets() {
  // Estado para almacenar los tickets
  const [tickets, setTickets] = useState([]);
  const [ticketsPendientes, setTicketsPendientes] = useState([]);

  // Estado de carga
  const [loading, setLoading] = useState(true);

  // Estado para la pestaña activa (solo para técnicos)
  const [activeTab, setActiveTab] = useState('pendientes');

  // Obtener usuario actual
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const esTecnico = user.tipo === 'tecnico' || user.rol === 'tecnico';

  // useEffect para cargar tickets al montar el componente
  useEffect(() => {
    fetchTickets();
    if (esTecnico) {
      fetchTicketsPendientes();
    }
  }, []);

  // Función para obtener tickets pendientes (solo para técnicos)
  const fetchTicketsPendientes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/tickets/pendientes', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const mappedTickets = data.map(ticket => ({
          ...ticket,
          estado: ticket.estado.toLowerCase(),
          tecnicoAsignado: ticket.tecnicoNombre,
          fechaCreacion: ticket.fechaCreacion || new Date().toISOString().split('T')[0]
        }));
        setTicketsPendientes(mappedTickets);
      } else {
        console.error('Error fetching tickets pendientes');
      }
    } catch (error) {
      console.error('Error al cargar tickets pendientes:', error);
    }
  };

  // Función para obtener todos los tickets del usuario
  const fetchTickets = async () => {
    try {
      if (!user || !user.id) {
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

    // Si la acción es "atender", usar el endpoint de asignación de técnico
    if (action === 'atender') {
      if (user && (user.rol === 'tecnico' || user.tipo === 'tecnico')) {
        await asignarTecnico(ticketId, user.id);
        return;
      } else {
        alert('Solo los técnicos pueden atender tickets');
        return;
      }
    }

    // Mapear acción a estado del backend para otras acciones
    let nuevoEstado = '';
    if (action === 'resolver') nuevoEstado = 'RESUELTO';
    else if (action === 'confirmar') nuevoEstado = 'FINALIZADO';
    else {
      console.error('Acción no reconocida:', action);
      return;
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
        if (esTecnico) {
          fetchTicketsPendientes();
        }
        alert('Ticket actualizado exitosamente');
      } else {
        const errorText = await response.text();
        alert('Error al actualizar el ticket: ' + errorText);
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
            if (esTecnico) {
              fetchTicketsPendientes();
            }
            alert('Ticket asignado exitosamente');
        } else {
            const errorText = await response.text();
            alert('Error al asignar ticket: ' + errorText);
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión');
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
            {esTecnico 
              ? 'Gestiona tickets pendientes y tus tickets asignados' 
              : 'Gestiona todos los tickets del sistema'}
          </p>
        </div>

        {/* Pestañas para técnicos */}
        {esTecnico && (
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('pendientes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'pendientes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tickets Pendientes
                {ticketsPendientes.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
                    {ticketsPendientes.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('mis-tickets')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'mis-tickets'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mis Tickets
                {tickets.length > 0 && (
                  <span className="ml-2 bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-xs">
                    {tickets.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        )}

        {/* Listado de tickets */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Cargando tickets...</p>
          </div>
        ) : (
          <>
            {/* Vista para técnicos con pestañas */}
            {esTecnico ? (
              <>
                {activeTab === 'pendientes' ? (
                  ticketsPendientes.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                      <p className="text-gray-600">No hay tickets pendientes disponibles</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {ticketsPendientes.map((ticket) => (
                        <TicketCard
                          key={ticket.id}
                          ticket={ticket}
                          onAction={handleTicketAction}
                        />
                      ))}
                    </div>
                  )
                ) : (
                  tickets.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                      <p className="text-gray-600">No tienes tickets asignados</p>
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
                  )
                )}
              </>
            ) : (
              /* Vista para trabajadores y admin */
              tickets.length === 0 ? (
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
              )
            )}
          </>
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
            {esTecnico && (
              <p>
                <strong>Tickets pendientes:</strong> GET /api/tickets/pendientes
              </p>
            )}
            <p>
              <strong>Actualizar estado:</strong> PUT /api/tickets/&#123;id&#125;/estado
            </p>
            <p>
              <strong>Asignar técnico:</strong> PUT /api/tickets/&#123;id&#125;/asignar/&#123;tecnicoId&#125;
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
