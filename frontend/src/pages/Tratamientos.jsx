
import { useEffect, useMemo, useState } from "react";
import {
  FlaskConical,
  Search,
  Plus,
  Eye,
  CalendarDays,
  Monitor,
  User,
  CheckCircle,
  Clock,
  XCircle,
  X,
  FileText,
  Save,
} from "lucide-react";

const STORAGE_KEY = "ecoraee_tratamientos_tecnico";

const tratamientosIniciales = [
  {
    id: "TRA-001",
    dispositivo: "DIS-001",
    nombreDispositivo: "Computadora de escritorio",
    categoria: "Equipo informático",
    tipo: "Reparación",
    responsable: "Técnico asignado",
    fechaInicio: "2026-11-20",
    fechaFin: "",
    estado: "En proceso",
    descripcion: "Revisión y reparación de componentes internos.",
    resultado: "",
  },
  {
    id: "TRA-002",
    dispositivo: "DIS-002",
    nombreDispositivo: "Monitor LED",
    categoria: "Equipo informático",
    tipo: "Recuperación de componentes",
    responsable: "Técnico asignado",
    fechaInicio: "2026-11-18",
    fechaFin: "2026-11-21",
    estado: "Completado",
    descripcion: "Recuperación de piezas que pueden reutilizarse.",
    resultado: "Se recuperaron componentes funcionales.",
  },
  {
    id: "TRA-003",
    dispositivo: "DIS-003",
    nombreDispositivo: "Impresora",
    categoria: "Equipo electrónico",
    tipo: "Evaluación especializada",
    responsable: "Técnico asignado",
    fechaInicio: "2026-11-22",
    fechaFin: "",
    estado: "Programado",
    descripcion: "Requiere revisión especializada.",
    resultado: "",
  },
];

const formularioInicial = {
  dispositivo: "",
  nombreDispositivo: "",
  categoria: "",
  tipo: "Reparación",
  responsable: "",
  fechaInicio: new Date().toLocaleDateString("en-CA"),
  fechaFin: "",
  descripcion: "",
  resultado: "",
};

