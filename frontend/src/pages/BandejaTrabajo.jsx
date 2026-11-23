
import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Search,
  Eye,
  CheckCircle,
  Clock,
  Play,
  X,
  Monitor,
  FileText,
  AlertCircle,
  Pause,
  Save,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Wrench,
  ClipboardCheck,
  Camera,
  RotateCcw
} from "lucide-react";

const STORAGE_KEY = "ecoraee_tareas_tecnico_v2";
const NEW_TASKS_KEY = "ecoraee_tareas_nuevas_v1";

const tareasIniciales = [
  {
    id: 1,
    codigo: "TAR-001",
    dispositivo: "Computadora de escritorio",
    codigoDispositivo: "DIS-001",
    actividad: "Validación técnica",
    centro: "Centro Norte",
    origen: "Administrador",
    responsable: "Administrador",
    fecha: "2026-11-22",
    prioridad: "Alta",
    estado: "Pendiente",
    etapa: 0,
    descripcion: "Verificar la información y las condiciones generales del dispositivo.",
    observaciones: "Registro generado por administración.",
    inspeccion: { condicion: "", descripcion: "" },
    componentes: [],
    diagnostico: {
      observaciones: "",
      resultado: "",
      recomendacion: "",
      justificacion: "",
      evidencias: ""
    }
  },
  {
    id: 2,
    codigo: "TAR-002",
    dispositivo: "Monitor LED",
    codigoDispositivo: "DIS-002",
    actividad: "Evaluación técnica",
    centro: "Centro Sur",
    origen: "Operador",
    responsable: "Operador",
    fecha: "2026-11-22",
    prioridad: "Media",
    estado: "Aceptada",
    etapa: 0,
    descripcion: "Realizar la evaluación del estado físico y funcional del equipo.",
    observaciones: "Dispositivo recibido en el centro de acopio.",
    inspeccion: { condicion: "", descripcion: "" },
    componentes: [],
    diagnostico: {
      observaciones: "",
      resultado: "",
      recomendacion: "",
      justificacion: "",
      evidencias: ""
    }
  },
  {
    id: 3,
    codigo: "TAR-003",
    dispositivo: "Impresora",
    codigoDispositivo: "DIS-003",
    actividad: "Revisión de información",
    centro: "Centro Norte",
    origen: "Operador",
    responsable: "Operador",
    fecha: "2026-11-21",
    prioridad: "Media",
    estado: "En proceso",
    etapa: 1,
    descripcion: "Comprobar los datos registrados y completar la validación.",
    observaciones: "Pendiente de revisión técnica.",
    inspeccion: { condicion: "", descripcion: "" },
    componentes: [],
    diagnostico: {
      observaciones: "",
      resultado: "",
      recomendacion: "",
      justificacion: "",
      evidencias: ""
    }
  },
  {
    id: 4,
    codigo: "TAR-004",
    dispositivo: "Laptop",
    codigoDispositivo: "DIS-004",
    actividad: "Evaluación técnica",
    centro: "Centro Sur",
    origen: "Administrador",
    responsable: "Administrador",
    fecha: "2026-11-20",
    prioridad: "Baja",
    estado: "Completada",
    etapa: 3,
    descripcion: "Evaluación técnica finalizada.",
    observaciones: "Equipo evaluado correctamente.",
    inspeccion: {
      condicion: "Regular",
      descripcion: "Registro demostrativo."
    },
    componentes: [
      { id: 1, nombre: "Pantalla", estado: "Bueno", dano: "Ninguno" }
    ],
    diagnostico: {
      observaciones: "Evaluación demostrativa.",
      resultado: "Equipo revisado.",
      recomendacion: "Reacondicionamiento",
      justificacion: "Registro de ejemplo.",
      evidencias: ""
    }
  },
  {
    id: 5,
    codigo: "TAR-005",
    dispositivo: "Teclado",
    codigoDispositivo: "DIS-005",
    actividad: "Validación técnica",
    centro: "Centro Norte",
    origen: "Operador",
    responsable: "Operador",
    fecha: "2026-11-22",
    prioridad: "Alta",
    estado: "Pendiente",
    etapa: 0,
    descripcion: "Verificar la información del equipo recibido.",
    observaciones: "Requiere validación de los datos.",
    inspeccion: { condicion: "", descripcion: "" },
    componentes: [],
    diagnostico: {
      observaciones: "",
      resultado: "",
      recomendacion: "",
      justificacion: "",
      evidencias: ""
    }
  }
];

