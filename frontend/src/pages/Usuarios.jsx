
import { useState } from "react";
import {
  Plus,
  Users,
  Mail,
  LockKeyhole,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  Trash2,
  UserCheck,
  UserX,
  X,
  CheckCircle,
  Copy
} from "lucide-react";

function Usuarios() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Administrador",
      email: "admin@ecoraee.com",
      role: "ADMINISTRADOR",
      active: true
    },
    {
      id: 2,
      name: "Técnico RAEE",
      email: "tecnico@ecoraee.com",
      role: "TECNICO",
      active: true
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("TECNICO");

  const [error, setError] = useState("");
  const [createdCredentials, setCreatedCredentials] = useState(null);

  const activeUsers = users.filter((user) => user.active).length;

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setRole("TECNICO");
    setError("");
    setShowPassword(false);
  }

  function openForm() {
    resetForm();
    setCreatedCredentials(null);
    setShowForm(true);
  }

  function closeForm() {
    resetForm();
    setShowForm(false);
  }

  function addUser(e) {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    const emailExists = users.some(
      (user) => user.email.toLowerCase() === normalizedEmail
    );

    if (emailExists) {
      setError("Este correo electrónico ya está registrado.");
      return;
    }

    const passwordValid =
      password.length >= 8 &&
      /[A-Za-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password);

    if (!passwordValid) {
      setError(
        "La contraseña debe tener mínimo 8 caracteres, una letra, un número y un signo especial."
      );
      return;
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      role,
      active: true
    };

    setUsers((previousUsers) => [...previousUsers, newUser]);

    setCreatedCredentials({
      name: name.trim(),
      email: normalizedEmail,
      password
    });

    resetForm();
    setShowForm(false);
  }

  function toggleStatus(id) {
    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user.id === id
          ? { ...user, active: !user.active }
          : user
      )
    );
  }

  function deleteUser(id) {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este usuario?"
    );

    if (!confirmed) return;

    setUsers((previousUsers) =>
      previousUsers.filter((user) => user.id !== id)
    );
  }

  async function copyCredentials() {
    if (!createdCredentials) return;

    const text = `EcoRAEE Cloud
Correo: ${createdCredentials.email}
Contraseña: ${createdCredentials.password}`;

    try {
      await navigator.clipboard.writeText(text);
      alert("Credenciales copiadas correctamente.");
    } catch {
      alert("No se pudieron copiar las credenciales.");
    }
  }

  return (
    <section className="dashboard">

      {/* ENCABEZADO */}

      <div className="page-heading">
        <div>
          <h1>Gestión de usuarios</h1>
          <p>
            Administra las cuentas, credenciales y permisos
            de acceso a EcoRAEE Cloud.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openForm}
          type="button"
        >
          <Plus size={18} />
          Nuevo usuario
        </button>
      </div>

      {/* ESTADÍSTICAS */}

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-top">
            <div>
              <p>Usuarios registrados</p>
              <h2>{users.length}</h2>
            </div>
            <div className="stat-icon">
              <Users size={22} />
            </div>
          </div>
          <span>Total de cuentas del sistema</span>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div>
              <p>Usuarios activos</p>
              <h2>{activeUsers}</h2>
            </div>
            <div className="stat-icon">
              <UserCheck size={22} />
            </div>
          </div>
          <span>Cuentas habilitadas</span>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div>
              <p>Usuarios inactivos</p>
              <h2>{users.length - activeUsers}</h2>
            </div>
            <div className="stat-icon">
              <UserX size={22} />
            </div>
          </div>
          <span>Cuentas deshabilitadas</span>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div>
              <p>Administradores</p>
              <h2>
                {users.filter(
                  (user) => user.role === "ADMINISTRADOR"
                ).length}
              </h2>
            </div>
            <div className="stat-icon">
              <ShieldCheck size={22} />
            </div>
          </div>
          <span>Usuarios con permisos administrativos</span>
        </div>

      </div>

      {/* CREDENCIALES DEL NUEVO USUARIO */}

      {createdCredentials && (
        <div className="content-card credentials-card">

          <div className="credentials-header">
            <div className="credentials-title">
              <CheckCircle size={22} />
              <h3>Usuario creado correctamente</h3>
            </div>

            <button
              type="button"
              className="icon-button"
              onClick={() => setCreatedCredentials(null)}
              title="Cerrar"
            >
              <X size={19} />
            </button>
          </div>

          <p>
            Entrega estas credenciales al nuevo usuario.
            Guarda esta información de forma segura.
          </p>

          <div className="credentials-data">
            <div>
              <span>Nombre</span>
              <strong>{createdCredentials.name}</strong>
            </div>

            <div>
              <span>Correo de acceso</span>
              <strong>{createdCredentials.email}</strong>
            </div>

            <div>
              <span>Contraseña inicial</span>
              <strong>{createdCredentials.password}</strong>
            </div>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={copyCredentials}
          >
            <Copy size={17} />
            Copiar credenciales
          </button>

        </div>
      )}

      {/* FORMULARIO DE REGISTRO */}

      {showForm && (
        <form
          className="content-card user-form"
          onSubmit={addUser}
        >

          <div className="form-heading">
            <div>
              <h3>
                <User size={20} />
                Registrar nuevo usuario
              </h3>
              <p>
                Completa los datos para crear una cuenta.
              </p>
            </div>

            <button
              type="button"
              className="icon-button"
              onClick={closeForm}
              title="Cerrar formulario"
            >
              <X size={20} />
            </button>
          </div>

          <div className="form-grid">

            <label>
              Nombre completo

              <div className="user-input">
                <User size={18} />

                <input
                  type="text"
                  placeholder="Ingresa el nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </label>

            <label>
              Correo electrónico

              <div className="user-input">
                <Mail size={18} />

                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </label>

            <label>
              Contraseña inicial

              <div className="user-input password-input">
                <LockKeyhole size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Crea una contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Mostrar u ocultar contraseña"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <small className="password-help">
                Mínimo 8 caracteres, una letra, un número
                y un signo especial.
              </small>
            </label>

            <label>
              Rol del usuario

              <div className="user-input">
                <ShieldCheck size={18} />

                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="ADMINISTRADOR">
                    Administrador
                  </option>
                  <option value="TECNICO">
                    Técnico RAEE
                  </option>
                  <option value="OPERADOR">
                    Operador
                  </option>
                </select>
              </div>
            </label>

          </div>

          {error && (
            <div className="user-error">
              {error}
            </div>
          )}

          <div className="form-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={closeForm}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="primary-button"
            >
              <Plus size={17} />
              Crear usuario
            </button>

          </div>

        </form>
      )}

      {/* TABLA DE USUARIOS */}

      <div className="content-card">

        <div className="users-table-heading">
          <div>
            <h3>
              <Users size={20} />
              Usuarios registrados
            </h3>

            <p>
              Consulta y administra las cuentas del sistema.
            </p>
          </div>
        </div>

        <div className="table-wrapper">

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo electrónico</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>

                  <td>#{user.id}</td>

                  <td>
                    <strong className="user-name">
                      {user.name}
                    </strong>
                  </td>

                  <td>{user.email}</td>

                  <td>
                    <span className="role-label">
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        user.active
                          ? "user-status active"
                          : "user-status inactive"
                      }
                    >
                      {user.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td>
                    <div className="user-actions">

                      <button
                        type="button"
                        className="action-button"
                        onClick={() => toggleStatus(user.id)}
                        title={
                          user.active
                            ? "Desactivar usuario"
                            : "Activar usuario"
                        }
                      >
                        {user.active ? (
                          <UserX size={17} />
                        ) : (
                          <UserCheck size={17} />
                        )}
                      </button>

                      <button
                        type="button"
                        className="action-button delete"
                        onClick={() => deleteUser(user.id)}
                        title="Eliminar usuario"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-users">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}

            </tbody>
          </table>

        </div>
      </div>

    </section>
  );
}

export default Usuarios;
