
import {
  Monitor,
  Truck,
  Package,
  ClipboardList,
  Recycle,
  ArrowRight
} from "lucide-react";

const statistics = [
  {
    title: "Dispositivos registrados",
    value: "125",
    description: "Total de dispositivos",
    icon: Monitor
  },
  {
    title: "Dispositivos recolectados",
    value: "86",
    description: "Total recolectado",
    icon: Truck
  },
  {
    title: "En inventario",
    value: "64",
    description: "Dispositivos registrados",
    icon: Package
  },
  {
    title: "Solicitudes pendientes",
    value: "12",
    description: "Por gestionar",
    icon: ClipboardList
  }
];

function Dashboard() {
  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Panel principal</h1>
          <p>Bienvenido a EcoRAEE Cloud. Este es el resumen de gestión.</p>
        </div>

        <span className="status-label">Sistema de gestión RAEE</span>
      </div>

      <div className="stats-grid">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <article className="stat-card" key={item.title}>
              <div className="stat-top">
                <div>
                  <p>{item.title}</p>
                  <h2>{item.value}</h2>
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
          <h3>Actividad del sistema</h3>
          <p>Resumen de las actividades de gestión de residuos electrónicos.</p>

          <div className="activity-item">
            <div className="activity-icon"><Monitor size={19} /></div>
            <div>
              <strong>Registro de dispositivos</strong>
              <small>Gestión de equipos electrónicos</small>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon"><Truck size={19} /></div>
            <div>
              <strong>Recolección de RAEE</strong>
              <small>Seguimiento de solicitudes</small>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon"><Package size={19} /></div>
            <div>
              <strong>Control de inventario</strong>
              <small>Administración de dispositivos</small>
            </div>
          </div>
        </article>

        <article className="content-card sustainability-card">
          <div className="sustainability-icon">
            <Recycle size={35} />
          </div>
          <h3>Compromiso ambiental</h3>
          <p>
            EcoRAEE Cloud permite organizar y controlar la gestión de
            residuos de aparatos eléctricos y electrónicos.
          </p>
          <span className="sustainability-link">
            Gestión responsable <ArrowRight size={16} />
          </span>
        </article>
      </div>
    </section>
  );
}

export default Dashboard;
