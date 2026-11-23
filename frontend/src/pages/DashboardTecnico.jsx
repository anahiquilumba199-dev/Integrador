
import {
  ClipboardList,
  Monitor,
  ClipboardCheck,
  CheckCircle,
  Recycle,
  Clock,
  ArrowRight,
  CalendarDays,
  AlertCircle,
  FileCheck,
  Activity
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const statistics = [
  {
    title: "Tareas asignadas",
    value: "12",
    description: "Registros por gestionar",
    icon: ClipboardList,
    color: "blue"
  },
  {
    title: "Pendientes de revisión",
    value: "5",
    description: "Requieren validación",
    icon: Clock,
    color: "orange"
  },
  {
    title: "Evaluaciones pendientes",
    value: "4",
    description: "Por realizar",
    icon: ClipboardCheck,
    color: "purple"
  },
  {
    title: "Trabajos completados",
    value: "18",
    description: "Procesos finalizados",
    icon: CheckCircle,
    color: "green"
  }
];

const tareas = [
  {
    codigo: "DIS-001",
    dispositivo: "Computadora de escritorio",
    actividad: "Validación técnica",
    centro: "Centro Norte",
    fecha: "22/11/2026",
    estado: "Pendiente"
  },
  {
    codigo: "DIS-002",
    dispositivo: "Monitor LED",
    actividad: "Evaluación técnica",
    centro: "Centro Sur",
    fecha: "22/11/2026",
    estado: "En evaluación"
  },
  {
    codigo: "DIS-003",
    dispositivo: "Impresora",
    actividad: "Revisión de información",
    centro: "Centro Norte",
    fecha: "21/11/2026",
    estado: "Pendiente"
  },
  {
    codigo: "DIS-004",
    dispositivo: "Laptop",
    actividad: "Registro de tratamiento",
    centro: "Centro Sur",
    fecha: "21/11/2026",
    estado: "En proceso"
  }
];

function DashboardTecnico() {
  const navigate = useNavigate();

  return (
    <section className="dashboard">

      {/* ENCABEZADO */}
      <div className="dashboard-header">
        <div>
          <h1>Panel del técnico</h1>
          <p>
            Administra tus tareas asignadas, valida dispositivos
            y realiza el seguimiento de los procesos técnicos.
          </p>
        </div>

        <span className="status-label">
          Área técnica
        </span>
      </div>

      {/* ESTADÍSTICAS */}
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

                <div className={`stat-icon technician-${item.color}`}>
                  <Icon size={24} />
                </div>
              </div>

              <span>{item.description}</span>
            </article>
          );
        })}
      </div>

      {/* BANDEJA DE TRABAJO */}
      <article className="content-card technician-tasks">

        <div className="technician-section-header">
          <div>
            <h3>Mi bandeja de trabajo</h3>
            <p>
              Registros y actividades que requieren tu atención.
            </p>
          </div>

          <button
            className="secondary-button"
            onClick={() => navigate("/dispositivos")}
          >
            Ver dispositivos <ArrowRight size={16} />
          </button>
        </div>

        <div className="technician-table-container">
          <table className="technician-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Dispositivo</th>
                <th>Actividad</th>
                <th>Centro</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {tareas.map((tarea) => (
                <tr key={tarea.codigo}>
                  <td>
                    <strong>{tarea.codigo}</strong>
                  </td>

                  <td>{tarea.dispositivo}</td>

                  <td>{tarea.actividad}</td>

                  <td>{tarea.centro}</td>

                  <td>{tarea.fecha}</td>

                  <td>
                    <span
                      className={`technician-status ${
                        tarea.estado === "Pendiente"
                          ? "pending"
                          : tarea.estado === "En evaluación"
                          ? "evaluating"
                          : "processing"
                      }`}
                    >
                      {tarea.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="technician-demo-note">
          <AlertCircle size={16} />
          Los registros mostrados son datos demostrativos.
        </div>
      </article>

      {/* ACTIVIDADES Y GESTIÓN */}
      <div className="dashboard-columns">

        <article className="content-card">
          <h3>Actividades técnicas</h3>

          <p>
            Procesos que debes realizar como responsable técnico.
          </p>

          <div className="activity-item">
            <div className="activity-icon">
              <ClipboardList size={19} />
            </div>

            <div>
              <strong>Revisar solicitudes recibidas</strong>
              <small>
                Consultar los registros asignados.
              </small>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">
              <Monitor size={19} />
            </div>

            <div>
              <strong>Validar dispositivos</strong>
              <small>
                Verificar y completar información técnica.
              </small>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">
              <ClipboardCheck size={19} />
            </div>

            <div>
              <strong>Realizar evaluaciones</strong>
              <small>
                Determinar el estado y clasificación del equipo.
              </small>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon">
              <Recycle size={19} />
            </div>

            <div>
              <strong>Registrar tratamientos</strong>
              <small>
                Dar seguimiento al procedimiento aplicado.
              </small>
            </div>
          </div>
        </article>

        <article className="content-card technician-responsibility">

          <div className="sustainability-icon">
            <Activity size={35} />
          </div>

          <h3>Responsabilidad técnica</h3>

          <p>
            Cada dispositivo debe contar con información
            verificada, una evaluación técnica y un seguimiento
            adecuado antes de determinar su tratamiento o destino.
          </p>

          <div className="technician-reminder">
            <FileCheck size={18} />
            <span>
              Mantén actualizados los registros y las evaluaciones.
            </span>
          </div>

          <div className="technician-reminder">
            <CalendarDays size={18} />
            <span>
              Atiende las tareas pendientes según su prioridad.
            </span>
          </div>

        </article>
      </div>

    </section>
  );
}

export default DashboardTecnico;
