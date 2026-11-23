import { useAuth } from "../context/useAuth";
import DashboardAdministrador from "./DashboardAdministrador";
import DashboardTecnico from "./DashboardTecnico";
import DashboardOperador from "./DashboardOperador";

function Dashboard() {
  const { usuario } = useAuth();

  switch (usuario?.rol) {
    case "ADMINISTRADOR":
      return <DashboardAdministrador />;

    case "TECNICO":
      return <DashboardTecnico />;

    case "OPERADOR":
      return <DashboardOperador />;

    default:
      return (
        <section className="dashboard">
          <h1>Panel no disponible</h1>
          <p>No se pudo identificar el rol del usuario.</p>
        </section>
      );
  }
}

export default Dashboard;