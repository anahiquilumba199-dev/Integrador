
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  Plus,
  Search,
  PackageCheck,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Paperclip,
  History,
  FileText,
  X,
  CheckCircle,
  CalendarDays,
  Eye,
  Filter,
  Package,
  ClipboardList,
  Building2,
  User,
  Clock,
  MapPin
} from "lucide-react";

const CONFIGURACION = {
  "/recepciones": {
    titulo: "Recepciones",
    descripcion: "Registro de dispositivos recibidos físicamente.",
    boton: "Registrar recepción",
    icono: PackageCheck,
    columnas: ["Código", "Dispositivo", "Cantidad", "Fecha", "Estado"],
    campos: [
      { nombre: "dispositivo", etiqueta: "Nombre del dispositivo", tipo: "text" },
      { nombre: "cantidad", etiqueta: "Cantidad recibida", tipo: "number" },
      { nombre: "entregadoPor", etiqueta: "Entregado por", tipo: "text" },
      { nombre: "fecha", etiqueta: "Fecha de recepción", tipo: "date" }
    ],
    datos: [
      ["REC-001", "Computadoras de escritorio", "10", "2026-11-20", "Recibido"],
      ["REC-002", "Monitores", "12", "2026-11-21", "Pendiente de revisión"],
      ["REC-003", "Impresoras", "6", "2026-11-22", "Recibido"]
    ]
  },

  "/ingresos": {
    titulo: "Ingresos",
    descripcion: "Control de entradas de dispositivos al centro de acopio.",
    boton: "Registrar ingreso",
    icono: ArrowDownToLine,
    columnas: ["Código", "Dispositivo", "Cantidad", "Fecha", "Responsable"],
    campos: [
      { nombre: "dispositivo", etiqueta: "Dispositivo", tipo: "text" },
      { nombre: "cantidad", etiqueta: "Cantidad", tipo: "number" },
      { nombre: "fecha", etiqueta: "Fecha de ingreso", tipo: "date" },
      { nombre: "responsable", etiqueta: "Responsable", tipo: "text" }
    ],
    datos: [
      ["ING-001", "Computadoras", "10", "2026-11-20", "Operador"],
      ["ING-002", "Monitores", "15", "2026-11-21", "Operador"],
      ["ING-003", "Impresoras", "8", "2026-11-22", "Operador"]
    ]
  },

  "/salidas": {
    titulo: "Salidas",
    descripcion: "Registro y control de salidas autorizadas de dispositivos.",
    boton: "Registrar salida",
    icono: ArrowUpFromLine,
    columnas: ["Código", "Dispositivo", "Cantidad", "Destino", "Fecha"],
    campos: [
      { nombre: "dispositivo", etiqueta: "Dispositivo", tipo: "text" },
      { nombre: "cantidad", etiqueta: "Cantidad", tipo: "number" },
      { nombre: "destino", etiqueta: "Destino", tipo: "text" },
      { nombre: "fecha", etiqueta: "Fecha de salida", tipo: "date" }
    ],
    datos: [
      ["SAL-001", "Monitores", "3", "Centro de tratamiento", "2026-11-20"],
      ["SAL-002", "Impresoras", "2", "Gestión autorizada", "2026-11-21"]
    ]
  },

  "/transferencias": {
    titulo: "Transferencias",
    descripcion: "Control de movimientos de dispositivos entre centros de acopio.",
    boton: "Registrar transferencia",
    icono: ArrowLeftRight,
    columnas: ["Código", "Dispositivo", "Cantidad", "Centro destino", "Estado"],
    campos: [
      { nombre: "dispositivo", etiqueta: "Dispositivo", tipo: "text" },
      { nombre: "cantidad", etiqueta: "Cantidad", tipo: "number" },
      { nombre: "centroDestino", etiqueta: "Centro de destino", tipo: "text" },
      { nombre: "fecha", etiqueta: "Fecha", tipo: "date" }
    ],
    datos: [
      ["TRA-001", "Computadoras", "5", "Centro Norte", "Registrada"],
      ["TRA-002", "Monitores", "4", "Centro Sur", "En proceso"]
    ]
  },

  "/evidencias": {
    titulo: "Evidencias",
    descripcion: "Consulta y registro de documentos de respaldo de las operaciones.",
    boton: "Registrar evidencia",
    icono: Paperclip,
    columnas: ["Código", "Operación", "Archivo", "Fecha", "Responsable"],
    campos: [
      { nombre: "operacion", etiqueta: "Tipo de operación", tipo: "text" },
      { nombre: "archivo", etiqueta: "Nombre del archivo", tipo: "text" },
      { nombre: "fecha", etiqueta: "Fecha", tipo: "date" },
      { nombre: "responsable", etiqueta: "Responsable", tipo: "text" }
    ],
    datos: [
      ["EVI-001", "Recepción", "recepcion_computadoras.jpg", "2026-11-20", "Operador"],
      ["EVI-002", "Transferencia", "transferencia_monitores.pdf", "2026-11-21", "Operador"]
    ]
  },

  "/historial-movimientos": {
    titulo: "Historial de movimientos",
    descripcion: "Consulta y seguimiento de las operaciones realizadas en los centros de acopio.",
    boton: null,
    icono: History,
    columnas: [
      "Código",
      "Tipo de movimiento",
      "Dispositivo",
      "Cantidad",
      "Centro de acopio",
      "Fecha",
      "Responsable",
      "Estado"
    ],
    campos: [],
    datos: [
      {
        codigo: "MOV-001",
        tipo: "Recepción",
        dispositivo: "Computadoras de escritorio",
        cantidad: 10,
        centro: "Centro Norte",
        fecha: "2026-11-20",
        responsable: "Operador",
        estado: "Completado",
        observacion: "Recepción física de equipos electrónicos.",
        destino: "Inventario del centro",
        referencia: "REC-001"
      },
      {
        codigo: "MOV-002",
        tipo: "Ingreso",
        dispositivo: "Monitores",
        cantidad: 15,
        centro: "Centro Norte",
        fecha: "2026-11-21",
        responsable: "Operador",
        estado: "Completado",
        observacion: "Ingreso de monitores al inventario.",
        destino: "Inventario del centro",
        referencia: "ING-002"
      },
      {
        codigo: "MOV-003",
        tipo: "Salida",
        dispositivo: "Impresoras",
        cantidad: 2,
        centro: "Centro Sur",
        fecha: "2026-11-21",
        responsable: "Operador",
        estado: "Autorizado",
        observacion: "Salida registrada con autorización.",
        destino: "Gestión autorizada",
        referencia: "SAL-002"
      },
      {
        codigo: "MOV-004",
        tipo: "Transferencia",
        dispositivo: "Computadoras",
        cantidad: 5,
        centro: "Centro Norte",
        fecha: "2026-11-22",
        responsable: "Operador",
        estado: "En proceso",
        observacion: "Transferencia entre centros de acopio.",
        destino: "Centro Sur",
        referencia: "TRA-001"
      },
      {
        codigo: "MOV-005",
        tipo: "Recepción",
        dispositivo: "Impresoras",
        cantidad: 6,
        centro: "Centro Sur",
        fecha: "2026-11-22",
        responsable: "Operador",
        estado: "Pendiente",
        observacion: "Recepción pendiente de revisión técnica.",
        destino: "Área de revisión",
        referencia: "REC-003"
      },
      {
        codigo: "MOV-006",
        tipo: "Ingreso",
        dispositivo: "Teclados",
        cantidad: 20,
        centro: "Centro Norte",
        fecha: "2026-11-22",
        responsable: "Operador",
        estado: "Completado",
        observacion: "Ingreso de periféricos al inventario.",
        destino: "Inventario del centro",
        referencia: "ING-003"
      }
    ]
  }
};

