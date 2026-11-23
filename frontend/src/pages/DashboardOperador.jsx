import {
  PackageCheck,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Warehouse,
  ClipboardList,
  Paperclip,
  History,
  Package,
  Clock
} from "lucide-react";

import { Link } from "react-router-dom";

function DashboardOperador() {
  const indicadores = [
    {
      titulo: "Recepciones realizadas",
      valor: "28",
      descripcion: "Equipos recibidos",
      icono: PackageCheck,
      color: "blue"
    },
    {
      titulo: "Ingresos registrados",
      valor: "35",
      descripcion: "Entradas de dispositivos",
      icono: ArrowDownToLine,
      color: "green"
    },
    {
      titulo: "Salidas registradas",
      valor: "9",
      descripcion: "Equipos entregados",
      icono: ArrowUpFromLine,
      color: "orange"
    },
    {
      titulo: "Transferencias",
      valor: "6",
      descripcion: "Movimientos realizados",
      icono: ArrowLeftRight,
      color: "purple"
    },
    {
      titulo: "Inventario del centro",
      valor: "64",
      descripcion: "Equipos registrados",
      icono: Warehouse,
      color: "blue"
    },
    {
      titulo: "Registros pendientes",
      valor: "4",
      descripcion: "Por completar o revisar",
      icono: ClipboardList,
      color: "orange"
    }
  ];

  const operaciones = [
    {
      titulo: "Recepción de dispositivos",
      descripcion: "Registrar los equipos recibidos físicamente.",
      icono: PackageCheck,
      ruta: "/recepciones"
    },
    {
      titulo: "Registrar ingresos",
      descripcion: "Controlar las entradas al centro de acopio.",
      icono: ArrowDownToLine,
      ruta: "/ingresos"
    },
    {
      titulo: "Registrar salidas",
      descripcion: "Documentar las salidas autorizadas.",
      icono: ArrowUpFromLine,
      ruta: "/salidas"
    },
    {
      titulo: "Gestionar transferencias",
      descripcion: "Registrar movimientos entre centros.",
      icono: ArrowLeftRight,
      ruta: "/transferencias"
    },
    {
      titulo: "Gestionar evidencias",
      descripcion: "Consultar los respaldos de las operaciones.",
      icono: Paperclip,
      ruta: "/evidencias"
    },
    {
      titulo: "Historial de movimientos",
      descripcion: "Consultar las operaciones realizadas.",
      icono: History,
      ruta: "/historial-movimientos"
    }
  ];

  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Panel del operador</h1>
          <p>
            Gestiona las recepciones, movimientos y el inventario
            del centro de acopio.
          </p>
        </div>
      </div>

      <div className="section-heading">
        <h2>Área operativa</h2>
      </div>

      <div className="stats-grid">
        {indicadores.map((item, index) => {
          const Icon = item.icono;

          return (
            <article className="stat-card" key={index}>
              <div className="stat-top">
                <div>
                  <p>{item.titulo}</p>
                  <h2>{item.valor}</h2>
                  <span>{item.descripcion}</span>
                </div>

                <div className={`stat-icon ${item.color}`}>
                  <Icon size={23} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="dashboard-columns">
        <div className="content-card">
          <div className="card-header">
            <div>
              <h2>Operaciones del centro de acopio</h2>
              <p>
                Actividades principales para mantener el control
                de los residuos electrónicos.
              </p>
            </div>
          </div>

          <div className="operations-grid">
            {operaciones.map((item, index) => {
              const Icon = item.icono;

              return (
                <Link
                  to={item.ruta}
                  className="operation-item"
                  key={index}
                >
                  <div className="activity-icon">
                    <Icon size={22} />
                  </div>

                  <div>
                    <h3>{item.titulo}</h3>
                    <p>{item.descripcion}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="content-card">
          <div className="card-header">
            <div>
              <h2>Control operativo</h2>
              <p>
                Mantén actualizada la información de los equipos
                recibidos y sus movimientos.
              </p>
            </div>
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">
                <Package size={21} />
              </div>
              <div>
                <h3>Inventario del centro</h3>
                <p>Consulta las existencias actuales.</p>
                <Link to="/inventario">Consultar inventario</Link>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">
                <Clock size={21} />
              </div>
              <div>
                <h3>Registros pendientes</h3>
                <p>Revisa las operaciones que necesitan completarse.</p>
                <Link to="/recepciones">Revisar recepciones</Link>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">
                <History size={21} />
              </div>
              <div>
                <h3>Movimientos recientes</h3>
                <p>Consulta las entradas, salidas y transferencias.</p>
                <Link to="/historial-movimientos">
                  Ver historial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sustainability-card">
        <h2>Gestión responsable de residuos electrónicos</h2>
        <p>
          Cada recepción, movimiento y registro contribuye a mantener
          la trazabilidad de los dispositivos RAEE y a mejorar su
          gestión dentro de los centros de acopio.
        </p>
      </div>
    </section>
  );
}

export default DashboardOperador;