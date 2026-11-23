import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Recycle,
  LockKeyhole,
  Eye,
  EyeOff,
  Mail
} from "lucide-react";

import { useAuth } from "../context/useAuth";
import { ROLE_HOME } from "../config/permissions";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login, autenticado, usuario } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  if (autenticado && usuario) {
    navigate(ROLE_HOME[usuario.rol] || "/dashboard", {
      replace: true
    });
  }
}, [autenticado, usuario, navigate]);
 
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const resultado = await login(email, password);

    if (!resultado.success) {
      setError(resultado.message);
      return;
    }

    const ruta = ROLE_HOME[resultado.usuario.rol] || "/dashboard";

    navigate(ruta, { replace: true });
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">
          <Recycle size={38} />
        </div>

        <h1>EcoRAEE Cloud</h1>

        <p>
          Gestión de residuos de aparatos eléctricos y electrónicos
        </p>

        <h2 className="login-subtitle">
          Iniciar sesión
        </h2>

        <label htmlFor="login-email">
          Correo electrónico
        </label>

        <div className="login-input-container">
          <Mail size={18} />

          <input
            id="login-email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <label htmlFor="login-password">
          Contraseña
        </label>

        <div className="password-container">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            aria-label={
              showPassword
                ? "Ocultar contraseña"
                : "Mostrar contraseña"
            }
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff size={19} />
            ) : (
              <Eye size={19} />
            )}
          </button>
        </div>

        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="login-button"
        >
          <LockKeyhole size={18} />
          Iniciar sesión
        </button>

        <div className="login-info">
          <LockKeyhole size={15} />

          <span>
            El acceso es exclusivo para usuarios autorizados.
            Solicita tus credenciales al administrador.
          </span>
        </div>

        <footer>
          <p>EcoRAEE Cloud © 2026</p>

          <span>
            Gestión responsable de residuos electrónicos
          </span>
        </footer>
      </form>
    </main>
  );
}

export default Login;