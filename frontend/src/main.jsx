import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Estilos de EcoRAEE Cloud
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/dashboard.css";
import "./styles/components.css";
import "./styles/forms.css";
import "./styles/modules.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);