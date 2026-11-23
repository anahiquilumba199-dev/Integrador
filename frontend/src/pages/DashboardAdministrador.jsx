import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Monitor,
  Truck,
  Package,
  ClipboardList,
  Users,
  ClipboardCheck,
  Recycle,
  ArrowRight
} from "lucide-react";

const statistics = [
  {
    title: "Dispositivos registrados",
    key: "registered",
    description: "Total de dispositivos",
    icon: Monitor
  },
  {
    title: "Dispositivos recolectados",
    key: "collected",
    description: "Total recolectado",
    icon: Truck
  },
  {
    title: "En inventario",
    key: "inventory",
    description: "Dispositivos registrados",
    icon: Package
  },
  {
    title: "Solicitudes pendientes",
    key: "pending",
    description: "Por gestionar",
    icon: ClipboardList
  },
  {
    title: "Usuarios activos",
    key: "active_users",
    description: "Personal registrado",
    icon: Users
  },
  {
    title: "Dispositivos evaluados",
    key: "evaluated",
    description: "Evaluaciones completadas",
    icon: ClipboardCheck
  }
];

function DashboardAdministrador() {
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api.get("/dashboard").then(
      (datos) => { if (active) setResumen(datos); },
      (failure) => { if (active) setError(failure.message); }
    );
    return () => { active = false; };
  }, []);
  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Panel del administrador</h1>
          <p>
            Bienvenido. Desde aquí puedes supervisar la gestión
            general de EcoRAEE Cloud.
          </p>
        </div>

        <span className="status-label">
          Administración general
        </span>
      </div>

      {error && <p role="alert">{error}</p>}
      <div className="stats-grid">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <article className="stat-card" key={item.title}>
              <div className="stat-top">
                <div>
                  <p>{item.title}</p>
                  <h2>{resumen?.[item.key] ?? "—"}</h2>
                </div>

                <div className="stat-icon">
                  <Icon size={24} />
                </div>
              </div>

              <span>{item.description}</span>
            </article>
          );
        })}
      </div>

      <div className="dashboard-columns">
        <article className="content-card">
          <h3>Supervisión del sistema</h3>
          <p>
            Actividades principales que puedes supervisar
            desde tu cuenta.
          </p>

          <div className="activity-item">
            <div className="activity-icon">
              <Users size={19} />
            </div>
            <div>
              <strong>Gestión de usuarios</strong>
              <small>Crear y administrar cuentas del personal</small>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">
              <Monitor size={19} />
            </div>
            <div>
              <strong>Registro de dispositivos</strong>
              <small>Supervisar los dispositivos registrados</small>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">
              <ClipboardCheck size={19} />
            </div>
            <div>
              <strong>Asignación y evaluaciones</strong>
              <small>Supervisar el trabajo de los técnicos</small>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">
              <Package size={19} />
            </div>
            <div>
              <strong>Control de inventario</strong>
              <small>Consultar existencias y movimientos</small>
            </div>
          </div>
        </article>

        <article className="content-card sustainability-card">
          <div className="sustainability-icon">
            <Recycle size={35} />
          </div>

          <h3>Administración responsable</h3>

          <p>
            Supervisa los procesos de recolección,
            clasificación, evaluación y destino final
            de los residuos electrónicos.
          </p>

          <span className="sustainability-link">
            Gestión integral <ArrowRight size={16} />
          </span>
        </article>
      </div>
    </section>
  );
}

export default DashboardAdministrador;