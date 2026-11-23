
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Páginas públicas
import Login from "./pages/Login";

// Paneles
import DashboardAdministrador from "./pages/DashboardAdministrador";
import DashboardTecnico from "./pages/DashboardTecnico";
import DashboardOperador from "./pages/DashboardOperador";

// Módulos generales
import Dispositivos from "./pages/Dispositivos";
import CentrosAcopio from "./pages/CentrosAcopio";
import Inventario from "./pages/Inventario";
import Recolecciones from "./pages/Recolecciones";
import Evaluaciones from "./pages/Evaluaciones";
import Tratamientos from "./pages/Tratamientos";
import BandejaTrabajo from "./pages/BandejaTrabajo";
import SolicitudesRecibidas from "./pages/SolicitudesRecibidas";
import Auditoria from "./pages/Auditoria";
import Reportes from "./pages/Reportes";
import Usuarios from "./pages/Usuarios";
import HistorialMovimientos from "./pages/HistorialMovimientos";

// Módulos operativos del operador
import OperacionesOperador from "./pages/OperacionesOperador";

import { ROLE_HOME } from "./config/permissions";

function InicioPorRol() {
  const { usuario, autenticado } = useAuth();

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Navigate
      to={ROLE_HOME[usuario?.rol] || "/login"}
      replace
    />
  );
}

function PanelPorRol() {
  const { usuario } = useAuth();

  switch (usuario?.rol) {
    case "ADMINISTRADOR":
      return <DashboardAdministrador />;

    case "TECNICO":
      return <DashboardTecnico />;

    case "OPERADOR":
      return <DashboardOperador />;

    default:
      return <Navigate to="/login" replace />;
  }
}

function RutaProtegida({ children, roles }) {
  return (
    <ProtectedRoute allowedRoles={roles}>
      {children}
    </ProtectedRoute>
  );
}

function RutasAplicacion() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />

      {/* Redirección inicial */}
      <Route path="/" element={<InicioPorRol />} />

      {/* Módulos privados */}
      <Route
        element={
          <RutaProtegida
            roles={["ADMINISTRADOR", "TECNICO", "OPERADOR"]}
          >
            <Layout />
          </RutaProtegida>
        }
      >
        <Route path="/dashboard" element={<PanelPorRol />} />

        <Route path="/dispositivos" element={<Dispositivos />} />

        <Route path="/inventario" element={<Inventario />} />

        <Route
          path="/historial-movimientos"
          element={<HistorialMovimientos />}
        />
      </Route>

      {/* Administrador y operador */}
      <Route
        element={
          <RutaProtegida roles={["ADMINISTRADOR", "OPERADOR"]}>
            <Layout />
          </RutaProtegida>
        }
      >
        <Route path="/centros" element={<CentrosAcopio />} />
        <Route path="/recepciones" element={<OperacionesOperador />} />
        <Route path="/ingresos" element={<OperacionesOperador />} />
        <Route path="/salidas" element={<OperacionesOperador />} />
        <Route path="/transferencias" element={<OperacionesOperador />} />
        <Route path="/evidencias" element={<OperacionesOperador />} />
      </Route>

      {/* Administrador y técnico */}
      <Route
        element={
          <RutaProtegida roles={["ADMINISTRADOR", "TECNICO"]}>
            <Layout />
          </RutaProtegida>
        }
      >
        <Route path="/recolecciones" element={<Recolecciones />} />
        <Route path="/evaluaciones" element={<Evaluaciones />} />
        <Route path="/tratamientos" element={<Tratamientos />} />
      </Route>

      {/* Solo técnico */}
      <Route
        element={
          <RutaProtegida roles={["TECNICO"]}>
            <Layout />
          </RutaProtegida>
        }
      >
        <Route path="/bandeja-trabajo" element={<BandejaTrabajo />} />
        <Route
          path="/solicitudes-recibidas"
          element={<SolicitudesRecibidas />}
        />
      </Route>

      {/* Solo administrador */}
      <Route
        element={
          <RutaProtegida roles={["ADMINISTRADOR"]}>
            <Layout />
          </RutaProtegida>
        }
      >
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/auditoria" element={<Auditoria />} />
        <Route path="/usuarios" element={<Usuarios />} />
      </Route>

      {/* Rutas inexistentes */}
      <Route path="*" element={<InicioPorRol />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RutasAplicacion />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
