
import { useAuth } from "../context/useAuth";
import { ROLE_LABELS } from "../config/permissions";
import { LogOut, UserCircle } from "lucide-react";

function Navbar() {
  const { usuario, logout } = useAuth();

  const nombre = usuario?.nombre || usuario?.email || "Usuario";
  const rol = usuario?.rol;

  return (
    <header className="navbar">
      <div className="navbar-user">
        <div className="navbar-avatar">
          <UserCircle size={25} />
        </div>

        <div className="navbar-user-info">
          <strong>{nombre}</strong>
          <span>{ROLE_LABELS[rol] || "Usuario"}</span>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={logout}
        >
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

export default Navbar;
