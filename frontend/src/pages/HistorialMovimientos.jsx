import { useMemo, useState } from "react";
import {
  History,
  Search,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  ClipboardCheck,
  FlaskConical,
  CheckCircle,
  Clock,
  Monitor,
  CalendarDays,
  Eye,
  X,
} from "lucide-react";

const movimientosIniciales = [
  {
    id: 1,
    codigo: "MOV-001",
    dispositivo: "DIS-001",
    nombre: "Laptop Dell Latitude",
    tipo: "Recepción",
    descripcion: "Recepción del dispositivo en el centro de acopio.",
    estadoAnterior: "No registrado",
    estadoNuevo: "Recibido",
    responsable: "Carlos Mendoza",
    centro: "Centro Norte",
    fecha: "2026-11-20",
    hora: "09:30",
  },
  {
    id: 2,
    codigo: "MOV-002",
    dispositivo: "DIS-001",
    nombre: "Laptop Dell Latitude",
    tipo: "Evaluación",
    descripcion: "Se realizó la inspección técnica del dispositivo.",
    estadoAnterior: "Recibido",
    estadoNuevo: "En evaluación",
    responsable: "Técnico asignado",
    centro: "Centro Norte",
    fecha: "2026-11-20",
    hora: "11:15",
  },
  {
    id: 3,
    codigo: "MOV-003",
    dispositivo: "DIS-002",
    nombre: "Monitor HP",
    tipo: "Tratamiento",
    descripcion: "El dispositivo ingresó al proceso de reparación.",
    estadoAnterior: "En evaluación",
    estadoNuevo: "En reparación",
    responsable: "Técnico asignado",
    centro: "Centro Sur",
    fecha: "2026-11-21",
    hora: "10:00",
  },
  {
    id: 4,
    codigo: "MOV-004",
    dispositivo: "DIS-003",
    nombre: "Teclado Logitech",
    tipo: "Transferencia",
    descripcion: "Transferencia del dispositivo hacia otro centro de acopio.",
    estadoAnterior: "En inventario",
    estadoNuevo: "Transferido",
    responsable: "Operador",
    centro: "Centro Norte → Centro Sur",
    fecha: "2026-11-22",
    hora: "08:45",
  },
  {
    id: 5,
    codigo: "MOV-005",
    dispositivo: "DIS-004",
    nombre: "Impresora Epson",
    tipo: "Salida",
    descripcion: "Salida del dispositivo para su destino final autorizado.",
    estadoAnterior: "En inventario",
    estadoNuevo: "Retirado",
    responsable: "Operador",
    centro: "Centro Norte",
    fecha: "2026-11-22",
    hora: "14:20",
  },
];

const iconosTipo = {
  Recepción: ArrowDownToLine,
  Evaluación: ClipboardCheck,
  Tratamiento: FlaskConical,
  Transferencia: ArrowLeftRight,
  Salida: ArrowUpFromLine,
};

