import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

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
  // Estado para la información del usuario
  const [userInfo, setUserInfo] = useState({
    id: '',
    nombre: '',
    email: '',
    rol: '',
  });

  // Estado de carga
  const [loading, setLoading] = useState(true);

  // useEffect para cargar información del usuario
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserInfo({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol || user.tipo // Soporta ambos formatos
      });
    }
    setLoading(false);
  }, []);

  // Función para cambiar contraseña (placeholder)
  const handleChangePassword = () => {
    // TODO: Implementar modal o redirección para cambiar contraseña
    // TODO: Llamar al endpoint PUT /api/users/change-password
    
    console.log('TODO: Implementar cambio de contraseña');
    alert('Funcionalidad de cambio de contraseña\n\nSe implementará con el backend.');
  };

  // Función para gestionar usuarios (solo admin)
  const handleManageUsers = () => {
    // TODO: Redirigir a pantalla de gestión de usuarios
    // TODO: Esta funcionalidad es solo para administradores
    
    console.log('TODO: Implementar gestión de usuarios');
    alert('Funcionalidad de gestión de usuarios\n\nSe implementará con el backend.');
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
            Mi Perfil
          </h1>
          <p className="text-gray-600">Información de tu cuenta</p>
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
              </div>
            </div>

            {/* Opciones de administrador */}
            {userInfo.rol === 'Administrador' && (
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
