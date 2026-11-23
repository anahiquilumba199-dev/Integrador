
import { NavLink } from "react-router-dom";
import { Recycle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { MENU_BY_ROLE } from "../config/permissions";

function Sidebar() {
  const { usuario } = useAuth();

  const menuItems = MENU_BY_ROLE[usuario?.rol] || [];

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-icon">
          <Recycle size={27} />
        </div>

        <div className="logo-text">
          <span>EcoRAEE</span> Cloud
        </div>
      </div>

      <p className="sidebar-description">
        Gestión inteligente de residuos electrónicos
      </p>

      <p className="menu-title">MENÚ PRINCIPAL</p>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Recycle size={17} />
        <span>Un futuro más sostenible</span>
      </div>
    </aside>
  );
}

export default Sidebar;
