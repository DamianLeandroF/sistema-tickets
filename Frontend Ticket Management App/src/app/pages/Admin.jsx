import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { apiFetch } from '../utils/api';

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
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [crearForm, setCrearForm] = useState({ nombre: '', email: '', rol: 'trabajador' });
  const [crearError, setCrearError] = useState('');
  const [crearLoading, setCrearLoading] = useState(false);

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
      const response = await apiFetch('/api/usuarios');
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
      const response = await apiFetch('/api/usuarios');
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
      const response = await apiFetch(
        `/api/usuarios/${usuarioId}/${endpoint}/${user.id}`,
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

  const handleModificarFallas = async (tecnicoId, cantidad) => {
    try {
      const response = await apiFetch(
        `/api/usuarios/${tecnicoId}/fallas/${user.id}?cantidad=${cantidad}`,
        { method: 'PUT' }
      );
      if (response.ok) {
        const msg = cantidad > 0 ? `✅ Se agregó ${cantidad} falla(s)` : `✅ Se restó ${-cantidad} falla(s)`;
        alert(msg);
        fetchUsuarios();
        fetchTecnicos();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || errorData.error || 'Error al modificar fallas');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error de conexión');
    }
  };

  const handleModificarMarcas = async (tecnicoId, cantidad) => {
    try {
      const response = await apiFetch(
        `/api/usuarios/${tecnicoId}/marcas-retorno/${user.id}?cantidad=${cantidad}`,
        { method: 'PUT' }
      );
      if (response.ok) {
        const msg = cantidad > 0 ? `✅ Se agregó ${cantidad} marca(s) de retorno` : `✅ Se restó ${-cantidad} marca(s) de retorno`;
        alert(msg);
        fetchUsuarios();
        fetchTecnicos();
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || errorData.error || 'Error al modificar marcas');
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
      const response = await apiFetch(
        `/api/usuarios/${usuarioId}/blanquear/${user.id}`,
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

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setCrearError('');
    if (!crearForm.nombre.trim() || !crearForm.email.trim()) {
      setCrearError('Nombre y email son obligatorios');
      return;
    }
    setCrearLoading(true);
    try {
      const response = await apiFetch(`/api/usuarios/crear/${user.id}`, {
        method: 'POST',
        body: JSON.stringify({
          nombre: crearForm.nombre.trim(),
          email: crearForm.email.trim(),
          rol: crearForm.rol,
        }),
      });
      if (response.ok) {
        const nuevoUsuario = await response.json();
        alert(`✅ Usuario creado exitosamente. ID: ${nuevoUsuario.id}. Contraseña inicial: ${nuevoUsuario.id}`);
        setShowCrearModal(false);
        setCrearForm({ nombre: '', email: '', rol: 'trabajador' });
        fetchUsuarios();
        fetchTecnicos();
      } else {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData.message || errorData.error || (await response.text()) || 'Error al crear usuario';
        setCrearError(msg);
      }
    } catch (error) {
      console.error('Error:', error);
      setCrearError('Error de conexión con el servidor');
    } finally {
      setCrearLoading(false);
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
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Listado de usuarios</h3>
                  <button
                    onClick={() => { setShowCrearModal(true); setCrearError(''); setCrearForm({ nombre: '', email: '', rol: 'trabajador' }); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    ➕ Crear Usuario
                  </button>
                </div>
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
                      {/* Fallas - con botones +/- para admin */}
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">⚠️ Fallas</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleModificarFallas(tecnico.id, -1)}
                            disabled={(tecnico.fallas || 0) <= 0}
                            className="w-7 h-7 rounded bg-red-200 hover:bg-red-300 text-red-800 font-bold disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                            title="Restar falla"
                          >
                            −
                          </button>
                          <span className={`text-2xl font-bold min-w-[1.5rem] text-center ${tecnico.fallas >= 3 ? 'text-red-600' : 'text-gray-800'}`}>
                            {tecnico.fallas || 0}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleModificarFallas(tecnico.id, 1)}
                            className="w-7 h-7 rounded bg-red-200 hover:bg-red-300 text-red-800 font-bold text-sm"
                            title="Sumar falla"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Marcas de Retorno - con botones +/- para admin */}
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">🔄 Marcas Retorno</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleModificarMarcas(tecnico.id, -1)}
                            disabled={(tecnico.marcasRetorno || 0) <= 0}
                            className="w-7 h-7 rounded bg-yellow-200 hover:bg-yellow-300 text-yellow-800 font-bold disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                            title="Restar marca de retorno"
                          >
                            −
                          </button>
                          <span className="text-2xl font-bold min-w-[1.5rem] text-center text-gray-800">
                            {tecnico.marcasRetorno || 0}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleModificarMarcas(tecnico.id, 1)}
                            className="w-7 h-7 rounded bg-yellow-200 hover:bg-yellow-300 text-yellow-800 font-bold text-sm"
                            title="Sumar marca de retorno"
                          >
                            +
                          </button>
                        </div>
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

            {/* Modal Crear Usuario */}
            {showCrearModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Crear nuevo usuario</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    La contraseña inicial será el ID del usuario (deberá cambiarla en el primer inicio de sesión).
                  </p>
                  <form onSubmit={handleCrearUsuario} className="space-y-4">
                    {crearError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {crearError}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                      <input
                        type="text"
                        value={crearForm.nombre}
                        onChange={(e) => setCrearForm({ ...crearForm, nombre: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Juan Pérez"
                        required
                        disabled={crearLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={crearForm.email}
                        onChange={(e) => setCrearForm({ ...crearForm, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: juan@empresa.com"
                        required
                        disabled={crearLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                      <select
                        value={crearForm.rol}
                        onChange={(e) => setCrearForm({ ...crearForm, rol: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={crearLoading}
                      >
                        <option value="trabajador">Trabajador</option>
                        <option value="tecnico">Técnico</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => { setShowCrearModal(false); setCrearError(''); }}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        disabled={crearLoading}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                        disabled={crearLoading}
                      >
                        {crearLoading ? 'Creando...' : 'Crear Usuario'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
