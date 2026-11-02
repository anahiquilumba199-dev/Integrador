
import { Recycle, LockKeyhole } from "lucide-react";
import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    alert("La autenticación se conectará con el backend del proyecto.");
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">
          <Recycle size={38} />
        </div>

        <h1>EcoRAEE Cloud</h1>
        <p>Gestión de residuos electrónicos</p>

        <label>Correo electrónico</label>
        <input
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="primary-button login-button">
          <LockKeyhole size={18} /> Iniciar sesión
        </button>
      </form>
    </main>
  );
}

export default Login;
