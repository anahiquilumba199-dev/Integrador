
import { useState } from "react";
import { Plus } from "lucide-react";

function Recolecciones() {
  const [requests, setRequests] = useState([
    { id: 1, applicant: "Laboratorio de sistemas", date: "2026-10-20", state: "PENDIENTE" },
    { id: 2, applicant: "Área administrativa", date: "2026-10-22", state: "APROBADA" }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [applicant, setApplicant] = useState("");
  const [date, setDate] = useState("");

  function addRequest(e) {
    e.preventDefault();

    setRequests([
      ...requests,
      { id: Date.now(), applicant, date, state: "PENDIENTE" }
    ]);

    setApplicant("");
    setDate("");
    setShowForm(false);
  }

  return (
    <section className="dashboard">
      <div className="page-heading">
        <div>
          <h1>Recolecciones</h1>
          <p>Seguimiento de solicitudes de recolección de residuos electrónicos.</p>
        </div>
        <button className="primary-button" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Nueva solicitud
        </button>
      </div>

      {showForm && (
        <form className="content-card form-grid" onSubmit={addRequest}>
          <h3>Registrar solicitud</h3>
          <label>Solicitante<input value={applicant} onChange={(e) => setApplicant(e.target.value)} required /></label>
          <label>Fecha<input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label>
          <button className="primary-button">Guardar solicitud</button>
        </form>
      )}

      <div className="content-card">
        <h3>Solicitudes registradas</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>ID</th><th>Solicitante</th><th>Fecha</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.applicant}</td>
                  <td>{request.date}</td>
                  <td><span className="table-status">{request.state}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Recolecciones;