const pasos = [
  { titulo: "Inspección inicial", icono: ClipboardCheck },
  { titulo: "Componentes", icono: Wrench },
  { titulo: "Diagnóstico", icono: FileText },
  { titulo: "Revisión final", icono: CheckCircle }
];

function crearDiagnostico() {
  return {
    observaciones: "",
    resultado: "",
    recomendacion: "",
    justificacion: "",
    evidencias: ""
  };
}

function prepararTarea(tarea) {
  return {
    ...tarea,
    etapa: tarea.etapa ?? 0,
    inspeccion: tarea.inspeccion || {
      condicion: "",
      descripcion: ""
    },
    componentes: tarea.componentes || [],
    diagnostico: tarea.diagnostico || crearDiagnostico()
  };
}

function cargarTareas() {
  let tareasGuardadas;
  let tareasNuevas = [];

  try {
    const guardadas = localStorage.getItem(STORAGE_KEY);

    tareasGuardadas = guardadas
      ? JSON.parse(guardadas).map(prepararTarea)
      : tareasIniciales.map(prepararTarea);
  } catch (error) {
    console.error("No se pudieron recuperar las tareas:", error);
    tareasGuardadas = tareasIniciales.map(prepararTarea);
  }

  try {
    tareasNuevas = JSON.parse(
      localStorage.getItem(NEW_TASKS_KEY) || "[]"
    ).map(prepararTarea);
  } catch (error) {
    console.error("No se pudieron recuperar las nuevas tareas:", error);
  }

  const idsExistentes = new Set(
    tareasGuardadas.map((tarea) => String(tarea.id))
  );

  return [
    ...tareasGuardadas,
    ...tareasNuevas.filter(
      (tarea) => !idsExistentes.has(String(tarea.id))
    )
  ];
}

