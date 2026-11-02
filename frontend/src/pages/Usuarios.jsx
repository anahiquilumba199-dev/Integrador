
import { useState } from "react";
import { Plus, Users } from "lucide-react";

function Usuarios() {
  const [users, setUsers] = useState([
    { id: 1, name: "Administrador", email: "admin@ecoraee.com", role: "ADMINISTRADOR" },
    { id: 2, name: "Técnico RAEE", email: "tecnico@ecoraee.com", role: "TECNICO" }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("TECNICO");

  function addUser(e) {
    e.preventDefault();

    setUsers([...users, { id: Date.now(), name, email, role }]);
    setName("");
    setEmail("");
    setRole("TECNICO");
    setShowForm(false);
  }

  return (
    <section className="dashboard">
      <div className="page-heading">
        <div>
          <h1>Usuarios</h1>
          <p>Administración de usuarios y roles del sistema.</p>
        </div>
        <button className="primary-button" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Nuevo usuario
        </button>
      </div>

      {showForm && (
        <form className="content-card form-grid" onSubmit={addUser}>
          <h3>Registrar usuario</h3>
          <label>Nombre<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
          <label>Correo electrónico<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label>Rol
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="ADMINISTRADOR">Administrador</option>
              <option value="TECNICO">Técnico</option>
              <option value="OPERADOR">Operador</option>
            </select>
          </label>
          <button className="primary-button">Guardar usuario</button>
        </form>
      )}

      <div className="content-card">
        <h3><Users size={20} /> Usuarios registrados</h3>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th></tr></thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Usuarios;
