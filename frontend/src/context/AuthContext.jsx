import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const DEMO_USERS = [
  {
    id: 1,
    nombre: "Administrador",
    email: "admin@ecoraee.com",
    password: "Admin123!",
    rol: "ADMINISTRADOR",
    activo: true
  },
  {
    id: 2,
    nombre: "Técnico",
    email: "tecnico@ecoraee.com",
    password: "Tecnico123!",
    rol: "TECNICO",
    activo: true
  },
  {
    id: 3,
    nombre: "Operador",
    email: "operador@ecoraee.com",
    password: "Operador123!",
    rol: "OPERADOR",
    activo: true
  }
];

function obtenerUsuarioGuardado() {
  try {
    const usuario = sessionStorage.getItem("ecoraee_usuario");
    return usuario ? JSON.parse(usuario) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(obtenerUsuarioGuardado);

  function login(email, password) {
    const usuarioEncontrado = DEMO_USERS.find(
      (user) =>
        user.email.toLowerCase() === email.trim().toLowerCase() &&
        user.password === password &&
        user.activo
    );

    if (!usuarioEncontrado) {
      return {
        success: false,
        message: "Correo o contraseña incorrectos."
      };
    }

    const datosUsuario = {
      id: usuarioEncontrado.id,
      nombre: usuarioEncontrado.nombre,
      email: usuarioEncontrado.email,
      rol: usuarioEncontrado.rol
    };

    sessionStorage.setItem(
      "ecoraee_usuario",
      JSON.stringify(datosUsuario)
    );

    setUsuario(datosUsuario);

    return {
      success: true,
      usuario: datosUsuario
    };
  }

  function logout() {
    sessionStorage.removeItem("ecoraee_usuario");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout,
        autenticado: Boolean(usuario)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider.");
  }

  return context;
}