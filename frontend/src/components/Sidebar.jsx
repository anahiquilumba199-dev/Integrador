
import {
  LayoutDashboard,
  Monitor,
  Building2,
  Truck,
  Package,
  ClipboardCheck,
  Users,
  Recycle
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    { name: "Panel principal", path: "/dashboard", icon: LayoutDashboard },
    { name: "Dispositivos", path: "/dispositivos", icon: Monitor },
    { name: "Centros de acopio", path: "/centros", icon: Building2 },
    { name: "Recolecciones", path: "/recolecciones", icon: Truck },
    { name: "Inventario", path: "/inventario", icon: Package },
    { name: "Evaluaciones", path: "/evaluaciones", icon: ClipboardCheck },
    { name: "Usuarios", path: "/usuarios", icon: Users }
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <Recycle size={27} />
        <span>EcoRAEE</span> Cloud
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
              className={({ isActive }) => isActive ? "active" : ""}
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
