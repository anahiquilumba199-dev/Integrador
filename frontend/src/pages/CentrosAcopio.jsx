import { useAuth } from "../context/useAuth";
import { useCollection } from "../services/useCollection";
import { useState } from "react";
import { Plus, Building2 } from "lucide-react";

function CentrosAcopio() {
  const { usuario } = useAuth();
  const { items: centers, error, create } = useCollection("/centros");

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");

  async function addCenter(e) {
    e.preventDefault();
    if (!(await create({ name, location, capacity: Number(capacity) }))) return;

    setName("");
    setLocation("");
    setCapacity("");
    setShowForm(false);
  }

  return (
    <section className="dashboard">
      {error && <p role="alert">{error}</p>}
      <div className="page-heading">
        <div>
          <h1>Centros de acopio</h1>
          <p>Administración de los lugares de recepción de RAEE.</p>
        </div>
        {usuario.rol === "ADMINISTRADOR" && <button className="primary-button" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Nuevo centro
        </button>}
      </div>

      {showForm && (
        <form className="content-card form-grid" onSubmit={addCenter}>
          <h3>Registrar centro de acopio</h3>
          <label>Nombre<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
          <label>Ubicación<input value={location} onChange={(e) => setLocation(e.target.value)} required /></label>
          <label>Capacidad en kg<input type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} required /></label>
          <button className="primary-button">Guardar centro</button>
        </form>
      )}

      <div className="cards-list">
        {centers.map((center) => (
          <article className="content-card center-card" key={center.id}>
            <Building2 size={28} />
            <h3>{center.name}</h3>
            <p>Ubicación: {center.location}</p>
            <p>Capacidad: {center.capacity} kg</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CentrosAcopio;
