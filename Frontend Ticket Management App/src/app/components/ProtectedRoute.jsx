import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Recuperar el usuario del localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Si no hay sesión iniciada, redirigir al login
  if (!user.id) {
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