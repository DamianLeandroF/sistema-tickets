import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

/**
 * Componente Admin - Panel de administración
 * 
 * Permite al administrador:
 * - Ver todos los usuarios
 * - Bloquear/desbloquear usuarios
 * - Blanquear contraseñas
 * - Ver estadísticas de técnicos
 * - Gestionar solicitudes de reapertura
 */
export default function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('usuarios');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = (user.rol || user.tipo || "").toLowerCase();
  const esAdmin = role === 'admin';

  useEffect(() => {
    if (esAdmin) {
      fetchUsuarios();
      fetchTecnicos();
    }
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/usuarios');
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTecnicos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/usuarios');
      if (response.ok) {
        const data = await response.json();
        const tecnicosData = data.filter(u => u.rol === 'tecnico');
        setTecnicos(tecnicosData);
      }
    } catch (error) {
      console.error('Error al cargar técnicos:', error);
    }
  };

  const handleBloquear = async (usuarioId, bloquear) => {
    try {
      const endpoint = bloquear ? 'bloquear' : 'desbloquear';
      const response = await fetch(
        `http://localhost:8080/api/usuarios/${usuarioId}/${endpoint}/${user.id}`,
        { method: 'PUT' }
      );

      if (response.ok) {
        alert(bloquear ? '✅ Usuario bloqueado' : '✅ Usuario desbloqueado');
        fetchUsuarios();
        fetchTecnicos();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error de conexión');
    }
  };

  const handleBlanquearPassword = async (usuarioId) => {
    const confirmar = confirm('¿Está seguro de blanquear la contraseña? Se restablecerá al ID del usuario.');
    if (!confirmar) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/usuarios/${usuarioId}/blanquear/${user.id}`,
        { method: 'PUT' }
      );

      if (response.ok) {
        alert('✅ Contraseña blanqueada. Nueva contraseña = ID del usuario');
        fetchUsuarios();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error al blanquear contraseña');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error de conexión');
    }
  };

  const getRolBadge = (rol) => {
    const badges = {
      'admin': 'bg-purple-100 text-purple-800',
      'tecnico': 'bg-blue-100 text-blue-800',
      'trabajador': 'bg-green-100 text-green-800',
    };
    return badges[rol] || 'bg-gray-100 text-gray-800';
  };

  const getRolIcon = (rol) => {
    const icons = {
      'admin': '👨‍💼',
      'tecnico': '🔧',
      'trabajador': '👷',
    };
    return icons[rol] || '👤';
  };

  if (!esAdmin) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-2">Acceso Denegado</h2>
            <p className="text-red-700">Solo los administradores pueden acceder a esta página.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-600">
            Gestiona usuarios, permisos y estadísticas del sistema
          </p>
        </div>

        {/* Pestañas */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('usuarios')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'usuarios'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              👥 Gestión de Usuarios
            </button>
            <button
              onClick={() => setActiveTab('estadisticas')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'estadisticas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Estadísticas de Técnicos
            </button>
          </nav>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Cargando...</p>
          </div>
        ) : (
          <>
            {/* Pestaña de Usuarios */}
            {activeTab === 'usuarios' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Usuario
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {usuarios.map((usuario) => (
                        <tr key={usuario.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{getRolIcon(usuario.rol)}</span>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {usuario.nombre}
                                </div>
                                <div className="text-sm text-gray-500">ID: {usuario.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{usuario.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRolBadge(usuario.rol)}`}>
                              {usuario.rol}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {usuario.bloqueado ? (
                              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                🔒 Bloqueado
                              </span>
                            ) : (
                              <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                ✅ Activo
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            {usuario.id !== user.id && (
                              <>
                                <button
                                  onClick={() => handleBloquear(usuario.id, !usuario.bloqueado)}
                                  className={`px-3 py-1 rounded ${
                                    usuario.bloqueado
                                      ? 'bg-green-600 hover:bg-green-700 text-white'
                                      : 'bg-red-600 hover:bg-red-700 text-white'
                                  }`}
                                >
                                  {usuario.bloqueado ? '🔓 Desbloquear' : '🔒 Bloquear'}
                                </button>
                                <button
                                  onClick={() => handleBlanquearPassword(usuario.id)}
                                  className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded"
                                >
                                  🔑 Blanquear
                                </button>
                              </>
                            )}
                            {usuario.id === user.id && (
                              <span className="text-gray-400 italic">Tu cuenta</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pestaña de Estadísticas */}
            {activeTab === 'estadisticas' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tecnicos.map((tecnico) => (
                  <div key={tecnico.id} className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">🔧</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{tecnico.nombre}</h3>
                        <p className="text-sm text-gray-500">{tecnico.email}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Fallas */}
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">⚠️ Fallas</span>
                        <span className={`text-2xl font-bold ${tecnico.fallas >= 3 ? 'text-red-600' : 'text-gray-800'}`}>
                          {tecnico.fallas || 0}
                        </span>
                      </div>

                      {/* Marcas de Retorno */}
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">🔄 Marcas Retorno</span>
                        <span className="text-2xl font-bold text-gray-800">
                          {tecnico.marcasRetorno || 0}
                        </span>
                      </div>

                      {/* Estado */}
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Estado</span>
                        {tecnico.bloqueado ? (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                            🔒 Bloqueado
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                            ✅ Activo
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Advertencia si tiene 3 fallas */}
                    {tecnico.fallas >= 3 && (
                      <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                        <p className="text-xs text-red-800 font-semibold">
                          ⚠️ Técnico bloqueado por acumular 3 fallas
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {tecnicos.length === 0 && (
                  <div className="col-span-3 text-center py-12 text-gray-500">
                    No hay técnicos registrados en el sistema
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
