
import { Bell, Search } from "lucide-react";

function Navbar() {
  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={18} />
        <input type="text" placeholder="Buscar..." />
      </div>

      <div className="topbar-actions">
        <button className="notification-button" aria-label="Notificaciones">
          <Bell size={20} />
        </button>

        <div className="user-info">
          <div className="user-avatar">M</div>
          <div>
            <strong>Administrador</strong>
            <small>Gestión del sistema</small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