function HistorialMovimientos() {
  const [movimientos] = useState(movimientosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState(null);

  const movimientosFiltrados = useMemo(() => {
    return movimientos.filter((movimiento) => {
      const coincideBusqueda = [
        movimiento.codigo,
        movimiento.dispositivo,
        movimiento.nombre,
        movimiento.responsable,
        movimiento.centro,
      ]
        .join(" ")
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      const coincideTipo =
        filtroTipo === "Todos" || movimiento.tipo === filtroTipo;

      return coincideBusqueda && coincideTipo;
    });
  }, [movimientos, busqueda, filtroTipo]);

  const totalMovimientos = movimientos.length;

  const tipos = [
    "Todos",
    "Recepción",
    "Evaluación",
    "Tratamiento",
    "Transferencia",
    "Salida",
  ];

  return (
    <section className="dashboard">
      <div className="page-header">
        <div>
          <h1>Historial de movimientos</h1>
          <p>
            Consulta la trazabilidad y los cambios registrados en los
            dispositivos RAEE.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <History size={24} />
          </div>
          <div>
            <h3>{totalMovimientos}</h3>
            <p>Movimientos registrados</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <ArrowDownToLine size={24} />
          </div>
          <div>
            <h3>
              {movimientos.filter((m) => m.tipo === "Recepción").length}
            </h3>
            <p>Recepciones</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <FlaskConical size={24} />
          </div>
          <div>
            <h3>
              {movimientos.filter((m) => m.tipo === "Tratamiento").length}
            </h3>
            <p>Tratamientos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <ArrowLeftRight size={24} />
          </div>
          <div>
            <h3>
              {movimientos.filter((m) => m.tipo === "Transferencia").length}
            </h3>
            <p>Transferencias</p>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="history-toolbar">
          <div>
            <h2>Registro de trazabilidad</h2>
            <p>Movimientos realizados en la plataforma.</p>
          </div>

          <div className="history-filters">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar dispositivo, código o responsable..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo === "Todos" ? "Todos los movimientos" : tipo}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Dispositivo</th>
                <th>Tipo de movimiento</th>
                <th>Cambio de estado</th>
                <th>Responsable</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {movimientosFiltrados.length > 0 ? (
                movimientosFiltrados.map((movimiento) => {
                  const Icono = iconosTipo[movimiento.tipo];

                  return (
                    <tr key={movimiento.id}>
                      <td>
                        <strong>{movimiento.codigo}</strong>
                      </td>

                      <td>
                        <div className="history-device">
                          <Monitor size={19} />
                          <div>
                            <strong>{movimiento.nombre}</strong>
                            <small>{movimiento.dispositivo}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="history-type">
                          <Icono size={16} />
                          {movimiento.tipo}
                        </span>
                      </td>

                      <td>
                        <div className="history-status">
                          <small>{movimiento.estadoAnterior}</small>
                          <strong>{movimiento.estadoNuevo}</strong>
                        </div>
                      </td>

                      <td>{movimiento.responsable}</td>

                      <td>
                        <div className="history-date">
                          <CalendarDays size={15} />
                          <span>{movimiento.fecha}</span>
                        </div>
                        <small>{movimiento.hora}</small>
                      </td>

                      <td>
                        <button
                          className="btn-icon"
                          title="Ver detalles"
                          onClick={() =>
                            setMovimientoSeleccionado(movimiento)
                          }
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No se encontraron movimientos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {movimientoSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h2>Detalle del movimiento</h2>
                <p>{movimientoSeleccionado.codigo}</p>
              </div>

              <button
                className="btn-icon"
                onClick={() => setMovimientoSeleccionado(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="history-detail">
              <div>
                <span>Dispositivo</span>
                <strong>{movimientoSeleccionado.nombre}</strong>
              </div>

              <div>
                <span>Código del dispositivo</span>
                <strong>{movimientoSeleccionado.dispositivo}</strong>
              </div>

              <div>
                <span>Tipo de movimiento</span>
                <strong>{movimientoSeleccionado.tipo}</strong>
              </div>

              <div>
                <span>Estado anterior</span>
                <strong>{movimientoSeleccionado.estadoAnterior}</strong>
              </div>

              <div>
                <span>Estado nuevo</span>
                <strong>{movimientoSeleccionado.estadoNuevo}</strong>
              </div>

              <div>
                <span>Responsable</span>
                <strong>{movimientoSeleccionado.responsable}</strong>
              </div>

              <div>
                <span>Centro de acopio</span>
                <strong>{movimientoSeleccionado.centro}</strong>
              </div>

              <div>
                <span>Fecha y hora</span>
                <strong>
                  {movimientoSeleccionado.fecha} -{" "}
                  {movimientoSeleccionado.hora}
                </strong>
              </div>

              <div className="history-description">
                <span>Descripción</span>
                <p>{movimientoSeleccionado.descripcion}</p>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => setMovimientoSeleccionado(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default HistorialMovimientos;