const ICONOS_MOVIMIENTO = {
  Recepción: PackageCheck,
  Ingreso: ArrowDownToLine,
  Salida: ArrowUpFromLine,
  Transferencia: ArrowLeftRight
};

function OperacionesOperador() {
  const { pathname } = useLocation();
  return <VistaOperaciones key={pathname} pathname={pathname} />;
}

function VistaOperaciones({ pathname }) {
  const configuracion = CONFIGURACION[pathname];

  const [registros, setRegistros] = useState(configuracion?.datos || []);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formulario, setFormulario] = useState({});
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState(null);

  const esHistorial = pathname === "/historial-movimientos";

  const historialFiltrado = useMemo(() => {
    if (!esHistorial) return [];

    return registros.filter((registro) => {
      const texto = [
        registro.codigo,
        registro.tipo,
        registro.dispositivo,
        registro.centro,
        registro.responsable,
        registro.estado,
        registro.referencia
      ].join(" ").toLowerCase();

      const coincideBusqueda = texto.includes(busqueda.toLowerCase());
      const coincideTipo = filtroTipo === "Todos" || registro.tipo === filtroTipo;
      const coincideInicio = !fechaInicio || registro.fecha >= fechaInicio;
      const coincideFin = !fechaFin || registro.fecha <= fechaFin;

      return coincideBusqueda && coincideTipo && coincideInicio && coincideFin;
    });
  }, [registros, busqueda, filtroTipo, fechaInicio, fechaFin, esHistorial]);

  const totalMovimientos = esHistorial ? registros.length : 0;

  const cantidadPorTipo = (tipo) =>
    registros.filter((registro) => registro.tipo === tipo).length;

  const cantidadTotal = esHistorial
    ? registros.reduce((total, registro) => total + Number(registro.cantidad || 0), 0)
    : 0;

  const Icono = configuracion?.icono;

  function actualizarCampo(nombre, valor) {
    setFormulario((anterior) => ({
      ...anterior,
      [nombre]: valor
    }));
  }

  function guardarRegistro(evento) {
    evento.preventDefault();

    const nuevoCodigo = `REG-${String(registros.length + 1).padStart(3, "0")}`;

    let nuevoRegistro;

    if (pathname === "/recepciones") {
      nuevoRegistro = [
        nuevoCodigo,
        formulario.dispositivo,
        formulario.cantidad,
        formulario.fecha,
        "Pendiente de revisión"
      ];
    } else if (pathname === "/ingresos") {
      nuevoRegistro = [
        nuevoCodigo,
        formulario.dispositivo,
        formulario.cantidad,
        formulario.fecha,
        formulario.responsable
      ];
    } else if (pathname === "/salidas") {
      nuevoRegistro = [
        nuevoCodigo,
        formulario.dispositivo,
        formulario.cantidad,
        formulario.destino,
        formulario.fecha
      ];
    } else if (pathname === "/transferencias") {
      nuevoRegistro = [
        nuevoCodigo,
        formulario.dispositivo,
        formulario.cantidad,
        formulario.centroDestino,
        "Registrada"
      ];
    } else {
      nuevoRegistro = [
        nuevoCodigo,
        formulario.operacion,
        formulario.archivo,
        formulario.fecha,
        formulario.responsable
      ];
    }

    setRegistros((anteriores) => [...anteriores, nuevoRegistro]);
    setFormulario({});
    setModalAbierto(false);
  }

  if (!configuracion) {
    return (
      <section className="dashboard">
        <h1>Sección no encontrada</h1>
        <p>No existe una configuración para esta sección.</p>
      </section>
    );
  }

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>{configuracion.titulo}</h1>
          <p>{configuracion.descripcion}</p>
        </div>
      </div>

      {esHistorial ? (
        <>
          <div className="history-stats">
            <div className="history-stat-card">
              <div className="history-stat-icon purple">
                <ClipboardList size={22} />
              </div>
              <div>
                <span>Total de movimientos</span>
                <strong>{totalMovimientos}</strong>
              </div>
            </div>

            <div className="history-stat-card">
              <div className="history-stat-icon blue">
                <PackageCheck size={22} />
              </div>
              <div>
                <span>Recepciones</span>
                <strong>{cantidadPorTipo("Recepción")}</strong>
              </div>
            </div>

            <div className="history-stat-card">
              <div className="history-stat-icon green">
                <ArrowDownToLine size={22} />
              </div>
              <div>
                <span>Ingresos</span>
                <strong>{cantidadPorTipo("Ingreso")}</strong>
              </div>
            </div>

            <div className="history-stat-card">
              <div className="history-stat-icon orange">
                <Package size={22} />
              </div>
              <div>
                <span>Unidades registradas</span>
                <strong>{cantidadTotal}</strong>
              </div>
            </div>
          </div>

          <div className="content-card history-card">
            <div className="history-heading">
              <div>
                <h2>Registro de operaciones</h2>
                <p>Consulta los movimientos registrados en los centros de acopio.</p>
              </div>
              <span className="history-counter">
                {historialFiltrado.length} resultados
              </span>
            </div>

            <div className="history-filters">
              <div className="operation-search history-search">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Buscar por código, dispositivo o centro..."
                  value={busqueda}
                  onChange={(evento) => setBusqueda(evento.target.value)}
                />
              </div>

              <label className="history-filter-control">
                <Filter size={17} />
                <select
                  value={filtroTipo}
                  onChange={(evento) => setFiltroTipo(evento.target.value)}
                >
                  <option value="Todos">Todos los movimientos</option>
                  <option value="Recepción">Recepciones</option>
                  <option value="Ingreso">Ingresos</option>
                  <option value="Salida">Salidas</option>
                  <option value="Transferencia">Transferencias</option>
                </select>
              </label>

              <label className="history-date-control">
                <CalendarDays size={17} />
                <input
                  type="date"
                  aria-label="Fecha inicial"
                  value={fechaInicio}
                  onChange={(evento) => setFechaInicio(evento.target.value)}
                />
              </label>

              <label className="history-date-control">
                <CalendarDays size={17} />
                <input
                  type="date"
                  aria-label="Fecha final"
                  min={fechaInicio || undefined}
                  value={fechaFin}
                  onChange={(evento) => setFechaFin(evento.target.value)}
                />
              </label>
            </div>

            <div className="history-filter-actions">
              <span>
                Mostrando {historialFiltrado.length} de {registros.length} movimientos
              </span>
              <button
                type="button"
                className="history-clear-button"
                onClick={() => {
                  setBusqueda("");
                  setFiltroTipo("Todos");
                  setFechaInicio("");
                  setFechaFin("");
                }}
              >
                Limpiar filtros
              </button>
            </div>

            <div className="operation-table-container">
              <table className="operation-table history-table">
                <thead>
                  <tr>
                    {configuracion.columnas.map((columna) => (
                      <th key={columna}>{columna}</th>
                    ))}
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {historialFiltrado.length > 0 ? (
                    historialFiltrado.map((registro) => {
                      const IconoMovimiento = ICONOS_MOVIMIENTO[registro.tipo] || Package;

                      return (
                        <tr key={registro.codigo}>
                          <td>
                            <strong className="history-code">{registro.codigo}</strong>
                          </td>
                          <td>
                            <span className="history-type">
                              <IconoMovimiento size={16} />
                              {registro.tipo}
                            </span>
                          </td>
                          <td>{registro.dispositivo}</td>
                          <td>{registro.cantidad}</td>
                          <td>{registro.centro}</td>
                          <td>{registro.fecha}</td>
                          <td>{registro.responsable}</td>
                          <td>
                            <span className={`history-status ${registro.estado.toLowerCase().replaceAll(" ", "-")}`}>
                              {registro.estado}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="history-detail-button"
                              onClick={() => setMovimientoSeleccionado(registro)}
                              title="Ver detalles"
                            >
                              <Eye size={17} />
                              Detalle
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="history-empty">
                        <Search size={28} />
                        <strong>No se encontraron movimientos</strong>
                        <span>Prueba cambiando los filtros de búsqueda.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="history-footer">
              <History size={17} />
              <span>
                El historial es de consulta. Los movimientos se generan desde
                las secciones operativas correspondientes.
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="content-card">
          <div className="operation-toolbar">
            <div className="operation-title">
              <div className="activity-icon">
                <Icono size={23} />
              </div>
              <div>
                <h2>{configuracion.titulo}</h2>
                <p>{registros.length} registros disponibles</p>
              </div>
            </div>

            {configuracion.boton && (
              <button
                className="primary-button"
                onClick={() => setModalAbierto(true)}
              >
                <Plus size={18} />
                {configuracion.boton}
              </button>
            )}
          </div>

          <div className="operation-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar registros..."
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </div>

          <div className="operation-table-container">
            <table className="operation-table">
              <thead>
                <tr>
                  {configuracion.columnas.map((columna) => (
                    <th key={columna}>{columna}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {registros.filter((registro) =>
                  registro.join(" ").toLowerCase().includes(busqueda.toLowerCase())
                ).length > 0 ? (
                  registros
                    .filter((registro) =>
                      registro.join(" ").toLowerCase().includes(busqueda.toLowerCase())
                    )
                    .map((registro, indice) => (
                      <tr key={`${registro[0]}-${indice}`}>
                        {registro.map((dato, posicion) => (
                          <td key={posicion}>{dato}</td>
                        ))}
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={configuracion.columnas.length}>
                      No se encontraron registros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalAbierto && (
        <div className="operation-modal-overlay">
          <div className="operation-modal">
            <div className="operation-modal-header">
              <div>
                <h2>{configuracion.boton}</h2>
                <p>Completa la información de la operación.</p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() => setModalAbierto(false)}
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={guardarRegistro}>
              <div className="operation-form-grid">
                {configuracion.campos.map((campo) => (
                  <label key={campo.nombre}>
                    <span>{campo.etiqueta}</span>
                    <input
                      type={campo.tipo}
                      min={campo.tipo === "number" ? "1" : undefined}
                      required
                      value={formulario[campo.nombre] || ""}
                      onChange={(evento) =>
                        actualizarCampo(campo.nombre, evento.target.value)
                      }
                    />
                  </label>
                ))}
              </div>

              <div className="operation-form-note">
                <FileText size={17} />
                <span>
                  Este registro es una demostración local. Todavía no se
                  guarda en la base de datos.
                </span>
              </div>

              <div className="operation-modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setModalAbierto(false)}
                >
                  Cancelar
                </button>

                <button type="submit" className="primary-button">
                  <CheckCircle size={18} />
                  Guardar registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {movimientoSeleccionado && (
        <div
          className="operation-modal-overlay"
          onClick={() => setMovimientoSeleccionado(null)}
        >
          <div
            className="operation-modal history-detail-modal"
            onClick={(evento) => evento.stopPropagation()}
          >
            <div className="operation-modal-header">
              <div>
                <h2>Detalle del movimiento</h2>
                <p>Información completa de la operación registrada.</p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() => setMovimientoSeleccionado(null)}
              >
                <X size={21} />
              </button>
            </div>

            <div className="history-detail-code">
              <div className="activity-icon">
                <History size={23} />
              </div>
              <div>
                <strong>{movimientoSeleccionado.codigo}</strong>
                <span>{movimientoSeleccionado.tipo}</span>
              </div>
              <span className={`history-status ${movimientoSeleccionado.estado.toLowerCase().replaceAll(" ", "-")}`}>
                {movimientoSeleccionado.estado}
              </span>
            </div>

            <div className="history-detail-grid">
              <div>
                <span><Package size={16} /> Dispositivo</span>
                <strong>{movimientoSeleccionado.dispositivo}</strong>
              </div>
              <div>
                <span><ClipboardList size={16} /> Cantidad</span>
                <strong>{movimientoSeleccionado.cantidad} unidades</strong>
              </div>
              <div>
                <span><Building2 size={16} /> Centro de acopio</span>
                <strong>{movimientoSeleccionado.centro}</strong>
              </div>
              <div>
                <span><CalendarDays size={16} /> Fecha</span>
                <strong>{movimientoSeleccionado.fecha}</strong>
              </div>
              <div>
                <span><User size={16} /> Responsable</span>
                <strong>{movimientoSeleccionado.responsable}</strong>
              </div>
              <div>
                <span><MapPin size={16} /> Destino</span>
                <strong>{movimientoSeleccionado.destino}</strong>
              </div>
              <div>
                <span><FileText size={16} /> Referencia</span>
                <strong>{movimientoSeleccionado.referencia}</strong>
              </div>
              <div>
                <span><Clock size={16} /> Tipo de registro</span>
                <strong>Movimiento operativo</strong>
              </div>
            </div>

            <div className="history-observation">
              <strong>Observaciones</strong>
              <p>{movimientoSeleccionado.observacion}</p>
            </div>

            <div className="operation-modal-actions">
              <button
                type="button"
                className="primary-button"
                onClick={() => setMovimientoSeleccionado(null)}
              >
                Cerrar detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default OperacionesOperador;
