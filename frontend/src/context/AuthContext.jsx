import { useEffect, useState } from "react";
import api from "../services/api";

import { AuthContext } from "./useAuth";

function obtenerUsuarioGuardado() {
  try {
    return sessionStorage.getItem("ecoraee_token")
      ? JSON.parse(sessionStorage.getItem("ecoraee_usuario"))
      : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(obtenerUsuarioGuardado);

  function logout() {
    sessionStorage.removeItem("ecoraee_token");
    sessionStorage.removeItem("ecoraee_usuario");
    setUsuario(null);
  }

  useEffect(() => {
    window.addEventListener("ecoraee-sesion-vencida", logout);
    return () => window.removeEventListener("ecoraee-sesion-vencida", logout);
  }, []);

  async function login(email, password) {
    try {
      const { user, access_token } = await api.post("/auth/login", {
        email: email.trim().toLowerCase(), password
      });
      const datosUsuario = {
        id: user.id, nombre: user.name, email: user.email, rol: user.role
      };
      sessionStorage.setItem("ecoraee_token", access_token);
      sessionStorage.setItem("ecoraee_usuario", JSON.stringify(datosUsuario));
      setUsuario(datosUsuario);
      return { success: true, usuario: datosUsuario };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, autenticado: Boolean(usuario) }}>
      {children}
    </AuthContext.Provider>
  );
}
