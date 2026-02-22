import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { apiFetch } from '../utils/api';

/**
 * Componente Perfil - Información del usuario
 * 
 * Muestra la información del usuario autenticado:
 * - Nombre
 * - Rol (Administrador, Técnico, Trabajador)
 * - Email
 * 
 * Si el rol es Administrador, muestra opciones adicionales
 * como "Gestionar usuarios".
 */
export default function Perfil() {
  const [userInfo, setUserInfo] = useState({
    id: '',
    nombre: '',
    email: '',
    rol: '',
    fallas: 0,
    marcasRetorno: 0,
  });

  const [loading, setLoading] = useState(true);
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [pwdActual, setPwdActual] = useState('');
  const [pwdNueva, setPwdNueva] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdSubmitting, setPwdSubmitting] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        setLoading(false);
        return;
      }
      let fallas = user.fallas ?? 0;
      let marcasRetorno = user.marcasRetorno ?? 0;
      // Para técnicos, obtener datos actualizados del backend
      const rol = (user.rol || user.tipo || '').toLowerCase();
      if (rol === 'tecnico') {
        try {
          const resp = await apiFetch('/api/usuarios/me');
          if (resp.ok) {
            const me = await resp.json();
            fallas = me.fallas ?? 0;
            marcasRetorno = me.marcasRetorno ?? 0;
          }
        } catch (e) {
          console.warn('No se pudo obtener perfil actualizado', e);
        }
      }
      setUserInfo({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol || user.tipo,
        fallas,
        marcasRetorno,
      });
    };
    loadProfile().finally(() => setLoading(false));
  }, []);

  const handleChangePassword = () => {
    setShowChangePwd((v) => !v);
    setPwdError('');
    setPwdSuccess('');
  };

  const handleManageUsers = () => {
    alert('Funcionalidad de gestión de usuarios');
  };

  const submitChangePassword = async (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');
    if (!pwdActual || !pwdNueva || !pwdConfirm) {
      setPwdError('Complete todos los campos');
      return;
    }
    if (pwdNueva !== pwdConfirm) {
      setPwdError('Las contraseñas no coinciden');
      return;
    }
    setPwdSubmitting(true);
    try {
      const resp = await apiFetch(`/api/usuarios/${userInfo.id}/update-password`, {
        method: 'PUT',
        body: JSON.stringify({ newPassword: pwdNueva }),
      });
      if (resp.ok) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user && typeof user === 'object') {
          user.forzarCambio = false;
          localStorage.setItem('user', JSON.stringify(user));
        }
        setPwdSuccess('Contraseña actualizada correctamente');
        setPwdActual('');
        setPwdNueva('');
        setPwdConfirm('');
      } else {
        const txt = await resp.text();
        setPwdError(txt || 'Error al cambiar la contraseña');
      }
    } catch (err) {
      setPwdError('Error de conexión con el servidor');
    } finally {
      setPwdSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl text-gray-800 mb-2">
              Mi Perfil
            </h1>
            <p className="text-gray-600">Información de tu cuenta</p>
          </div>
          {/* Marcas/Fallas para técnicos */}
          {(userInfo.rol === 'tecnico' || userInfo.rol === 'TECNICO') && (
            <div className="flex gap-3 text-xs">
              <span className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg border border-red-200 font-medium">
                ⚠️ Fallas: {userInfo.fallas}
              </span>
              <span className="px-3 py-1.5 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200 font-medium">
                🔄 Marcas retorno: {userInfo.marcasRetorno}
              </span>
            </div>
          )}
        </div>

        {/* Contenido del perfil */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Cargando información...</p>
          </div>
        ) : (
          <div className="max-w-2xl">
            {/* Card de información del usuario */}
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
              {/* Avatar y nombre */}
              <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                  {userInfo.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl text-gray-800">
                    {userInfo.nombre}
                  </h2>
                  <p className="text-gray-600">{userInfo.rol}</p>
                </div>
              </div>

              {/* Información detallada */}
              <div className="space-y-6">
                {/* ID de Usuario */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    ID de Usuario
                  </label>
                  <p className="text-gray-800">{userInfo.id}</p>
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Nombre Completo
                  </label>
                  <p className="text-gray-800">{userInfo.nombre}</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Correo Electrónico
                  </label>
                  <p className="text-gray-800">{userInfo.email}</p>
                </div>

                {/* Rol */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Rol en el Sistema
                  </label>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {userInfo.rol}
                  </span>
                </div>
              </div>

              {/* Botón cambiar contraseña */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleChangePassword}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cambiar Contraseña
                </button>
                {showChangePwd && (
                  <form onSubmit={submitChangePassword} className="mt-6 space-y-4">
                    {pwdError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {pwdError}
                      </div>
                    )}
                    {pwdSuccess && (
                      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        {pwdSuccess}
                      </div>
                    )}
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Contraseña actual</label>
                      <input
                        type="password"
                        value={pwdActual}
                        onChange={(e) => setPwdActual(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tu contraseña actual"
                        disabled={pwdSubmitting}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Nueva contraseña</label>
                      <input
                        type="password"
                        value={pwdNueva}
                        onChange={(e) => setPwdNueva(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nueva contraseña"
                        disabled={pwdSubmitting}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Confirmar nueva contraseña</label>
                      <input
                        type="password"
                        value={pwdConfirm}
                        onChange={(e) => setPwdConfirm(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Repite la nueva contraseña"
                        disabled={pwdSubmitting}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                      disabled={pwdSubmitting}
                    >
                      {pwdSubmitting ? 'Guardando...' : 'Guardar Contraseña'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Opciones de administrador */}
            {(userInfo.rol === 'Administrador' || userInfo.rol === 'ADMINISTRADOR') && (
              <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-8">
                <h2 className="text-lg text-purple-800 mb-4">
                  Opciones de Administrador
                </h2>
                <p className="text-sm text-purple-700 mb-4">
                  Como administrador, tienes acceso a funcionalidades adicionales
                  del sistema.
                </p>
                <button
                  onClick={handleManageUsers}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Gestionar Usuarios
                </button>
              </div>
            )}

            {/* Información sobre el endpoint */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-lg text-blue-800 mb-2">
                Endpoint de API
              </h2>
              <div className="space-y-2 text-sm text-blue-700">
                <p>
                  <strong>Obtener perfil:</strong> GET /api/users/me
                </p>
                <p>
                  <strong>Cambiar contraseña:</strong> PUT /api/users/change-password
                </p>
                {userInfo.rol === 'Administrador' && (
                  <p>
                    <strong>Gestionar usuarios:</strong> GET /api/users
                  </p>
                )}
                <p className="mt-4">
                  La información del usuario se obtiene del token de autenticación.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