function Tratamientos() {
  const [tratamientos, setTratamientos] = useState(() => {
    try {
      const guardados = localStorage.getItem(STORAGE_KEY);
      return guardados
        ? JSON.parse(guardados)
        : tratamientosIniciales;
    } catch {
      return tratamientosIniciales;
    }
  });

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tratamientos));
  }, [tratamientos]);

  const tratamientosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();

    return tratamientos.filter((tratamiento) => {
      const coincideTexto =
        tratamiento.id.toLowerCase().includes(texto) ||
        tratamiento.dispositivo.toLowerCase().includes(texto) ||
        tratamiento.nombreDispositivo.toLowerCase().includes(texto) ||
        tratamiento.tipo.toLowerCase().includes(texto);

      const coincideEstado =
        filtroEstado === "Todos" ||
        tratamiento.estado === filtroEstado;

      return coincideTexto && coincideEstado;
    });
  }, [tratamientos, busqueda, filtroEstado]);

  const estadisticas = {
    total: tratamientos.length,
    programados: tratamientos.filter(
      (t) => t.estado === "Programado"
    ).length,
    proceso: tratamientos.filter(
      (t) => t.estado === "En proceso"
    ).length,
    completados: tratamientos.filter(
      (t) => t.estado === "Completado"
    ).length,
  };

  const abrirNuevo = () => {
    setFormulario(formularioInicial);
    setSeleccionado(null);
    setModoEdicion(false);
    setModalAbierto(true);
  };

  const abrirDetalle = (tratamiento) => {
    setSeleccionado(tratamiento);
    setFormulario({ ...tratamiento });
    setModoEdicion(false);
    setModalAbierto(true);
  };

  const actualizarFormulario = (campo, valor) => {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  };

  const guardarTratamiento = (e) => {
    e.preventDefault();

    if (
      !formulario.dispositivo.trim() ||
      !formulario.nombreDispositivo.trim() ||
      !formulario.responsable.trim() ||
      !formulario.descripcion.trim()
    ) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    if (seleccionado && modoEdicion) {
      setTratamientos((actuales) =>
        actuales.map((tratamiento) =>
          tratamiento.id === seleccionado.id
            ? { ...tratamiento, ...formulario }
            : tratamiento
        )
      );
    } else {
      const nuevoTratamiento = {
        ...formulario,
        id: `TRA-${String(Date.now()).slice(-6)}`,
        estado: "Programado",
      };

      setTratamientos((actuales) => [
        nuevoTratamiento,
        ...actuales,
      ]);
    }

    setModalAbierto(false);
    setSeleccionado(null);
    setModoEdicion(false);
  };

  const actualizarEstado = (nuevoEstado) => {
    if (!seleccionado) return;

    if (
      nuevoEstado === "Completado" &&
      !formulario.resultado.trim()
    ) {
      alert("Registra el resultado antes de completar el tratamiento.");
      return;
    }

    const fechaFin =
      nuevoEstado === "Completado"
        ? new Date().toLocaleDateString("en-CA")
        : formulario.fechaFin;

    const actualizado = {
      ...formulario,
      estado: nuevoEstado,
      fechaFin,
    };

    setTratamientos((actuales) =>
      actuales.map((tratamiento) =>
        tratamiento.id === seleccionado.id
          ? actualizado
          : tratamiento
      )
    );

    setFormulario(actualizado);
    setSeleccionado(actualizado);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setSeleccionado(null);
    setModoEdicion(false);
  };

  return (
    <section className="dashboard treatments-page">
      <div className="treatments-heading">
        <div>
          <h1>Tratamientos</h1>
          <p>
            Gestiona los procedimientos aplicados a los dispositivos
            después de su evaluación técnica.
          </p>
        </div>

        <button className="treatment-add-button" onClick={abrirNuevo}>
          <Plus size={18} />
          Nuevo tratamiento
        </button>
      </div>

      <div className="treatments-stats">
        <div className="treatment-stat-card">
          <div className="treatment-stat-icon blue">
            <FlaskConical size={22} />
          </div>
          <div>
            <span>Total registrados</span>
            <strong>{estadisticas.total}</strong>
          </div>
        </div>

        <div className="treatment-stat-card">
          <div className="treatment-stat-icon orange">
            <CalendarDays size={22} />
          </div>
          <div>
            <span>Programados</span>
            <strong>{estadisticas.programados}</strong>
          </div>
        </div>

        <div className="treatment-stat-card">
          <div className="treatment-stat-icon purple">
            <Clock size={22} />
          </div>
          <div>
            <span>En proceso</span>
            <strong>{estadisticas.proceso}</strong>
          </div>
        </div>

        <div className="treatment-stat-card">
          <div className="treatment-stat-icon green">
            <CheckCircle size={22} />
          </div>
          <div>
            <span>Completados</span>
            <strong>{estadisticas.completados}</strong>
          </div>
        </div>
      </div>

      <div className="content-card treatments-content">
        <div className="treatments-toolbar">
          <div>
            <h3>Tratamientos registrados</h3>
            <p>Consulta y administra los procedimientos técnicos.</p>
          </div>

          <div className="treatments-filters">
            <div className="treatment-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar tratamiento..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Programado">Programados</option>
              <option value="En proceso">En proceso</option>
              <option value="Completado">Completados</option>
              <option value="Cancelado">Cancelados</option>
            </select>
          </div>
        </div>

        <div className="treatments-table-container">
          <table className="treatments-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Dispositivo</th>
                <th>Tipo de tratamiento</th>
                <th>Fecha de inicio</th>
                <th>Responsable</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {tratamientosFiltrados.map((tratamiento) => (
                <tr key={tratamiento.id}>
                  <td>
                    <strong>{tratamiento.id}</strong>
                  </td>
                  <td>
                    <div className="treatment-device-cell">
                      <strong>{tratamiento.nombreDispositivo}</strong>
                      <span>{tratamiento.dispositivo}</span>
                    </div>
                  </td>
                  <td>{tratamiento.tipo}</td>
                  <td>{tratamiento.fechaInicio}</td>
                  <td>{tratamiento.responsable}</td>
                  <td>
                    <span
                      className={`treatment-status ${tratamiento.estado
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {tratamiento.estado}
                    </span>
                  </td>
                  <td>
                    <button
                      className="treatment-view-button"
                      onClick={() => abrirDetalle(tratamiento)}
                    >
                      <Eye size={17} />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}

              {tratamientosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="7" className="treatments-empty">
                    No se encontraron tratamientos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalAbierto && (
        <div className="treatment-modal-overlay" onClick={cerrarModal}>
          <div
            className="treatment-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="treatment-modal-header">
              <div>
                <span>
                  {seleccionado
                    ? "Información del tratamiento"
                    : "Registro de tratamiento"}
                </span>
                <h2>
                  {seleccionado
                    ? seleccionado.id
                    : "Nuevo tratamiento"}
                </h2>
              </div>

              <button
                className="treatment-close-button"
                onClick={cerrarModal}
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={guardarTratamiento}>
              <div className="treatment-modal-body">
                <div className="treatment-form-grid">
                  <div className="treatment-form-field">
                    <label>Código del dispositivo *</label>
                    <input
                      value={formulario.dispositivo}
                      onChange={(e) =>
                        actualizarFormulario("dispositivo", e.target.value)
                      }
                      placeholder="Ej. DIS-004"
                      disabled={seleccionado && !modoEdicion}
                      required
                    />
                  </div>

                  <div className="treatment-form-field">
                    <label>Nombre del dispositivo *</label>
                    <input
                      value={formulario.nombreDispositivo}
                      onChange={(e) =>
                        actualizarFormulario(
                          "nombreDispositivo",
                          e.target.value
                        )
                      }
                      placeholder="Nombre del equipo"
                      disabled={seleccionado && !modoEdicion}
                      required
                    />
                  </div>

                  <div className="treatment-form-field">
                    <label>Categoría</label>
                    <input
                      value={formulario.categoria}
                      onChange={(e) =>
                        actualizarFormulario("categoria", e.target.value)
                      }
                      placeholder="Ej. Equipo informático"
                      disabled={seleccionado && !modoEdicion}
                    />
                  </div>

                  <div className="treatment-form-field">
                    <label>Tipo de tratamiento *</label>
                    <select
                      value={formulario.tipo}
                      onChange={(e) =>
                        actualizarFormulario("tipo", e.target.value)
                      }
                      disabled={seleccionado && !modoEdicion}
                    >
                      <option>Reparación</option>
                      <option>Reacondicionamiento</option>
                      <option>Recuperación de componentes</option>
                      <option>Reciclaje</option>
                      <option>Evaluación especializada</option>
                    </select>
                  </div>

                  <div className="treatment-form-field">
                    <label>Responsable *</label>
                    <input
                      value={formulario.responsable}
                      onChange={(e) =>
                        actualizarFormulario("responsable", e.target.value)
                      }
                      placeholder="Nombre del responsable"
                      disabled={seleccionado && !modoEdicion}
                      required
                    />
                  </div>

                  <div className="treatment-form-field">
                    <label>Fecha de inicio *</label>
                    <input
                      type="date"
                      value={formulario.fechaInicio}
                      onChange={(e) =>
                        actualizarFormulario("fechaInicio", e.target.value)
                      }
                      disabled={seleccionado && !modoEdicion}
                      required
                    />
                  </div>

                  <div className="treatment-form-field">
                    <label>Fecha de finalización</label>
                    <input
                      type="date"
                      value={formulario.fechaFin}
                      onChange={(e) =>
                        actualizarFormulario("fechaFin", e.target.value)
                      }
                      disabled={seleccionado && !modoEdicion}
                    />
                  </div>
                </div>

                <div className="treatment-form-field treatment-full-field">
                  <label>Descripción del procedimiento *</label>
                  <textarea
                    rows={3}
                    value={formulario.descripcion}
                    onChange={(e) =>
                      actualizarFormulario("descripcion", e.target.value)
                    }
                    placeholder="Describe el procedimiento que se aplicará..."
                    disabled={seleccionado && !modoEdicion}
                    required
                  />
                </div>

                <div className="treatment-form-field treatment-full-field">
                  <label>Resultado del tratamiento</label>
                  <textarea
                    rows={3}
                    value={formulario.resultado}
                    onChange={(e) =>
                      actualizarFormulario("resultado", e.target.value)
                    }
                    placeholder="Registra el resultado obtenido..."
                    disabled={seleccionado && !modoEdicion}
                  />
                </div>

                {seleccionado && (
                  <div className="treatment-current-status">
                    <span>Estado actual:</span>
                    <select
                      value={formulario.estado}
                      onChange={(e) => {
                        actualizarFormulario("estado", e.target.value);
                      }}
                      disabled={!modoEdicion}
                    >
                      <option>Programado</option>
                      <option>En proceso</option>
                      <option>Completado</option>
                      <option>Cancelado</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="treatment-modal-footer">
                {!seleccionado && (
                  <>
                    <button
                      type="button"
                      className="treatment-cancel-button"
                      onClick={cerrarModal}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="treatment-save-button"
                    >
                      <Save size={17} />
                      Registrar tratamiento
                    </button>
                  </>
                )}

                {seleccionado && !modoEdicion && (
                  <>
                    <button
                      type="button"
                      className="treatment-cancel-button"
                      onClick={cerrarModal}
                    >
                      Cerrar
                    </button>

                    <button
                      type="button"
                      className="treatment-save-button"
                      onClick={() => setModoEdicion(true)}
                    >
                      Editar tratamiento
                    </button>
                  </>
                )}

                {seleccionado && modoEdicion && (
                  <>
                    <button
                      type="button"
                      className="treatment-cancel-button"
                      onClick={() => {
                        setFormulario({ ...seleccionado });
                        setModoEdicion(false);
                      }}
                    >
                      Cancelar edición
                    </button>

                    <button
                      type="submit"
                      className="treatment-save-button"
                    >
                      <Save size={17} />
                      Guardar cambios
                    </button>
                  </>
                )}
              </div>
            </form>

            {seleccionado && !modoEdicion && (
              <div className="treatment-status-actions">
                <span>Actualizar estado del procedimiento</span>

                <div>
                  {seleccionado.estado === "Programado" && (
                    <button
                      onClick={() => actualizarEstado("En proceso")}
                    >
                      <Clock size={16} />
                      Iniciar
                    </button>
                  )}

                  {seleccionado.estado === "En proceso" && (
                    <button
                      onClick={() => {
                        setModoEdicion(true);
                      }}
                    >
                      <FileText size={16} />
                      Registrar resultado
                    </button>
                  )}

                  {(seleccionado.estado === "Programado" ||
                    seleccionado.estado === "En proceso") && (
                    <button
                      className="treatment-cancel-action"
                      onClick={() => actualizarEstado("Cancelado")}
                    >
                      <XCircle size={16} />
                      Cancelar procedimiento
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default Tratamientos;
