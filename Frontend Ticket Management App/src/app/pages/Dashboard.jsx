import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { apiFetch } from '../utils/api';

/**
 * Componente Dashboard - Pantalla de inicio con resumen de tickets
 * 
 * Muestra estadísticas de tickets según el rol del usuario.
 * Usa el endpoint GET /api/tickets/stats del backend.
 */
export default function Dashboard() {
  // Estado para almacenar las estadísticas
  const [stats, setStats] = useState({
    total: 0,
    noAtendidos: 0,
    atendidos: 0,
    resueltos: 0,
    finalizados: 0,
    reabiertos: 0,
  });

  // Estado de carga
  const [loading, setLoading] = useState(true);

  // Obtener usuario
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // useEffect para cargar datos al montar el componente
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Usar el endpoint de estadísticas del backend
        const response = await apiFetch('/api/tickets/stats');
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error('Error al cargar estadísticas');
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Bienvenido, {user.nombre || 'Usuario'}
          </p>
          <p className="text-sm text-gray-500">
            Rol: <span className="font-semibold text-blue-600">{user.rol}</span>
          </p>
        </div>

        {/* Cards de estadísticas */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Cargando estadísticas...</p>
          </div>
        ) : (
          <>
            {/* Fila 1: Total */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 mb-2 text-lg">Total de Tickets</p>
                    <p className="text-5xl font-bold">{stats.total}</p>
                  </div>
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Fila 2: Estados principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Card: Tickets No Atendidos */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      No Atendidos
                    </p>
                    <p className="text-4xl font-bold text-yellow-600">
                      {stats.noAtendidos}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">⏳</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Esperando ser atendidos
                </p>
              </div>

              {/* Card: Tickets Atendidos */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Atendidos
                    </p>
                    <p className="text-4xl font-bold text-blue-600">
                      {stats.atendidos}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🔧</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  En proceso de resolución
                </p>
              </div>

              {/* Card: Tickets Resueltos */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Resueltos
                    </p>
                    <p className="text-4xl font-bold text-purple-600">
                      {stats.resueltos}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">✅</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Esperando confirmación
                </p>
              </div>
            </div>

            {/* Fila 3: Estados finales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card: Tickets Finalizados */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Finalizados
                    </p>
                    <p className="text-4xl font-bold text-green-600">
                      {stats.finalizados}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🎉</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Completados exitosamente
                </p>
              </div>

              {/* Card: Tickets Reabiertos */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Reabiertos
                    </p>
                    <p className="text-4xl font-bold text-red-600">
                      {stats.reabiertos}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🔄</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Requieren nueva atención
                </p>
              </div>
            </div>

            {/* Gráfico de progreso */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Distribución de Tickets
              </h3>
              <div className="space-y-3">
                {/* Barra No Atendidos */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">No Atendidos</span>
                    <span className="font-semibold text-yellow-600">{stats.noAtendidos}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all" 
                      style={{ width: `${stats.total > 0 ? (stats.noAtendidos / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Barra Atendidos */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Atendidos</span>
                    <span className="font-semibold text-blue-600">{stats.atendidos}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all" 
                      style={{ width: `${stats.total > 0 ? (stats.atendidos / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Barra Resueltos */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Resueltos</span>
                    <span className="font-semibold text-purple-600">{stats.resueltos}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all" 
                      style={{ width: `${stats.total > 0 ? (stats.resueltos / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Barra Finalizados */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Finalizados</span>
                    <span className="font-semibold text-green-600">{stats.finalizados}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all" 
                      style={{ width: `${stats.total > 0 ? (stats.finalizados / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Barra Reabiertos */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Reabiertos</span>
                    <span className="font-semibold text-red-600">{stats.reabiertos}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all" 
                      style={{ width: `${stats.total > 0 ? (stats.reabiertos / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}


      </main>
    </div>
  );
}
