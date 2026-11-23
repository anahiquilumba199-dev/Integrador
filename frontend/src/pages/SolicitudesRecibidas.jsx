
import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  CalendarDays,
  User,
  Phone,
  FileText,
  X,
  AlertCircle,
} from "lucide-react";

const STORAGE_KEY = "ecoraee_solicitudes_tecnico";

const solicitudesIniciales = [
  {
    id: "SOL-001",
    solicitante: "Facultad de Ingeniería",
    contacto: "0991234567",
    ubicacion: "Bloque A - Laboratorio 2",
    fecha: "2026-11-20",
    categoria: "Equipos informáticos",
    cantidad: 8,
    descripcion:
      "Se solicita la recolección de computadoras y monitores que ya no se encuentran en funcionamiento.",
    estado: "Pendiente",
    observacion: "",
  },
  {
    id: "SOL-002",
    solicitante: "Departamento Administrativo",
    contacto: "0987654321",
    ubicacion: "Edificio Administrativo",
    fecha: "2026-11-19",
    categoria: "Equipos electrónicos",
    cantidad: 5,
    descripcion:
      "Equipos electrónicos que fueron reemplazados y necesitan ser retirados.",
    estado: "En revisión",
    observacion: "Verificando la información proporcionada.",
  },
  {
    id: "SOL-003",
    solicitante: "Laboratorio de Redes",
    contacto: "0961122334",
    ubicacion: "Bloque B - Laboratorio 1",
    fecha: "2026-11-18",
    categoria: "Componentes informáticos",
    cantidad: 12,
    descripcion:
      "Se solicita retirar teclados, cables, fuentes de poder y otros componentes.",
    estado: "Aprobada",
    observacion: "Solicitud validada para coordinar la recolección.",
  },
  {
    id: "SOL-004",
    solicitante: "Biblioteca",
    contacto: "0974455667",
    ubicacion: "Biblioteca central",
    fecha: "2026-11-17",
    categoria: "Equipos informáticos",
    cantidad: 3,
    descripcion:
      "Tres equipos de escritorio que serán dados de baja.",
    estado: "Rechazada",
    observacion: "La información de los equipos está incompleta.",
  },
];

