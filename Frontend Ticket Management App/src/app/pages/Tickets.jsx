import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TicketCard from '../components/TicketCard';
import { apiFetch } from '../utils/api';

/**
 * Componente Tickets - Listado de tickets
 * 
 * Muestra tickets según el rol del usuario:
 * - TRABAJADOR: Sus tickets no finalizados
 * - TECNICO: Tickets pendientes y sus tickets asignados (pestañas)
 * - ADMINISTRADOR: Todos los tickets
 */
export default function Tickets() {
  // Estado para almacenar los tickets
  const [tickets, setTickets] = useState([]);
  const [ticketsPendientes, setTicketsPendientes] = useState([]);

  // Estado de carga
  const [loading, setLoading] = useState(true);

  // Estado para la pestaña activa (solo para técnicos)
  const [activeTab, setActiveTab] = useState('pendientes');

  // Filtro por estado (solo admin)
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  // Obtener usuario actual
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const esTecnico = user.rol === 'tecnico';
  const esTrabajador = user.rol === 'trabajador';
  const esAdmin = user.rol === 'admin';

  // useEffect para cargar tickets al montar el componente
  useEffect(() => {
    fetchTickets();
    if (esTecnico) {
      fetchTicketsPendientes();
    }
  }, []);

  // Función para obtener tickets pendientes (NO_ATENDIDO y REABIERTO)
  const fetchTicketsPendientes = async () => {
    try {
      // Obtener tickets NO_ATENDIDO
      const responseNoAtendidos = await apiFetch('/api/tickets/estado/NO_ATENDIDO');
      const noAtendidos = responseNoAtendidos.ok ? await responseNoAtendidos.json() : [];

      // Obtener tickets REABIERTO
      const responseReabiertos = await apiFetch('/api/tickets/estado/REABIERTO');
      const reabiertos = responseReabiertos.ok ? await responseReabiertos.json() : [];

      // Combinar ambos arrays
      const todosPendientes = [...noAtendidos, ...reabiertos];
      setTicketsPendientes(todosPendientes);
    } catch (error) {
      console.error('Error al cargar tickets pendientes:', error);
    }
  };

  // Función para obtener tickets del usuario
  const fetchTickets = async () => {
    try {
      if (!user || !user.id) {
        return; 
      }

      let url = '/api/tickets';
      
      // Ajustar URL según rol
      if (esTrabajador) {
        url = `/api/tickets/trabajador/${user.id}`;
      } else if (esTecnico) {
        url = `/api/tickets/tecnico/${user.id}`;
      }

      const response = await apiFetch(url);

      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      } else {
        // Fallback robusto usando endpoints por estado
        const estados = ['NO_ATENDIDO', 'ATENDIDO', 'RESUELTO', 'FINALIZADO', 'REABIERTO', 'SOLICITUD_REAPERTURA'];
        const results = await Promise.all(
          estados.map((e) =>
            apiFetch(`/api/tickets/estado/${e}`).then((r) =>
              r.ok ? r.json() : []
            )
          )
        );
        let todos = results.flat();

        if (esTecnico) {
          todos = todos.filter((t) => t.tecnicoActual && t.tecnicoActual.id === user.id);
        } else if (esTrabajador) {
          todos = todos.filter((t) => t.trabajador && t.trabajador.id === user.id);
        }

        setTickets(todos);
      }
    } catch (error) {
      console.error('Error al cargar tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar acciones sobre los tickets
  const handleTicketAction = async (ticketId, action) => {
    console.log(`Acción: ${action} en ticket ${ticketId}`);

    try {
      let url = '';
      let method = 'PUT';
      let body = null;

      switch (action) {
        case 'atender':
          // Asignar ticket a técnico
          if (!esTecnico) {
            alert('Solo los técnicos pueden atender tickets');
            return;
          }
          url = `/api/tickets/${ticketId}/asignar/${user.id}`;
          break;

        case 'resolver':
          // Marcar como resuelto
          if (!esTecnico) {
            alert('Solo los técnicos pueden resolver tickets');
            return;
          }
          url = `/api/tickets/${ticketId}/resolver/${user.id}`;
          break;

        case 'confirmar':
          // Confirmar resolución
          if (!esTrabajador) {
            alert('Solo el trabajador puede confirmar la resolución');
            return;
          }
          url = `/api/tickets/${ticketId}/confirmar/${user.id}`;
          body = JSON.stringify({ confirmado: true });
          break;

        case 'rechazar':
          // Rechazar resolución
          if (!esTrabajador) {
            alert('Solo el trabajador puede rechazar la resolución');
            return;
          }
          const confirmRechazar = confirm('¿Está seguro que desea rechazar la resolución? El técnico recibirá una falla.');
          if (!confirmRechazar) return;
          
          url = `/api/tickets/${ticketId}/confirmar/${user.id}`;
          body = JSON.stringify({ confirmado: false });
          break;

        case 'solicitar-reapertura':
          // Solicitar reapertura (técnico)
          if (!esTecnico) {
            alert('Solo los técnicos pueden solicitar reapertura');
            return;
          }
          const confirmSolicitud = confirm('¿Desea solicitar la reapertura de este ticket? Esto puede afectar sus marcas/fallas.');
          if (!confirmSolicitud) return;
          
          url = `/api/tickets/${ticketId}/solicitar-reapertura/${user.id}`;
          break;

        case 'reabrir':
          // Aprobar reapertura (admin)
          if (!esAdmin) {
            alert('Solo los administradores pueden aprobar la reapertura');
            return;
          }
          url = `/api/tickets/${ticketId}/reabrir/${user.id}`;
          break;

        default:
          console.error('Acción no reconocida:', action);
          return;
      }

      const response = await apiFetch(url, {
        method: method,
        body: body,
      });

      if (response.ok) {
        // Recargar tickets
        await fetchTickets();
        if (esTecnico) {
          await fetchTicketsPendientes();
        }
        
        // Mensajes de éxito
        const mensajes = {
          'atender': '✅ Ticket asignado exitosamente',
          'resolver': '✅ Ticket marcado como resuelto',
          'confirmar': '✅ Resolución confirmada. Ticket finalizado.',
          'rechazar': '⚠️ Resolución rechazada. Ticket reabierto.',
          'solicitar-reapertura': '✅ Solicitud de reapertura registrada. Pendiente de aprobación del admin.',
          'reabrir': '✅ Reapertura aprobada. El ticket vuelve a estar disponible.',
        };
        alert(mensajes[action] || 'Acción completada');
      } else {
        // Intentar parsear el error como JSON
        try {
          const errorData = await response.json();
          const errorMessage = errorData.message || errorData.error || 'Error desconocido';
          alert(errorMessage);
        } catch (e) {
          // Si no es JSON, mostrar como texto
          const errorText = await response.text();
          alert('❌ Error: ' + errorText);
        }
      }
    } catch (error) {
      console.error('Error al ejecutar acción:', error);
      alert('❌ Error de conexión con el servidor');
    }
  };

  // Función para obtener el color del badge según el estado
  const getEstadoBadgeColor = (estado) => {
    const colores = {
      'NO_ATENDIDO': 'bg-yellow-100 text-yellow-800',
      'ATENDIDO': 'bg-blue-100 text-blue-800',
      'RESUELTO': 'bg-purple-100 text-purple-800',
      'FINALIZADO': 'bg-green-100 text-green-800',
      'REABIERTO': 'bg-red-100 text-red-800',
      'SOLICITUD_REAPERTURA': 'bg-orange-100 text-orange-800',
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  const ESTADOS_FILTRO = [
    { valor: 'TODOS', etiqueta: 'Todos', color: 'bg-gray-200 text-gray-800' },
    { valor: 'NO_ATENDIDO', etiqueta: '⏳ No Atendido', color: 'bg-yellow-100 text-yellow-800' },
    { valor: 'ATENDIDO', etiqueta: '🔧 Atendido', color: 'bg-blue-100 text-blue-800' },
    { valor: 'RESUELTO', etiqueta: '✅ Resuelto', color: 'bg-purple-100 text-purple-800' },
    { valor: 'FINALIZADO', etiqueta: '🎉 Finalizado', color: 'bg-green-100 text-green-800' },
    { valor: 'REABIERTO', etiqueta: '🔄 Reabierto', color: 'bg-red-100 text-red-800' },
    { valor: 'SOLICITUD_REAPERTURA', etiqueta: '❓ Solicitud Reapertura', color: 'bg-orange-100 text-orange-800' },
  ];

  const ticketsFiltrados = esAdmin && filtroEstado !== 'TODOS'
    ? tickets.filter(t => t.estado === filtroEstado)
    : tickets;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {esTecnico ? 'Gestión de Tickets' : 'Mis Tickets'}
          </h1>
          <p className="text-gray-600">
            {esTecnico 
              ? 'Atiende tickets pendientes y gestiona tus tickets asignados' 
              : esTrabajador
              ? 'Visualiza el estado de tus tickets reportados'
              : 'Administra todos los tickets del sistema'}
          </p>
        </div>

        {/* Filtro por estado — solo visible para admin */}
        {esAdmin && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Filtrar por estado:</p>
            <div className="flex flex-wrap gap-2">
              {ESTADOS_FILTRO.map(({ valor, etiqueta, color }) => (
                <button
                  key={valor}
                  onClick={() => setFiltroEstado(valor)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                    filtroEstado === valor
                      ? `${color} border-current shadow-md scale-105`
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {etiqueta}
                  {valor !== 'TODOS' && (
                    <span className="ml-1 font-bold">
                      ({tickets.filter(t => t.estado === valor).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

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
                📋 Tickets Pendientes
                {ticketsPendientes.length > 0 && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full text-xs font-semibold">
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
                🎫 Mis Tickets Asignados
                {tickets.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full text-xs font-semibold">
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Cargando tickets...</p>
          </div>
        ) : (
          <>
            {/* Vista para técnicos con pestañas */}
            {esTecnico ? (
              <>
                {activeTab === 'pendientes' ? (
                  ticketsPendientes.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-600">No hay tickets pendientes disponibles</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {ticketsPendientes.map((ticket) => (
                        <TicketCard
                          key={ticket.id}
                          ticket={ticket}
                          onAction={handleTicketAction}
                          userRole={user.rol}
                        />
                      ))}
                    </div>
                  )
                ) : (
                  tickets.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-gray-600">No tienes tickets asignados</p>
                      <p className="text-sm text-gray-500 mt-2">Puedes tomar tickets desde la pestaña "Tickets Pendientes"</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {tickets.map((ticket) => (
                        <TicketCard
                          key={ticket.id}
                          ticket={ticket}
                          onAction={handleTicketAction}
                          userRole={user.rol}
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
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600">No hay tickets disponibles</p>
                  {esTrabajador && (
                    <button
                      onClick={() => window.location.href = '/create-ticket'}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Crear Nuevo Ticket
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {ticketsFiltrados.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onAction={handleTicketAction}
                      userRole={user.rol}
                    />
                  ))}
                </div>
              )
            )}
          </>
        )}
      </main>
    </div>
  );
}
