
import { useState } from "react";
import { ClipboardCheck } from "lucide-react";

function Evaluaciones() {
  const [evaluations, setEvaluations] = useState([
    { id: 1, device: "Computadora de escritorio", result: "REACONDICIONAMIENTO", date: "2026-10-20" },
    { id: 2, device: "Monitor LED", result: "RECICLAJE", date: "2026-10-22" }
  ]);

  const [device, setDevice] = useState("");
  const [result, setResult] = useState("REACONDICIONAMIENTO");
  const [date, setDate] = useState("");

  function addEvaluation(e) {
    e.preventDefault();

    setEvaluations([
      ...evaluations,
      { id: Date.now(), device, result, date }
    ]);

    setDevice("");
    setDate("");
  }

  return (
    <section className="dashboard">
      <div className="page-heading">
        <div>
          <h1>Evaluaciones técnicas</h1>
          <p>Registro de resultados de evaluación de dispositivos RAEE.</p>
        </div>
      </div>

      <form className="content-card form-grid" onSubmit={addEvaluation}>
        <h3><ClipboardCheck size={20} /> Nueva evaluación</h3>
        <label>Dispositivo<input value={device} onChange={(e) => setDevice(e.target.value)} required /></label>
        <label>Resultado
          <select value={result} onChange={(e) => setResult(e.target.value)}>
            <option value="REACONDICIONAMIENTO">Reacondicionamiento</option>
            <option value="RECICLAJE">Reciclaje</option>
            <option value="DISPOSICION_CONTROLADA">Disposición controlada</option>
          </select>
        </label>
        <label>Fecha<input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label>
        <button className="primary-button">Guardar evaluación</button>
      </form>

      <div className="content-card">
        <h3>Evaluaciones registradas</h3>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>ID</th><th>Dispositivo</th><th>Resultado</th><th>Fecha</th></tr></thead>
            <tbody>
              {evaluations.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td><td>{item.device}</td><td>{item.result}</td><td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Evaluaciones;
