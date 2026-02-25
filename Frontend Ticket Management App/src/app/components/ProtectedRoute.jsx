import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Recuperar usuario y token del localStorage (JWT)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  
  // Si no hay sesión o token JWT, redirigir al login
  if (!user.id || !token) {
    return <Navigate to="/" replace />;
  }
  
  // REGLA DE NEGOCIO: Si el sistema exige cambio, bloqueamos el acceso
  // a cualquier otra ruta y lo mandamos a la vista de cambio obligatorio.
  if (user.forzarCambio) {
    return <Navigate to="/perfil" replace />;
  }

  return children;
};
export default ProtectedRoute;