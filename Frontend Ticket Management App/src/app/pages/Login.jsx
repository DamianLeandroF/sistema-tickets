import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente Login - Pantalla de inicio de sesión
 * 
 * Permite al usuario ingresar con su email/ID y contraseña.
 * Conectado con el backend Spring Boot.
 */
export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Maneja los cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // El backend espera { email, password } en LoginRequest
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.userId,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const usuario = data.user;
        
        // Guardar datos del usuario
        localStorage.setItem('user', JSON.stringify(usuario));
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        // Verificar si debe cambiar contraseña
        if (usuario && usuario.forzarCambio) {
          alert('Por razones de seguridad, debe actualizar su contraseña inicial (su ID) antes de continuar.');
          localStorage.setItem('user', JSON.stringify(usuario));
          navigate('/perfil'); // Redirigir a perfil para cambiar contraseña
        } else {
          // Redirigir al dashboard
          navigate('/dashboard');
        }
      } else {
        const errorText = await response.text();
        setError(errorText || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Sistema de Tickets
          </h1>
          <p className="text-gray-600">Ingrese sus credenciales</p>
        </div>

        {/* Formulario de login */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Input ID */}
          <div>
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email o ID de Usuario
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="admin@iset.com o 1"
              required
              disabled={loading}
            />
          </div>

          {/* Input Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese su contraseña"
              required
              disabled={loading}
            />
          </div>

          {/* Botón de submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {/* Usuarios de prueba */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-800 mb-2">Usuarios de prueba:</p>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>Admin:</strong> admin@iset.com / 1</p>
            <p><strong>Técnico:</strong> juan@iset.com / 2</p>
            <p><strong>Trabajador:</strong> pedro@iset.com / 3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
