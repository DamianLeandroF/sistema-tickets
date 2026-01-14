import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

/**
 * Componente Dashboard - Pantalla de inicio con resumen de tickets
 * 
 * Muestra un resumen estadístico de los tickets:
 * - Cantidad de tickets pendientes
 * - Cantidad de tickets atendidos (en proceso)
 * - Cantidad de tickets finalizados
 * 
 * Los datos deben obtenerse del backend mediante API REST.
 */
export default function Dashboard() {
  // Estado para almacenar las estadísticas
  const [stats, setStats] = useState({
    pendientes: 0,
    atendidos: 0,
    finalizados: 0,
  });

  // Estado de carga
  const [loading, setLoading] = useState(true);

  // useEffect para cargar datos al montar el componente
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;

        let url = 'http://localhost:8080/api/tickets';
        if (user.rol === 'trabajador' || user.tipo === 'trabajador') {
          url = `http://localhost:8080/api/tickets/trabajador/${user.id}`;
        } else if (user.rol === 'tecnico' || user.tipo === 'tecnico') {
          url = `http://localhost:8080/api/tickets/tecnico/${user.id}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const tickets = await response.json();
          
          const newStats = {
            pendientes: tickets.filter(t => t.estado === 'PENDIENTE').length,
            atendidos: tickets.filter(t => t.estado === 'EN_PROCESO').length,
            finalizados: tickets.filter(t => t.estado === 'FINALIZADO' || t.estado === 'RESUELTO').length
          };
          
          setStats(newStats);
        }
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-800 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">Resumen de tickets del sistema</p>
        </div>

        {/* Cards de estadísticas */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Cargando estadísticas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card: Tickets Pendientes */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Tickets Pendientes
                  </p>
                  <p className="text-3xl text-yellow-600">
                    {stats.pendientes}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Esperando ser atendidos
              </p>
            </div>

            {/* Card: Tickets Atendidos (En Proceso) */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Tickets Atendidos
                  </p>
                  <p className="text-3xl text-blue-600">
                    {stats.atendidos}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                En proceso de resolución
              </p>
            </div>

            {/* Card: Tickets Finalizados */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Tickets Finalizados
                  </p>
                  <p className="text-3xl text-green-600">
                    {stats.finalizados}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Completados exitosamente
              </p>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg text-blue-800 mb-2">
            Información del Sistema
          </h2>
          <p className="text-sm text-blue-700">
            Este dashboard muestra un resumen en tiempo real de todos los
            tickets en el sistema. Los datos se actualizan automáticamente al
            cargar la página.
          </p>
          <p className="text-sm text-blue-700 mt-2">
            <strong>Endpoint:</strong> GET /api/tickets/stats
          </p>
        </div>
      </main>
    </div>
  );
}
