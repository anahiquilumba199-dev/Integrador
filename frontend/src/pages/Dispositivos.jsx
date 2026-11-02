
import { useState } from "react";
import { Plus, Search } from "lucide-react";

function Dispositivos() {
  const [devices, setDevices] = useState([
    { id: 1, name: "Computadora de escritorio", category: "Informática", state: "REGISTRADO" },
    { id: 2, name: "Monitor LED", category: "Pantallas", state: "RECOLECTADO" },
    { id: 3, name: "Impresora", category: "Impresión", state: "EVALUADO" }
  ]);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  function addDevice(e) {
    e.preventDefault();

    if (!name.trim() || !category.trim()) return;

    setDevices([
      ...devices,
      {
        id: Date.now(),
        name,
        category,
        state: "REGISTRADO"
      }
    ]);

    setName("");
    setCategory("");
    setShowForm(false);
  }

  const filteredDevices = devices.filter((device) =>
    `${device.name} ${device.category}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="dashboard">
      <div className="page-heading">
        <div>
          <h1>Dispositivos RAEE</h1>
          <p>Registro y administración de aparatos electrónicos.</p>
        </div>

        <button className="primary-button" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Nuevo dispositivo
        </button>
      </div>

      {showForm && (
        <form className="content-card form-grid" onSubmit={addDevice}>
          <h3>Registrar dispositivo</h3>

          <label>
            Nombre del dispositivo
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label>
            Categoría
            <input value={category} onChange={(e) => setCategory(e.target.value)} required />
          </label>

          <button className="primary-button" type="submit">Guardar dispositivo</button>
        </form>
      )}

      <div className="content-card">
        <div className="table-toolbar">
          <h3>Listado de dispositivos</h3>
          <div className="search-field">
            <Search size={17} />
            <input
              placeholder="Buscar dispositivo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Dispositivo</th>
                <th>Categoría</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map((device) => (
                <tr key={device.id}>
                  <td>{device.id}</td>
                  <td>{device.name}</td>
                  <td>{device.category}</td>
                  <td><span className="table-status">{device.state}</span></td>
                </tr>
              ))}
              {filteredDevices.length === 0 && (
                <tr><td colSpan="4">No se encontraron dispositivos.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Dispositivos;