function SolicitudesRecibidas() {
  const [solicitudes, setSolicitudes] = useState(() => {
    try {
      const guardadas = localStorage.getItem(STORAGE_KEY);
      return guardadas
        ? JSON.parse(guardadas)
        : solicitudesIniciales;
    } catch {
      return solicitudesIniciales;
    }
  });

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [seleccionada, setSeleccionada] = useState(null);
  const [observacion, setObservacion] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(solicitudes));
  }, [solicitudes]);

  const solicitudesFiltradas = useMemo(() => {
    return solicitudes.filter((solicitud) => {
      const texto = busqueda.toLowerCase();

      const coincideBusqueda =
        solicitud.id.toLowerCase().includes(texto) ||
        solicitud.solicitante.toLowerCase().includes(texto) ||
        solicitud.ubicacion.toLowerCase().includes(texto);

      const coincideEstado =
        filtroEstado === "Todos" ||
        solicitud.estado === filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }, [solicitudes, busqueda, filtroEstado]);

  const estadisticas = {
    total: solicitudes.length,
    pendientes: solicitudes.filter(
      (s) => s.estado === "Pendiente"
    ).length,
    revision: solicitudes.filter(
      (s) => s.estado === "En revisión"
    ).length,
    aprobadas: solicitudes.filter(
      (s) => s.estado === "Aprobada"
    ).length,
    rechazadas: solicitudes.filter(
      (s) => s.estado === "Rechazada"
    ).length,
  };

  const abrirSolicitud = (solicitud) => {
    setSeleccionada(solicitud);
    setObservacion(solicitud.observacion || "");
  };

  const actualizarEstado = (nuevoEstado) => {
    if (!seleccionada) return;

    if (
      nuevoEstado === "Rechazada" &&
      !observacion.trim()
    ) {
      alert("Debes indicar el motivo del rechazo.");
      return;
    }

    const solicitudesActualizadas = solicitudes.map((solicitud) =>
      solicitud.id === seleccionada.id
        ? {
            ...solicitud,
            estado: nuevoEstado,
            observacion: observacion.trim(),
          }
        : solicitud
    );

    setSolicitudes(solicitudesActualizadas);
    setSeleccionada(null);
    setObservacion("");
  };

  const iniciarRevision = () => {
    if (!seleccionada) return;

    const solicitudesActualizadas = solicitudes.map((solicitud) =>
      solicitud.id === seleccionada.id
        ? { ...solicitud, estado: "En revisión" }
        : solicitud
    );

    setSolicitudes(solicitudesActualizadas);
    setSeleccionada({
      ...seleccionada,
      estado: "En revisión",
    });
  };

  return (
    <section className="dashboard requests-page">
      <div className="requests-heading">
        <div>
          <h1>Solicitudes recibidas</h1>
          <p>
            Consulta, revisa y valida las solicitudes de recolección
            asignadas a tu cuenta.
          </p>
        </div>

        <div className="requests-heading-icon">
          <ClipboardList size={30} />
        </div>
      </div>

      <div className="requests-stats">
        <div className="request-stat-card">
          <div className="request-stat-icon blue">
            <ClipboardList size={22} />
          </div>
          <div>
            <span>Total de solicitudes</span>
            <strong>{estadisticas.total}</strong>
          </div>
        </div>

        <div className="request-stat-card">
          <div className="request-stat-icon orange">
            <Clock size={22} />
          </div>
          <div>
            <span>Pendientes</span>
            <strong>{estadisticas.pendientes}</strong>
          </div>
        </div>

        <div className="request-stat-card">
          <div className="request-stat-icon purple">
            <AlertCircle size={22} />
          </div>
          <div>
            <span>En revisión</span>
            <strong>{estadisticas.revision}</strong>
          </div>
        </div>

        <div className="request-stat-card">
          <div className="request-stat-icon green">
            <CheckCircle size={22} />
          </div>
          <div>
            <span>Aprobadas</span>
            <strong>{estadisticas.aprobadas}</strong>
          </div>
        </div>
      </div>

      <div className="content-card requests-content">
        <div className="requests-toolbar">
          <div>
            <h3>Listado de solicitudes</h3>
            <p>Solicitudes asignadas para revisión técnica.</p>
          </div>

          <div className="requests-filters">
            <div className="requests-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar solicitud..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Pendiente">Pendientes</option>
              <option value="En revisión">En revisión</option>
              <option value="Aprobada">Aprobadas</option>
              <option value="Rechazada">Rechazadas</option>
            </select>
          </div>
        </div>

        <div className="requests-table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Solicitante</th>
                <th>Ubicación</th>
                <th>Fecha</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {solicitudesFiltradas.map((solicitud) => (
                <tr key={solicitud.id}>
                  <td>
                    <strong>{solicitud.id}</strong>
                  </td>
                  <td>{solicitud.solicitante}</td>
                  <td>{solicitud.ubicacion}</td>
                  <td>{solicitud.fecha}</td>
                  <td>{solicitud.cantidad} equipos</td>
                  <td>
                    <span
                      className={`request-status ${solicitud.estado
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {solicitud.estado}
                    </span>
                  </td>
                  <td>
                    <button
                      className="request-view-button"
                      onClick={() => abrirSolicitud(solicitud)}
                      title="Ver solicitud"
                    >
                      <Eye size={17} />
                      Revisar
                    </button>
                  </td>
                </tr>
              ))}

              {solicitudesFiltradas.length === 0 && (
                <tr>
                  <td colSpan="7" className="requests-empty">
                    No se encontraron solicitudes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {seleccionada && (
        <div
          className="request-modal-overlay"
          onClick={() => setSeleccionada(null)}
        >
          <div
            className="request-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="request-modal-header">
              <div>
                <span>Detalle de solicitud</span>
                <h2>{seleccionada.id}</h2>
              </div>

              <button
                className="request-close-button"
                onClick={() => setSeleccionada(null)}
              >
                <X size={22} />
              </button>
            </div>

            <div className="request-modal-body">
              <div className="request-detail-status">
                <span>Estado actual</span>
                <span
                  className={`request-status ${seleccionada.estado
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {seleccionada.estado}
                </span>
              </div>

              <div className="request-detail-grid">
                <div className="request-detail-item">
                  <User size={19} />
                  <div>
                    <span>Solicitante</span>
                    <strong>{seleccionada.solicitante}</strong>
                  </div>
                </div>

                <div className="request-detail-item">
                  <Phone size={19} />
                  <div>
                    <span>Contacto</span>
                    <strong>{seleccionada.contacto}</strong>
                  </div>
                </div>

                <div className="request-detail-item">
                  <MapPin size={19} />
                  <div>
                    <span>Ubicación</span>
                    <strong>{seleccionada.ubicacion}</strong>
                  </div>
                </div>

                <div className="request-detail-item">
                  <CalendarDays size={19} />
                  <div>
                    <span>Fecha de solicitud</span>
                    <strong>{seleccionada.fecha}</strong>
                  </div>
                </div>
              </div>

              <div className="request-detail-section">
                <h4>Información de la recolección</h4>

                <p>
                  <strong>Categoría:</strong>{" "}
                  {seleccionada.categoria}
                </p>

                <p>
                  <strong>Cantidad aproximada:</strong>{" "}
                  {seleccionada.cantidad} equipos
                </p>
              </div>

              <div className="request-detail-section">
                <h4>
                  <FileText size={17} /> Descripción
                </h4>
                <p>{seleccionada.descripcion}</p>
              </div>

              <div className="request-observation">
                <label htmlFor="request-observation">
                  Observaciones del técnico
                </label>
                <textarea
                  id="request-observation"
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  placeholder="Escribe las observaciones de la revisión..."
                  rows={3}
                  disabled={
                    seleccionada.estado === "Aprobada" ||
                    seleccionada.estado === "Rechazada"
                  }
                />
              </div>

              {seleccionada.observacion &&
                (seleccionada.estado === "Aprobada" ||
                  seleccionada.estado === "Rechazada") && (
                  <p className="request-previous-observation">
                    Observación registrada: {seleccionada.observacion}
                  </p>
                )}
            </div>

            <div className="request-modal-footer">
              {seleccionada.estado === "Pendiente" && (
                <button
                  className="request-review-button"
                  onClick={iniciarRevision}
                >
                  <Clock size={17} />
                  Iniciar revisión
                </button>
              )}

              {(seleccionada.estado === "Pendiente" ||
                seleccionada.estado === "En revisión") && (
                <>
                  <button
                    className="request-reject-button"
                    onClick={() => actualizarEstado("Rechazada")}
                  >
                    <XCircle size={17} />
                    Rechazar
                  </button>

                  <button
                    className="request-approve-button"
                    onClick={() => actualizarEstado("Aprobada")}
                  >
                    <CheckCircle size={17} />
                    Aprobar solicitud
                  </button>
                </>
              )}

              {(seleccionada.estado === "Aprobada" ||
                seleccionada.estado === "Rechazada") && (
                <button
                  className="request-review-button"
                  onClick={() => setSeleccionada(null)}
                >
                  Cerrar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SolicitudesRecibidas;
