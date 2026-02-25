import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { apiFetch } from '../utils/api';

/**
 * Componente CreateTicket - Formulario para crear un nuevo ticket
 * 
 * Solo trabajadores pueden crear tickets.
 * Conectado con el endpoint: POST /api/tickets/crear/{trabajadorId}
 */
export default function CreateTicket() {
  const navigate = useNavigate();

  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
  });

  // Estado de envío
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Obtener usuario
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Verificar que sea trabajador
  const esTrabajador = user.rol === 'trabajador';

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
    setIsSubmitting(true);
    setError('');

    try {
      if (!user || !user.id) {
        alert('Error: Usuario no autenticado');
        navigate('/');
        return;
      }

      // Verificar que sea trabajador
      if (!esTrabajador) {
        setError('Solo los trabajadores pueden crear tickets');
        setIsSubmitting(false);
        return;
      }

      // Endpoint correcto: POST /api/tickets/crear/{trabajadorId}
      const response = await apiFetch(`/api/tickets/crear/${user.id}`, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert('✅ Ticket creado exitosamente con ID: ' + data.id);
        
        // Limpiar el formulario
        setFormData({ titulo: '', descripcion: '' });
        
        // Redirigir a la lista de tickets
        navigate('/tickets');
      } else {
        const errorText = await response.text();
        setError(errorText || 'Error al crear el ticket');
      }
    } catch (error) {
      console.error('Error al crear ticket:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si no es trabajador, mostrar mensaje
  if (!esTrabajador) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-2xl font-bold text-red-800 mb-2">Acceso Denegado</h2>
              <p className="text-red-700">Solo los trabajadores pueden crear tickets.</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Crear Nuevo Ticket
          </h1>
          <p className="text-gray-600">
            Reporta un problema o solicitud de soporte
          </p>
        </div>

        {/* Formulario */}
        <div className="max-w-2xl">
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mensaje de error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Input Título */}
              <div>
                <label
                  htmlFor="titulo"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Título del Ticket *
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Error en el sistema de inventario"
                  required
                  disabled={isSubmitting}
                  maxLength={150}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.titulo.length}/150 caracteres
                </p>
              </div>

              {/* Textarea Descripción */}
              <div>
                <label
                  htmlFor="descripcion"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Descripción *
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe el problema o solicitud con detalle..."
                  required
                  disabled={isSubmitting}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Proporciona la mayor cantidad de detalles posibles para
                  facilitar la resolución.
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/tickets')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creando...' : 'Crear Ticket'}
                </button>
              </div>
            </form>
          </div>


        </div>
      </main>
    </div>
  );
}
