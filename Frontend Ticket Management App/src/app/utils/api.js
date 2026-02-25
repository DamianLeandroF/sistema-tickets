/**
 * Utilidad API - Cliente HTTP con soporte JWT
 *
 * Envía automáticamente el token JWT en el header Authorization
 * y maneja respuestas 401 (no autorizado) redirigiendo al login.
 */

const API_BASE = 'http://localhost:8080';

/**
 * Obtiene los headers con el token JWT si existe
 */
function getAuthHeaders(customHeaders = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Maneja respuesta 401: limpia sesión y redirige al login
 */
function handleUnauthorized(response) {
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
    return true;
  }
  return false;
}

/**
 * Fetch con JWT - Wrapper sobre fetch que añade el token y maneja 401
 *
 * @param {string} url - URL completa o path relativo (ej: /api/tickets)
 * @param {object} options - Opciones de fetch (method, body, headers, etc.)
 * @returns {Promise<Response>}
 */
export async function apiFetch(url, options = {}) {
  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
  const { headers: customHeaders, ...restOptions } = options;

  const response = await fetch(fullUrl, {
    ...restOptions,
    headers: getAuthHeaders(customHeaders),
  });

  if (handleUnauthorized(response)) {
    throw new Error('Sesión expirada');
  }

  return response;
}

export { API_BASE };
