import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente Login - Pantalla de inicio de sesión
 * 
 * Permite al usuario ingresar con su ID y contraseña.
 * 
 * IMPORTANTE: No implementa autenticación real.
 * La lógica de autenticación debe manejarse con el backend Spring Boot.
 */
export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });

  // Maneja los cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // Guardar token y datos del usuario
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirigir al dashboard
        navigate('/dashboard');
      } else {
        const errorText = await response.text();
        alert('Error: ' + errorText);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl text-gray-800 mb-2">
            Gestión de Tickets
          </h1>
          <p className="text-gray-600">Sistema de Tickets POO</p>
        </div>

        {/* Formulario de login */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input ID */}
          <div>
            <label
              htmlFor="userId"
              className="block text-sm text-gray-700 mb-2"
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
              placeholder="Ingrese su email o ID"
              required
            />
          </div>

          {/* Input Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm text-gray-700 mb-2"
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
            />
          </div>

          {/* Botón de submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ingresar
          </button>
        </form>

        {/* Nota informativa */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Nota:</strong> La autenticación real se implementará con el
            backend en Spring Boot.
          </p>
        </div>
      </div>
    </div>
  );
}
