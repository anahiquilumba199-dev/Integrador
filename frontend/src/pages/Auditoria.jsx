
import { useMemo, useState } from "react";
import {
  ShieldCheck,
  Search,
  Eye,
  X,
  User,
  CalendarDays,
  ClipboardList,
  Monitor,
  Users,
  Package,
  FileText,
  Filter,
} from "lucide-react";

const STORAGE_KEY = "ecoraee_auditoria_demo";

const registrosIniciales = [
  {
    id: 1,
    codigo: "AUD-001",
    usuario: "Administrador",
    rol: "ADMINISTRADOR",
    accion: "Inicio de sesión",
    modulo: "Autenticación",
    descripcion: "El administrador ingresó a la plataforma.",
    fecha: "2026-11-22",
    hora: "08:30",
    resultado: "Exitoso",
  },
  {
    id: 2,
    codigo: "AUD-002",
    usuario: "Administrador",
    rol: "ADMINISTRADOR",
    accion: "Creación de usuario",
    modulo: "Usuarios",
    descripcion: "Se registró una nueva cuenta de técnico.",
    fecha: "2026-11-22",
    hora: "09:15",
    resultado: "Exitoso",
  },
  {
    id: 3,
    codigo: "AUD-003",
    usuario: "Carlos Mendoza",
    rol: "TECNICO",
    accion: "Actualización de dispositivo",
    modulo: "Dispositivos",
    descripcion: "Se actualizaron los datos técnicos de DIS-001.",
    fecha: "2026-11-22",
    hora: "10:20",
    resultado: "Exitoso",
  },
  {
    id: 4,
    codigo: "AUD-004",
    usuario: "María López",
    rol: "OPERADOR",
    accion: "Registro de recepción",
    modulo: "Recepciones",
    descripcion: "Se registró la recepción de un dispositivo en Centro Norte.",
    fecha: "2026-11-22",
    hora: "11:45",
    resultado: "Exitoso",
  },
  {
    id: 5,
    codigo: "AUD-005",
    usuario: "Carlos Mendoza",
    rol: "TECNICO",
    accion: "Evaluación técnica",
    modulo: "Evaluaciones",
    descripcion: "Se registró el resultado de la evaluación de DIS-002.",
    fecha: "2026-11-22",
    hora: "14:10",
    resultado: "Exitoso",
  },
  {
    id: 6,
    codigo: "AUD-006",
    usuario: "Administrador",
    rol: "ADMINISTRADOR",
    accion: "Cierre de sesión",
    modulo: "Autenticación",
    descripcion: "El administrador cerró su sesión.",
    fecha: "2026-11-22",
    hora: "16:30",
    resultado: "Exitoso",
  },
];

function obtenerRegistrosIniciales() {
  try {
    const guardados = localStorage.getItem(STORAGE_KEY);
    return guardados ? JSON.parse(guardados) : registrosIniciales;
  } catch {
    return registrosIniciales;
  }
}

function iconoModulo(modulo) {
  const iconos = {
    Autenticación: ShieldCheck,
    Usuarios: Users,
    Dispositivos: Monitor,
    Recepciones: Package,
    Evaluaciones: ClipboardList,
  };

  return iconos[modulo] || FileText;
}

