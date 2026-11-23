
import { useMemo, useState } from "react";
import {
  Monitor,
  PackageCheck,
  ClipboardList,
  Recycle,
  CalendarDays,
  Download,
  TrendingUp,
  Building2,
} from "lucide-react";

const datosMensuales = [
  { mes: "Jun", registrados: 35, recolectados: 24 },
  { mes: "Jul", registrados: 48, recolectados: 32 },
  { mes: "Ago", registrados: 42, recolectados: 38 },
  { mes: "Sep", registrados: 65, recolectados: 45 },
  { mes: "Oct", registrados: 58, recolectados: 51 },
  { mes: "Nov", registrados: 72, recolectados: 60 },
];

const datosCategorias = [
  { nombre: "Computadoras", cantidad: 45 },
  { nombre: "Monitores", cantidad: 28 },
  { nombre: "Impresoras", cantidad: 18 },
  { nombre: "Periféricos", cantidad: 32 },
  { nombre: "Otros", cantidad: 22 },
];

const datosCentros = [
  { nombre: "Centro Norte", dispositivos: 68, recolectados: 45 },
  { nombre: "Centro Sur", dispositivos: 42, recolectados: 30 },
  { nombre: "Centro Principal", dispositivos: 35, recolectados: 25 },
];

function Reportes() {
  const [periodo, setPeriodo] = useState("6");
  const [fechaInicio, setFechaInicio] = useState("2026-06-01");
  const [fechaFin, setFechaFin] = useState("2026-11-30");

  const totalRegistrados = 125;
  const totalRecolectados = 86;
  const totalInventario = 64;
  const solicitudesPendientes = 12;

  const mesesVisibles = useMemo(() => {
    if (periodo === "3") return datosMensuales.slice(-3);
    if (periodo === "6") return datosMensuales.slice(-6);
    return datosMensuales;
  }, [periodo]);

  const maximo = Math.max(
    ...mesesVisibles.map((item) =>
      Math.max(item.registrados, item.recolectados)
    )
  );

  const exportarCSV = () => {
    const filas = [
      ["Reporte general EcoRAEE Cloud"],
      ["Fecha de generación", new Date().toLocaleDateString()],
      [],
      ["Indicador", "Cantidad"],
      ["Dispositivos registrados", totalRegistrados],
      ["Dispositivos recolectados", totalRecolectados],
      ["Dispositivos en inventario", totalInventario],
      ["Solicitudes pendientes", solicitudesPendientes],
      [],
      ["Centro", "Dispositivos registrados", "Recolectados"],
      ...datosCentros.map((centro) => [
        centro.nombre,
        centro.dispositivos,
        centro.recolectados,
      ]),
    ];

    const contenido = filas
      .map((fila) =>
        fila
          .map((valor) => `"${String(valor ?? "").replace(/"/g, '""')}"`)
          .join(";")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + contenido], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "reporte-ecoraee.csv";
    enlace.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="dashboard">
      <div className="page-header">
        <div>
          <h1>Reportes y estadísticas</h1>
          <p>
            Consulta los indicadores y el estado general de la gestión RAEE.
          </p>
        </div>

        <button className="btn-primary" onClick={exportarCSV}>
          <Download size={17} />
          Exportar reporte
        </button>
      </div>

      <div className="report-filters content-card">
        <div>
          <label>Periodo del reporte</label>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
          >
            <option value="3">Últimos 3 meses</option>
            <option value="6">Últimos 6 meses</option>
            <option value="12">Últimos 12 meses</option>
          </select>
        </div>

        <div>
          <label>Desde</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <div>
          <label>Hasta</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
      </div>

      <div className="stats-grid report-stats">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Monitor size={24} />
          </div>
          <div>
            <h3>{totalRegistrados}</h3>
            <p>Dispositivos registrados</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <PackageCheck size={24} />
          </div>
          <div>
            <h3>{totalRecolectados}</h3>
            <p>Dispositivos recolectados</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Recycle size={24} />
          </div>
          <div>
            <h3>{totalInventario}</h3>
            <p>En inventario</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <ClipboardList size={24} />
          </div>
          <div>
            <h3>{solicitudesPendientes}</h3>
            <p>Solicitudes pendientes</p>
          </div>
        </div>
      </div>

      <div className="report-grid">
        <div className="content-card report-chart-card">
          <div className="report-card-header">
            <div>
              <h2>Actividad mensual</h2>
              <p>Dispositivos registrados y recolectados</p>
            </div>
            <TrendingUp size={22} />
          </div>

          <div className="report-legend">
            <span><i className="legend-registered" /> Registrados</span>
            <span><i className="legend-collected" /> Recolectados</span>
          </div>

          <div className="report-bars">
            {mesesVisibles.map((dato) => (
              <div className="report-bar-group" key={dato.mes}>
                <div className="report-bars-container">
                  <div
                    className="report-bar registered"
                    style={{
                      height: `${(dato.registrados / maximo) * 100}%`,
                    }}
                    title={`Registrados: ${dato.registrados}`}
                  />
                  <div
                    className="report-bar collected"
                    style={{
                      height: `${(dato.recolectados / maximo) * 100}%`,
                    }}
                    title={`Recolectados: ${dato.recolectados}`}
                  />
                </div>
                <span>{dato.mes}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="content-card">
          <div className="report-card-header">
            <div>
              <h2>Dispositivos por categoría</h2>
              <p>Distribución de dispositivos registrados</p>
            </div>
            <Monitor size={22} />
          </div>

          <div className="category-report-list">
            {datosCategorias.map((categoria) => (
              <div className="category-report-item" key={categoria.nombre}>
                <div className="category-report-info">
                  <span>{categoria.nombre}</span>
                  <strong>{categoria.cantidad}</strong>
                </div>
                <div className="category-progress">
                  <div
                    style={{
                      width: `${(categoria.cantidad / 45) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="content-card report-centers">
        <div className="report-card-header">
          <div>
            <h2>Resumen por centro de acopio</h2>
            <p>Comparación de dispositivos registrados y recolectados</p>
          </div>
          <Building2 size={22} />
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Centro de acopio</th>
                <th>Registrados</th>
                <th>Recolectados</th>
                <th>Porcentaje recolectado</th>
              </tr>
            </thead>
            <tbody>
              {datosCentros.map((centro) => (
                <tr key={centro.nombre}>
                  <td><strong>{centro.nombre}</strong></td>
                  <td>{centro.dispositivos}</td>
                  <td>{centro.recolectados}</td>
                  <td>
                    {Math.round(
                      (centro.recolectados / centro.dispositivos) * 100
                    )}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="report-note">
        <CalendarDays size={18} />
        <p>
          Los datos presentados son demostrativos. Se reemplazarán por
          información real al conectar el frontend con el backend y la base
          de datos.
        </p>
      </div>
    </section>
  );
}

export default Reportes;
