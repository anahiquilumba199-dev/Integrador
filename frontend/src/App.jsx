
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Dispositivos from "./pages/Dispositivos";
import CentrosAcopio from "./pages/CentrosAcopio";
import Recolecciones from "./pages/Recolecciones";
import Inventario from "./pages/Inventario";
import Evaluaciones from "./pages/Evaluaciones";
import Usuarios from "./pages/Usuarios";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dispositivos" element={<Dispositivos />} />
          <Route path="/centros" element={<CentrosAcopio />} />
          <Route path="/recolecciones" element={<Recolecciones />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/evaluaciones" element={<Evaluaciones />} />
          <Route path="/usuarios" element={<Usuarios />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
