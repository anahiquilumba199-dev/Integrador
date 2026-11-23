
import { useState } from "react";
import { Plus, Search } from "lucide-react";

function Dispositivos() {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "Computadora de escritorio",
      category: "Informática",
      state: "REGISTRADO"
    },
    {
      id: 2,
      name: "Monitor LED",
      category: "Pantallas",
      state: "RECOLECTADO"
    },
    {
      id: 3,
      name: "Impresora",
      category: "Impresión",
      state: "EVALUADO"
    }
  ]);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  function addDevice(e) {
    e.preventDefault();

    if (!name.trim() || !category.trim()) {
      return;
    }

    const newDevice = {
      id: Date.now(),
      name: name.trim(),
      category: category.trim(),
      state: "REGISTRADO"
    };

    setDevices((currentDevices) => [
      ...currentDevices,
      newDevice
    ]);

    setName("");
    setCategory("");
    setShowForm(false);
  }

  const filteredDevices = devices.filter((device) =>
    `${device.name} ${device.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="dashboard">

      <header className="page-heading">
        <section>
          <h1>Dispositivos RAEE</h1>
          <p>
            Registro y administración de aparatos electrónicos.
          </p>
        </section>

        <button
          type="button"
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={18} />
          Nuevo dispositivo
        </button>
      </header>

      {showForm && (
        <form
          className="content-card form-grid"
          onSubmit={addDevice}
        >
          <h3>Registrar dispositivo</h3>

          <label>
            Nombre del dispositivo

            <input
              type="text"
              placeholder="Ej. Computadora portátil"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Categoría

            <input
              type="text"
              placeholder="Ej. Informática"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </label>

          <button
            className="primary-button"
            type="submit"
          >
            Guardar dispositivo
          </button>
        </form>
      )}

      <section className="content-card">

        <header className="table-toolbar">
          <h3>Listado de dispositivos</h3>

          <label className="search-field">
            <Search size={17} />

            <input
              type="search"
              placeholder="Buscar dispositivo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </header>

        <section className="table-wrapper">
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
                  <td>
                    <span className="table-status">
                      {device.state}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredDevices.length === 0 && (
                <tr>
                  <td colSpan="4">
                    No se encontraron dispositivos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

      </section>
    </main>
  );
}

export default Dispositivos;
