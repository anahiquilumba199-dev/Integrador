
import { Package } from "lucide-react";

function Inventario() {
  const inventory = [
    { id: 1, device: "Computadora de escritorio", quantity: 15, condition: "Pendiente de evaluación" },
    { id: 2, device: "Monitores", quantity: 22, condition: "Almacenado" },
    { id: 3, device: "Impresoras", quantity: 8, condition: "Almacenado" }
  ];

  return (
    <section className="dashboard">
      <div className="page-heading">
        <div>
          <h1>Inventario</h1>
          <p>Control de dispositivos RAEE recibidos y almacenados.</p>
        </div>
      </div>

      <div className="content-card">
        <div className="table-toolbar">
          <h3><Package size={20} /> Inventario de dispositivos</h3>
          <span className="status-label">Control de existencias</span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>ID</th><th>Dispositivo</th><th>Cantidad</th><th>Condición</th></tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.device}</td>
                  <td>{item.quantity}</td>
                  <td><span className="table-status">{item.condition}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Inventario;