function BandejaTrabajo() {
  const [tareas, setTareas] = useState(cargarTareas);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [tareaSeleccionadaId, setTareaSeleccionadaId] = useState(null);

  const [nuevoComponente, setNuevoComponente] = useState({
    nombre: "",
    estado: "Bueno",
    dano: ""
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
      localStorage.removeItem(NEW_TASKS_KEY);
    } catch (error) {
      console.error("No se pudieron guardar las tareas:", error);
    }
  }, [tareas]);

  const tareaActiva = tareas.find(
    (tarea) => tarea.id === tareaSeleccionadaId
  );

  const tareasFiltradas = useMemo(() => {
    return tareas.filter((tarea) => {
      const texto = busqueda.toLowerCase();

      const coincideBusqueda =
        tarea.codigo.toLowerCase().includes(texto) ||
        tarea.dispositivo.toLowerCase().includes(texto) ||
        tarea.codigoDispositivo.toLowerCase().includes(texto);

      const coincideEstado =
        filtroEstado === "Todos" ||
        (filtroEstado === "En proceso"
          ? ["En proceso", "Pausada"].includes(tarea.estado)
          : tarea.estado === filtroEstado);

      return coincideBusqueda && coincideEstado;
    });
  }, [tareas, busqueda, filtroEstado]);

  function obtenerProgreso(tarea) {
    let completados = 0;

    if (
      tarea.inspeccion?.condicion &&
      tarea.inspeccion?.descripcion?.trim()
    ) completados++;

    if (tarea.componentes?.length > 0) completados++;

    if (
      tarea.diagnostico?.observaciones?.trim() &&
      tarea.diagnostico?.resultado?.trim() &&
      tarea.diagnostico?.recomendacion &&
      tarea.diagnostico?.justificacion?.trim()
    ) completados++;

    if (tarea.estado === "Completada") completados = 4;

    return Math.round((completados / 4) * 100);
  }

  const estadisticas = [
    {
      titulo: "Total de tareas",
      valor: tareas.length,
      icono: ClipboardList,
      color: "blue"
    },
    {
      titulo: "Pendientes",
      valor: tareas.filter((t) => t.estado === "Pendiente").length,
      icono: Clock,
      color: "orange"
    },
    {
      titulo: "En proceso",
      valor: tareas.filter((t) =>
        ["En proceso", "Pausada"].includes(t.estado)
      ).length,
      icono: Play,
      color: "purple"
    },
    {
      titulo: "Completadas",
      valor: tareas.filter((t) => t.estado === "Completada").length,
      icono: CheckCircle,
      color: "green"
    }
  ];

  function actualizarTarea(id, cambios) {
    setTareas((actuales) =>
      actuales.map((tarea) =>
        tarea.id === id ? { ...tarea, ...cambios } : tarea
      )
    );
  }

  function aceptarTarea(tarea) {
    actualizarTarea(tarea.id, { estado: "Aceptada" });
  }

  function iniciarTarea(tarea) {
    actualizarTarea(tarea.id, { estado: "En proceso" });
  }

  function pausarTarea(tarea) {
    actualizarTarea(tarea.id, { estado: "Pausada" });
    setTareaSeleccionadaId(null);
  }

  function reanudarTarea(tarea) {
    actualizarTarea(tarea.id, { estado: "En proceso" });
  }

  function actualizarCampo(campo, valor) {
    if (!tareaActiva) return;

    actualizarTarea(tareaActiva.id, {
      [campo]: {
        ...tareaActiva[campo],
        ...valor
      }
    });
  }

  function cambiarEtapa(etapa) {
    if (!tareaActiva) return;
    actualizarTarea(tareaActiva.id, { etapa });
  }

  function agregarComponente() {
    if (!tareaActiva || !nuevoComponente.nombre.trim()) return;

    const componente = {
      id: crypto.randomUUID(),
      nombre: nuevoComponente.nombre.trim(),
      estado: nuevoComponente.estado,
      dano: nuevoComponente.dano.trim() || "No especificado"
    };

    actualizarTarea(tareaActiva.id, {
      componentes: [...tareaActiva.componentes, componente]
    });

    setNuevoComponente({
      nombre: "",
      estado: "Bueno",
      dano: ""
    });
  }

  function eliminarComponente(id) {
    if (!tareaActiva) return;

    actualizarTarea(tareaActiva.id, {
      componentes: tareaActiva.componentes.filter(
        (componente) => componente.id !== id
      )
    });
  }

  function etapaValida(etapa) {
    if (!tareaActiva) return false;

    if (etapa === 0) {
      return Boolean(
        tareaActiva.inspeccion.condicion &&
        tareaActiva.inspeccion.descripcion.trim()
      );
    }

    if (etapa === 1) {
      return tareaActiva.componentes.length > 0;
    }

    if (etapa === 2) {
      const d = tareaActiva.diagnostico;

      return Boolean(
        d.observaciones.trim() &&
        d.resultado.trim() &&
        d.recomendacion &&
        d.justificacion.trim()
      );
    }

    return true;
  }

  function siguienteEtapa() {
    if (!tareaActiva || !etapaValida(tareaActiva.etapa)) return;

    if (tareaActiva.etapa < 3) {
      cambiarEtapa(tareaActiva.etapa + 1);
    }
  }

  function finalizarTarea() {
    if (!tareaActiva) return;

    const etapasValidas =
      etapaValida(0) &&
      etapaValida(1) &&
      etapaValida(2);

    if (!etapasValidas) return;

    actualizarTarea(tareaActiva.id, {
      estado: "Completada",
      etapa: 3
    });

    setTareaSeleccionadaId(null);
  }

  function claseEstado(estado) {
    const clases = {
      Pendiente: "pending",
      Aceptada: "accepted",
      "En proceso": "processing",
      Pausada: "paused",
      Completada: "completed",
      Devuelta: "returned"
    };

    return clases[estado] || "";
  }

  function abrirTarea(tarea) {
    setTareaSeleccionadaId(tarea.id);
  }

  function etiquetaEstado(estado) {
    return estado === "Pausada"
      ? "En proceso · Pausada"
      : estado;
  }

  return (
    <main className="dashboard">
      <header className="page-heading">
        <section>
          <h1>Mi bandeja de trabajo</h1>
          <p>
            Gestiona las tareas asignadas y realiza el diagnóstico
            técnico de cada dispositivo.
          </p>
        </section>
      </header>

      {/* ESTADÍSTICAS */}

      <section className="stats-grid" aria-label="Resumen de tareas">
        {estadisticas.map((item) => {
          const Icon = item.icono;

          return (
            <article className="stat-card" key={item.titulo}>
              <header className="stat-top">
                <section>
                  <p>{item.titulo}</p>
                  <h2>{item.valor}</h2>
                </section>

                <span className={`stat-icon technician-${item.color}`}>
                  <Icon size={24} />
                </span>
              </header>

              <small>Resumen de actividades</small>
            </article>
          );
        })}
      </section>

      {/* TABLA DE TAREAS */}

      <section className="content-card">
        <header className="technician-section-header">
          <section>
            <h3>Tareas asignadas</h3>
            <p>
              Abre una tarea para comenzar o continuar su diagnóstico.
            </p>
          </section>
        </header>

        <form className="task-toolbar" onSubmit={(e) => e.preventDefault()}>
          <label className="task-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Buscar por código o dispositivo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar tareas"
            />
          </label>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            aria-label="Filtrar por estado"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Aceptada">Aceptadas</option>
            <option value="En proceso">En proceso</option>
            <option value="Completada">Completadas</option>
            <option value="Devuelta">Devueltas</option>
          </select>
        </form>

        <section className="technician-table-container">
          <table className="technician-table task-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Dispositivo</th>
                <th>Centro</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Progreso</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {tareasFiltradas.map((tarea) => (
                <tr key={tarea.id}>
                  <td><strong>{tarea.codigo}</strong></td>
                  <td>{tarea.dispositivo}</td>
                  <td>{tarea.centro}</td>
                  <td>
                    <span className={`task-priority ${tarea.prioridad.toLowerCase()}`}>
                      {tarea.prioridad}
                    </span>
                  </td>
                  <td>
                    <span className={`technician-status ${claseEstado(tarea.estado)}`}>
                      {etiquetaEstado(tarea.estado)}
                    </span>
                  </td>
                  <td>
                    <section className="task-progress-cell">
                      <strong>{obtenerProgreso(tarea)}%</strong>
                      <span className="task-progress-track">
                        <span
                          className="task-progress-fill"
                          style={{ width: `${obtenerProgreso(tarea)}%` }}
                        />
                      </span>
                    </section>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="task-detail-button"
                      onClick={() => abrirTarea(tarea)}
                      title="Abrir tarea"
                      aria-label={`Abrir tarea ${tarea.codigo}`}
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {tareasFiltradas.length === 0 && (
            <section className="history-empty">
              <Search size={30} />
              <p>No se encontraron tareas.</p>
            </section>
          )}
        </section>

        <footer className="technician-demo-note">
          <AlertCircle size={16} />
          Información demostrativa. Los avances se guardan localmente en este navegador.
        </footer>
      </section>

      {/* MODAL */}

      {tareaActiva && (
        <section
          className="task-modal-overlay diagnostic-overlay"
          onClick={() => setTareaSeleccionadaId(null)}
          role="presentation"
        >
          <article
            className="task-modal diagnostic-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="diagnostic-title"
          >
            <header className="task-modal-header">
              <section>
                <h2 id="diagnostic-title">Diagnóstico técnico</h2>
                <p>
                  {tareaActiva.codigo} · {tareaActiva.codigoDispositivo}
                </p>
              </section>

              <button
                type="button"
                className="task-close-button"
                onClick={() => setTareaSeleccionadaId(null)}
                title="Cerrar"
                aria-label="Cerrar diagnóstico"
              >
                <X size={21} />
              </button>
            </header>

            <section className="diagnostic-device-info">
              <section>
                <Monitor size={20} />
                <span>
                  <strong>{tareaActiva.dispositivo}</strong>
                  <small>{tareaActiva.centro}</small>
                </span>
              </section>

              <span className={`technician-status ${claseEstado(tareaActiva.estado)}`}>
                {etiquetaEstado(tareaActiva.estado)}
              </span>
            </section>

            {/* TAREA PENDIENTE */}

            {tareaActiva.estado === "Pendiente" && (
              <section className="diagnostic-start">
                <ClipboardList size={38} />
                <h3>Tienes una nueva tarea asignada</h3>
                <p>
                  Revisa la información del dispositivo y acepta la tarea
                  para comenzar su diagnóstico técnico.
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() => aceptarTarea(tareaActiva)}
                >
                  <CheckCircle size={17} />
                  Aceptar tarea
                </button>
              </section>
            )}

            {/* TAREA ACEPTADA */}

            {tareaActiva.estado === "Aceptada" && (
              <section className="diagnostic-start">
                <ClipboardCheck size={38} />
                <h3>Tarea aceptada</h3>
                <p>
                  Puedes comenzar la inspección física y el registro
                  de los componentes del dispositivo.
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() => iniciarTarea(tareaActiva)}
                >
                  <Play size={17} />
                  Iniciar diagnóstico
                </button>
              </section>
            )}

            {/* TAREA EN PROCESO */}

            {tareaActiva.estado === "En proceso" && (
              <>
                <nav className="diagnostic-steps" aria-label="Etapas del diagnóstico">
                  {pasos.map((paso, index) => {
                    const Icon = paso.icono;
                    const activo = tareaActiva.etapa === index;
                    const completado = etapaValida(index);

                    return (
                      <button
                        type="button"
                        key={paso.titulo}
                        className={`diagnostic-step ${activo ? "active" : ""} ${completado ? "done" : ""}`}
                        onClick={() => cambiarEtapa(index)}
                      >
                        <span>
                          {completado && !activo
                            ? <CheckCircle size={18} />
                            : <Icon size={18} />}
                        </span>
                        <small>{index + 1}. {paso.titulo}</small>
                      </button>
                    );
                  })}
                </nav>

                <section className="diagnostic-progress">
                  <header className="diagnostic-progress-heading">
                    <span>Progreso del diagnóstico</span>
                    <strong>{obtenerProgreso(tareaActiva)}%</strong>
                  </header>

                  <span className="task-progress-track">
                    <span
                      className="task-progress-fill"
                      style={{ width: `${obtenerProgreso(tareaActiva)}%` }}
                    />
                  </span>
                </section>

                {/* ETAPA 1 */}

                {tareaActiva.etapa === 0 && (
                  <section className="diagnostic-form">
                    <h3>1. Inspección inicial</h3>
                    <p>
                      Registra las condiciones generales en las que
                      recibiste el dispositivo.
                    </p>

                    <label>Condición general del dispositivo *</label>
                    <select
                      value={tareaActiva.inspeccion.condicion}
                      onChange={(e) =>
                        actualizarCampo("inspeccion", {
                          condicion: e.target.value
                        })
                      }
                    >
                      <option value="">Seleccionar condición</option>
                      <option value="Bueno">Bueno</option>
                      <option value="Regular">Regular</option>
                      <option value="Dañado">Dañado</option>
                      <option value="No funcional">No funcional</option>
                      <option value="Por determinar">Por determinar</option>
                    </select>

                    <label>Descripción de la inspección *</label>
                    <textarea
                      rows="4"
                      placeholder="Describe el estado físico, funcionamiento, golpes, faltantes u otras observaciones..."
                      value={tareaActiva.inspeccion.descripcion}
                      onChange={(e) =>
                        actualizarCampo("inspeccion", {
                          descripcion: e.target.value
                        })
                      }
                    />

                    <aside className="diagnostic-hint">
                      <AlertCircle size={16} />
                      Describe únicamente las condiciones que hayas podido comprobar.
                    </aside>
                  </section>
                )}

                {/* ETAPA 2 */}

                {tareaActiva.etapa === 1 && (
                  <section className="diagnostic-form">
                    <h3>2. Registro de componentes</h3>
                    <p>
                      Registra cada pieza revisada y especifica si presenta
                      daños o necesita atención.
                    </p>

                    <fieldset className="component-entry">
                      <legend>Nuevo componente</legend>

                      <label>Nombre del componente *</label>
                      <input
                        type="text"
                        placeholder="Ej. Memoria RAM, pantalla, fuente de poder..."
                        value={nuevoComponente.nombre}
                        onChange={(e) =>
                          setNuevoComponente({
                            ...nuevoComponente,
                            nombre: e.target.value
                          })
                        }
                      />

                      <label>Estado del componente</label>
                      <select
                        value={nuevoComponente.estado}
                        onChange={(e) =>
                          setNuevoComponente({
                            ...nuevoComponente,
                            estado: e.target.value
                          })
                        }
                      >
                        <option value="Bueno">Bueno</option>
                        <option value="Regular">Regular</option>
                        <option value="Dañado">Dañado</option>
                        <option value="No funcional">No funcional</option>
                        <option value="Por revisar">Por revisar</option>
                      </select>

                      <label>Daño u observación</label>
                      <textarea
                        rows="2"
                        placeholder="Describe el daño encontrado o escribe Ninguno..."
                        value={nuevoComponente.dano}
                        onChange={(e) =>
                          setNuevoComponente({
                            ...nuevoComponente,
                            dano: e.target.value
                          })
                        }
                      />

                      <button
                        type="button"
                        className="primary-button"
                        onClick={agregarComponente}
                        disabled={!nuevoComponente.nombre.trim()}
                      >
                        <Plus size={17} />
                        Agregar componente
                      </button>
                    </fieldset>

                    <h4>Componentes registrados ({tareaActiva.componentes.length})</h4>

                    {tareaActiva.componentes.length === 0 ? (
                      <p className="diagnostic-empty">
                        Todavía no se han registrado componentes.
                      </p>
                    ) : (
                      <ul className="component-list">
                        {tareaActiva.componentes.map((componente) => (
                          <li className="component-item" key={componente.id}>
                            <section>
                              <strong>{componente.nombre}</strong>
                              <span>{componente.estado}</span>
                              <p>{componente.dano}</p>
                            </section>

                            <button
                              type="button"
                              className="component-delete"
                              onClick={() => eliminarComponente(componente.id)}
                              title="Eliminar componente"
                              aria-label={`Eliminar ${componente.nombre}`}
                            >
                              <Trash2 size={17} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                )}

                {/* ETAPA 3 */}

                {tareaActiva.etapa === 2 && (
                  <section className="diagnostic-form">
                    <h3>3. Diagnóstico técnico</h3>
                    <p>
                      Registra los resultados de la evaluación y la
                      recomendación técnica.
                    </p>

                    <label>Observaciones técnicas *</label>
                    <textarea
                      rows="3"
                      placeholder="Describe los hallazgos de la revisión..."
                      value={tareaActiva.diagnostico.observaciones}
                      onChange={(e) =>
                        actualizarCampo("diagnostico", {
                          observaciones: e.target.value
                        })
                      }
                    />

                    <label>Diagnóstico técnico *</label>
                    <textarea
                      rows="3"
                      placeholder="Indica el resultado de la evaluación..."
                      value={tareaActiva.diagnostico.resultado}
                      onChange={(e) =>
                        actualizarCampo("diagnostico", {
                          resultado: e.target.value
                        })
                      }
                    />

                    <label>Recomendación técnica *</label>
                    <select
                      value={tareaActiva.diagnostico.recomendacion}
                      onChange={(e) =>
                        actualizarCampo("diagnostico", {
                          recomendacion: e.target.value
                        })
                      }
                    >
                      <option value="">Seleccionar recomendación</option>
                      <option value="Reacondicionamiento">Reacondicionamiento</option>
                      <option value="Reparación">Reparación</option>
                      <option value="Recuperación de componentes">Recuperación de componentes</option>
                      <option value="Reciclaje">Reciclaje</option>
                      <option value="Evaluación especializada">Evaluación especializada</option>
                    </select>

                    <label>Justificación de la recomendación *</label>
                    <textarea
                      rows="3"
                      placeholder="Explica por qué recomiendas este tratamiento..."
                      value={tareaActiva.diagnostico.justificacion}
                      onChange={(e) =>
                        actualizarCampo("diagnostico", {
                          justificacion: e.target.value
                        })
                      }
                    />

                    <label>Referencia de evidencias (opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej. foto-dis001-frontal.jpg"
                      value={tareaActiva.diagnostico.evidencias}
                      onChange={(e) =>
                        actualizarCampo("diagnostico", {
                          evidencias: e.target.value
                        })
                      }
                    />

                    <aside className="diagnostic-hint">
                      <Camera size={16} />
                      En esta versión se registra la referencia de la evidencia.
                      La carga de fotografías se implementará posteriormente.
                    </aside>
                  </section>
                )}

                {/* ETAPA 4 */}

                {tareaActiva.etapa === 3 && (
                  <section className="diagnostic-form">
                    <h3>4. Revisión final</h3>
                    <p>
                      Verifica la información antes de finalizar la tarea.
                    </p>

                    <dl className="final-review">
                      <section>
                        <dt>Condición general</dt>
                        <dd>{tareaActiva.inspeccion.condicion || "Sin registrar"}</dd>
                      </section>
                      <section>
                        <dt>Componentes registrados</dt>
                        <dd>{tareaActiva.componentes.length}</dd>
                      </section>
                      <section>
                        <dt>Diagnóstico</dt>
                        <dd>{tareaActiva.diagnostico.resultado || "Sin registrar"}</dd>
                      </section>
                      <section>
                        <dt>Recomendación</dt>
                        <dd>{tareaActiva.diagnostico.recomendacion || "Sin registrar"}</dd>
                      </section>
                    </dl>
                  </section>
                )}

                {/* ACCIONES */}

                <footer className="diagnostic-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => cambiarEtapa(Math.max(0, tareaActiva.etapa - 1))}
                    disabled={tareaActiva.etapa === 0}
                  >
                    <ChevronLeft size={17} />
                    Anterior
                  </button>

                  <section className="diagnostic-actions-right">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => pausarTarea(tareaActiva)}
                    >
                      <Pause size={16} />
                      Pausar y salir
                    </button>

                    {tareaActiva.etapa < 3 && (
                      <button
                        type="button"
                        className="primary-button"
                        onClick={siguienteEtapa}
                        disabled={!etapaValida(tareaActiva.etapa)}
                      >
                        Guardar y continuar
                        <ChevronRight size={17} />
                      </button>
                    )}

                    {tareaActiva.etapa === 3 && (
                      <button
                        type="button"
                        className="primary-button"
                        onClick={finalizarTarea}
                        disabled={
                          !etapaValida(0) ||
                          !etapaValida(1) ||
                          !etapaValida(2)
                        }
                      >
                        <CheckCircle size={17} />
                        Finalizar diagnóstico
                      </button>
                    )}
                  </section>
                </footer>

                <footer className="diagnostic-save-note">
                  <Save size={15} />
                  Los cambios se guardan automáticamente en este navegador.
                </footer>
              </>
            )}

            {/* TAREA PAUSADA */}

            {tareaActiva.estado === "Pausada" && (
              <section className="diagnostic-paused">
                <Pause size={34} />
                <h3>Diagnóstico pausado</h3>
                <p>
                  Tu avance se ha conservado. Puedes continuar desde la
                  última etapa trabajada.
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() => reanudarTarea(tareaActiva)}
                >
                  <RotateCcw size={17} />
                  Reanudar diagnóstico
                </button>
              </section>
            )}

            {/* TAREA COMPLETADA */}

            {tareaActiva.estado === "Completada" && (
              <section className="diagnostic-completed">
                <CheckCircle size={34} />
                <h3>Diagnóstico finalizado</h3>
                <p>La tarea se encuentra completada.</p>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setTareaSeleccionadaId(null)}
                >
                  Cerrar
                </button>
              </section>
            )}
          </article>
        </section>
      )}
    </main>
  );
}

export default BandejaTrabajo;
