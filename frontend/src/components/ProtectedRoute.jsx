import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_HOME } from "../config/permissions";

function ProtectedRoute({ children, allowedRoles }) {
  const { usuario, autenticado } = useAuth();
  const location = useLocation();

  if (!autenticado) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(usuario?.rol)
  ) {
    return (
      <Navigate
        to={ROLE_HOME[usuario?.rol] || "/login"}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;