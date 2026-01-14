import React from 'react';
import Sidebar from '../components/Sidebar';
import { Mail, Phone, MessageCircle, HelpCircle } from 'lucide-react';

/**
 * Componente Soporte - Información de contacto y ayuda
 * 
 * Pantalla informativa con información de contacto para soporte técnico.
 * Incluye placeholders para botones de contacto.
 */
export default function Soporte() {
  // Función placeholder para contactar por email
  const handleContactEmail = () => {
    console.log('TODO: Abrir cliente de correo o formulario de contacto');
    alert('Funcionalidad de contacto por email\n\nEsto abrirá el cliente de correo predeterminado.');
  };

  // Función placeholder para contactar por teléfono
  const handleContactPhone = () => {
    console.log('TODO: Iniciar llamada telefónica');
    alert('Contacto telefónico\n\n+34 900 123 456');
  };

  // Función placeholder para chat
  const handleContactChat = () => {
    console.log('TODO: Abrir chat de soporte');
    alert('Funcionalidad de chat\n\nEsto abrirá una ventana de chat en vivo.');
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
            Soporte y Ayuda
          </h1>
          <p className="text-gray-600">
            ¿Necesitas ayuda? Estamos aquí para asistirte
          </p>
        </div>

        <div className="max-w-4xl">
          {/* Información principal */}
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl text-gray-800 mb-2">
                  Centro de Soporte
                </h2>
                <p className="text-gray-600">
                  Si tienes problemas con el sistema o necesitas asistencia,
                  nuestro equipo de soporte está disponible para ayudarte.
                </p>
              </div>
            </div>

            {/* Horario de atención */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg text-gray-800 mb-3">
                Horario de Atención
              </h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Lunes a Viernes:</strong> 9:00 AM - 6:00 PM
                </p>
                <p>
                  <strong>Sábados:</strong> 10:00 AM - 2:00 PM
                </p>
                <p>
                  <strong>Domingos y Festivos:</strong> Cerrado
                </p>
              </div>
            </div>

            {/* Opciones de contacto */}
            <h3 className="text-lg text-gray-800 mb-4">
              Formas de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Email */}
              <button
                onClick={handleContactEmail}
                className="flex flex-col items-center gap-3 p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-800 mb-1">
                    Correo Electrónico
                  </p>
                  <p className="text-xs text-gray-600">
                    soporte@empresa.com
                  </p>
                </div>
              </button>

              {/* Teléfono */}
              <button
                onClick={handleContactPhone}
                className="flex flex-col items-center gap-3 p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-800 mb-1">
                    Teléfono
                  </p>
                  <p className="text-xs text-gray-600">
                    +34 900 123 456
                  </p>
                </div>
              </button>

              {/* Chat */}
              <button
                onClick={handleContactChat}
                className="flex flex-col items-center gap-3 p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-800 mb-1">
                    Chat en Vivo
                  </p>
                  <p className="text-xs text-gray-600">
                    Disponible ahora
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Preguntas frecuentes */}
          <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 mb-6">
            <h2 className="text-xl text-gray-800 mb-6">
              Preguntas Frecuentes
            </h2>
            <div className="space-y-6">
              {/* FAQ 1 */}
              <div>
                <h3 className="text-gray-800 mb-2">
                  ¿Cómo puedo crear un nuevo ticket?
                </h3>
                <p className="text-gray-600 text-sm">
                  Ve a la sección "Crear Ticket" en el menú lateral, completa
                  el formulario con el título y descripción del problema, y haz
                  clic en "Crear Ticket".
                </p>
              </div>

              {/* FAQ 2 */}
              <div>
                <h3 className="text-gray-800 mb-2">
                  ¿Cómo sé si mi ticket ha sido atendido?
                </h3>
                <p className="text-gray-600 text-sm">
                  Puedes ver el estado de tus tickets en la sección "Tickets".
                  Los estados incluyen: Pendiente, En Proceso, Resuelto y
                  Finalizado.
                </p>
              </div>

              {/* FAQ 3 */}
              <div>
                <h3 className="text-gray-800 mb-2">
                  ¿Puedo ver quién está trabajando en mi ticket?
                </h3>
                <p className="text-gray-600 text-sm">
                  Sí, en cada card de ticket se muestra el técnico asignado una
                  vez que el ticket ha sido tomado.
                </p>
              </div>

              {/* FAQ 4 */}
              <div>
                <h3 className="text-gray-800 mb-2">
                  ¿Cómo cambio mi contraseña?
                </h3>
                <p className="text-gray-600 text-sm">
                  Ve a tu perfil y haz clic en el botón "Cambiar Contraseña".
                  Deberás ingresar tu contraseña actual y la nueva contraseña.
                </p>
              </div>
            </div>
          </div>

          {/* Nota informativa */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg text-blue-800 mb-2">
              Información del Sistema
            </h2>
            <p className="text-sm text-blue-700">
              Este es un sistema de gestión de tickets desarrollado como
              proyecto para la materia de Programación Orientada a Objetos. El
              frontend está implementado en React con JavaScript y Tailwind CSS,
              preparado para conectarse con un backend en Spring Boot.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
