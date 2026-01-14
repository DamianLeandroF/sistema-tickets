import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

/**
 * Componente CreateTicket - Formulario para crear un nuevo ticket
 * 
 * Esta pantalla solo debería ser visible para usuarios con rol de "Trabajador".
 * Permite crear un nuevo ticket con título y descripción.
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
    setIsSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert('Error: Usuario no autenticado');
        navigate('/login');
        return;
      }

      // Endpoint con query param trabajadorId
      const response = await fetch(`http://localhost:8080/api/tickets?trabajadorId=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Ticket creado exitosamente con ID: ' + data.id);
        
        // Limpiar el formulario
        setFormData({ titulo: '', descripcion: '' });
        
        // Redirigir a la lista de tickets
        navigate('/tickets');
      } else {
        const errorText = await response.text();
        alert('Error al crear el ticket: ' + errorText);
      }
    } catch (error) {
      console.error('Error al crear ticket:', error);
      alert('Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
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
              {/* Input Título */}
              <div>
                <label
                  htmlFor="titulo"
                  className="block text-sm text-gray-700 mb-2"
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
                />
              </div>

              {/* Textarea Descripción */}
              <div>
                <label
                  htmlFor="descripcion"
                  className="block text-sm text-gray-700 mb-2"
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
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creando...' : 'Crear Ticket'}
                </button>
              </div>
            </form>
          </div>

          {/* Información del endpoint */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg text-blue-800 mb-2">
              Endpoint de API
            </h2>
            <div className="space-y-2 text-sm text-blue-700">
              <p>
                <strong>Crear ticket:</strong> POST /api/tickets
              </p>
              <p className="mt-2">
                <strong>Body:</strong>
              </p>
              <pre className="bg-blue-100 p-3 rounded text-xs overflow-x-auto">
{`{
  "titulo": "string",
  "descripcion": "string"
}`}
              </pre>
              <p className="mt-4">
                El backend debe asociar automáticamente el ticket con el usuario
                autenticado y establecer el estado inicial como "pendiente".
              </p>
            </div>
          </div>

          {/* Nota sobre roles */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-lg text-yellow-800 mb-2">
              Nota sobre Roles
            </h2>
            <p className="text-sm text-yellow-700">
              Esta pantalla debería ser accesible solo para usuarios con rol de
              <strong> Trabajador</strong>. La validación de permisos debe
              implementarse en el backend.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
