
import { useState } from "react";
import { Plus, Building2 } from "lucide-react";

function CentrosAcopio() {
  const [centers, setCenters] = useState([
    { id: 1, name: "Centro de Acopio Principal", location: "Edificio administrativo", capacity: "500 kg" },
    { id: 2, name: "Centro de Acopio Secundario", location: "Laboratorio de sistemas", capacity: "250 kg" }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");

  function addCenter(e) {
    e.preventDefault();

    setCenters([
      ...centers,
      { id: Date.now(), name, location, capacity: `${capacity} kg` }
    ]);

    setName("");
    setLocation("");
    setCapacity("");
    setShowForm(false);
  }

  return (
    <section className="dashboard">
      <div className="page-heading">
        <div>
          <h1>Centros de acopio</h1>
          <p>Administración de los lugares de recepción de RAEE.</p>
        </div>
        <button className="primary-button" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Nuevo centro
        </button>
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
            <p>Capacidad: {center.capacity}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CentrosAcopio;