function Auditoria() {
  const [registros] = useState(obtenerRegistrosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("Todos");
  const [filtroModulo, setFiltroModulo] = useState("Todos");
  const [filtroResultado, setFiltroResultado] = useState("Todos");
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);

  const registrosFiltrados = useMemo(() => {
    return registros.filter((registro) => {
      const texto = [
        registro.codigo,
        registro.usuario,
        registro.accion,
        registro.modulo,
        registro.descripcion,
      ]
        .join(" ")
        .toLowerCase();

      const coincideBusqueda = texto.includes(busqueda.toLowerCase());
      const coincideRol =
        filtroRol === "Todos" || registro.rol === filtroRol;
      const coincideModulo =
        filtroModulo === "Todos" || registro.modulo === filtroModulo;
      const coincideResultado =
        filtroResultado === "Todos" ||
        registro.resultado === filtroResultado;

      return (
        coincideBusqueda &&
        coincideRol &&
        coincideModulo &&
        coincideResultado
      );
    });
  }, [registros, busqueda, filtroRol, filtroModulo, filtroResultado]);

  const totalRegistros = registros.length;
  const totalAdministradores = registros.filter(
    (r) => r.rol === "ADMINISTRADOR"
  ).length;
  const totalTecnicos = registros.filter(
    (r) => r.rol === "TECNICO"
  ).length;
  const totalOperadores = registros.filter(
    (r) => r.rol === "OPERADOR"
  ).length;

  return (
    <section className="dashboard">
      <div className="page-header">
        <div>
          <h1>Auditoría del sistema</h1>
          <p>
            Consulta las acciones realizadas por los usuarios en EcoRAEE Cloud.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3>{totalRegistros}</h3>
            <p>Registros de auditoría</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <User size={24} />
          </div>
          <div>
            <h3>{totalAdministradores}</h3>
            <p>Acciones de administradores</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <ClipboardList size={24} />
          </div>
          <div>
            <h3>{totalTecnicos}</h3>
            <p>Acciones de técnicos</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Package size={24} />
          </div>
          <div>
            <h3>{totalOperadores}</h3>
            <p>Acciones de operadores</p>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="audit-toolbar">
          <div>
            <h2>Bitácora de actividades</h2>
            <p>Registro de operaciones realizadas en la plataforma.</p>
          </div>

          <span className="audit-readonly">
            <ShieldCheck size={15} />
            Solo consulta
          </span>
        </div>

        <div className="audit-search">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar por usuario, código o acción..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="audit-filters">
          <div>
            <Filter size={16} />
            <span>Filtros:</span>
          </div>

          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
          >
            <option value="Todos">Todos los roles</option>
            <option value="ADMINISTRADOR">Administrador</option>
            <option value="TECNICO">Técnico</option>
            <option value="OPERADOR">Operador</option>
          </select>

          <select
            value={filtroModulo}
            onChange={(e) => setFiltroModulo(e.target.value)}
          >
            <option value="Todos">Todos los módulos</option>
            <option value="Autenticación">Autenticación</option>
            <option value="Usuarios">Usuarios</option>
            <option value="Dispositivos">Dispositivos</option>
            <option value="Recepciones">Recepciones</option>
            <option value="Evaluaciones">Evaluaciones</option>
          </select>

          <select
            value={filtroResultado}
            onChange={(e) => setFiltroResultado(e.target.value)}
          >
            <option value="Todos">Todos los resultados</option>
            <option value="Exitoso">Exitoso</option>
            <option value="Fallido">Fallido</option>
          </select>
        </div>

        <div className="audit-results">
          Mostrando <strong>{registrosFiltrados.length}</strong> de{" "}
          <strong>{totalRegistros}</strong> registros.
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Módulo</th>
                <th>Resultado</th>
                <th>Fecha y hora</th>
                <th>Detalle</th>
              </tr>
            </thead>

            <tbody>
              {registrosFiltrados.length > 0 ? (
                registrosFiltrados.map((registro) => {
                  const Icono = iconoModulo(registro.modulo);

                  return (
                    <tr key={registro.id}>
                      <td>
                        <strong>{registro.codigo}</strong>
                      </td>

                      <td>
                        <div className="audit-user">
                          <User size={17} />
                          <div>
                            <strong>{registro.usuario}</strong>
                            <small>{registro.rol}</small>
                          </div>
                        </div>
                      </td>

                      <td>{registro.accion}</td>

                      <td>
                        <span className="audit-module">
                          <Icono size={15} />
                          {registro.modulo}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`audit-result ${
                            registro.resultado === "Exitoso"
                              ? "success"
                              : "failed"
                          }`}
                        >
                          {registro.resultado}
                        </span>
                      </td>

                      <td>
                        <div className="audit-date">
                          <CalendarDays size={15} />
                          {registro.fecha}
                        </div>
                        <small>{registro.hora}</small>
                      </td>

                      <td>
                        <button
                          className="btn-icon"
                          title="Ver detalle"
                          onClick={() =>
                            setRegistroSeleccionado(registro)
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
                    No se encontraron registros de auditoría.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {registroSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h2>Detalle de auditoría</h2>
                <p>{registroSeleccionado.codigo}</p>
              </div>

              <button
                className="btn-icon"
                onClick={() => setRegistroSeleccionado(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="audit-detail">
              <div>
                <span>Usuario</span>
                <strong>{registroSeleccionado.usuario}</strong>
              </div>

              <div>
                <span>Rol</span>
                <strong>{registroSeleccionado.rol}</strong>
              </div>

              <div>
                <span>Acción realizada</span>
                <strong>{registroSeleccionado.accion}</strong>
              </div>

              <div>
                <span>Módulo</span>
                <strong>{registroSeleccionado.modulo}</strong>
              </div>

              <div>
                <span>Fecha y hora</span>
                <strong>
                  {registroSeleccionado.fecha} - {registroSeleccionado.hora}
                </strong>
              </div>

              <div>
                <span>Resultado</span>
                <strong>{registroSeleccionado.resultado}</strong>
              </div>

              <div className="audit-description">
                <span>Descripción de la actividad</span>
                <p>{registroSeleccionado.descripcion}</p>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => setRegistroSeleccionado(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="audit-notice">
        <ShieldCheck size={19} />
        <p>
          La bitácora es de consulta. En la versión conectada, los registros
          serán generados por el backend y no podrán modificarse desde esta
          pantalla.
        </p>
      </div>
    </section>
  );
}

export default Auditoria;
