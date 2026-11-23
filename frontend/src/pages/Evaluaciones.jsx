import { useCollection } from "../services/useCollection";
import { useState } from "react";
import { ClipboardCheck } from "lucide-react";

function Evaluaciones() {
  const { items: evaluations, error, create } = useCollection("/evaluaciones");

  const { items: dispositivos, error: errorDispositivos } = useCollection("/dispositivos");
  const [device, setDevice] = useState("");
  const [result, setResult] = useState("REACONDICIONAMIENTO");
  const [date, setDate] = useState("");

  async function addEvaluation(e) {
    e.preventDefault();
    if (!(await create({ device_id: Number(device), result, date }))) return;

    setDevice("");
    setDate("");
  }

  return (
    <section className="dashboard">
      {(error || errorDispositivos) && <p role="alert">{error || errorDispositivos}</p>}
      <div className="page-heading">
        <div>
          <h1>Evaluaciones técnicas</h1>
          <p>Registro de resultados de evaluación de dispositivos RAEE.</p>
        </div>
      </div>

      <form className="content-card form-grid" onSubmit={addEvaluation}>
        <h3><ClipboardCheck size={20} /> Nueva evaluación</h3>
        <label>Dispositivo
          <select value={device} onChange={(e) => setDevice(e.target.value)} required>
            <option value="">Seleccionar dispositivo</option>
            {dispositivos.map((item) => (
              <option key={item.id} value={item.id}>{item.name} (#{item.id})</option>
            ))}
          </select>
        </label>
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
